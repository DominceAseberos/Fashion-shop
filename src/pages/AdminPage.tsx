import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  cssPath,
  defaultCmsSettings,
  getCmsPatches,
  getCmsSettings,
  getTextNodeIndex,
  makeImagePatchId,
  makeTextPatchId,
  removeCmsPatch,
  resetCms,
  resetCmsRoute,
  saveCmsSettings,
  upsertCmsPatch,
  type CmsImagePatch,
  type CmsPatch,
  type CmsScope,
  type CmsTextPatch,
} from "@/cms/cmsRuntime";

const routes = [
  { label: "Home", value: "/" },
  { label: "Collection", value: "/collection" },
  { label: "Atelier", value: "/atelier" },
  { label: "Journal", value: "/journal" },
  { label: "Contact", value: "/contact" },
] as const;

type Selection =
  | {
      kind: "text";
      route: string;
      selector: string;
      textIndex: number;
      value: string;
      scope: CmsScope;
      tag: string;
    }
  | {
      kind: "image";
      route: string;
      selector: string;
      src: string;
      alt: string;
      scope: CmsScope;
      tag: string;
    };

type LegacyCaretDocument = Document & {
  caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

function isTextNode(node: Node | null | undefined): node is Text {
  return node?.nodeType === 3;
}

function firstTextNode(element: Element): Text | null {
  const walker = element.ownerDocument.createTreeWalker(element, 4);
  let node = walker.nextNode();
  while (node) {
    if (isTextNode(node) && node.nodeValue?.trim()) return node;
    node = walker.nextNode();
  }
  return null;
}

function textNodeAtPoint(doc: Document, x: number, y: number): Text | null {
  const position = doc.caretPositionFromPoint?.(x, y);
  if (isTextNode(position?.offsetNode)) return position.offsetNode;
  const range = (doc as LegacyCaretDocument).caretRangeFromPoint?.(x, y);
  if (isTextNode(range?.startContainer)) return range.startContainer;
  return null;
}

function patchLabel(patch: CmsPatch): string {
  if (patch.kind === "image") return `Image · ${patch.selector}`;
  return `Text · ${patch.selector}`;
}

export function AdminPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [route, setRoute] = useState<string>("/");
  const [previewMode, setPreviewMode] = useState<"select" | "interact">("select");
  const previewModeRef = useRef<"select" | "interact">("select");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [revision, setRevision] = useState(0);
  const [patches, setPatches] = useState<CmsPatch[]>(() => getCmsPatches());
  const [settings, setSettings] = useState(() => getCmsSettings());
  const [notice, setNotice] = useState("Click text or an image in the preview to edit it.");

  const refreshState = useCallback(() => {
    setPatches(getCmsPatches());
    setRevision((value) => value + 1);
  }, []);

  const relevantPatches = useMemo(
    () => patches.filter((patch) => patch.scope === "global" || patch.route === route),
    [patches, route],
  );

  const attachPreviewEditor = useCallback(() => {
    cleanupRef.current?.();
    const frame = iframeRef.current;
    const doc = frame?.contentDocument;
    if (!doc || !frame?.contentWindow) return;

    doc.body.style.cursor = previewModeRef.current === "select" ? "crosshair" : "auto";
    let highlighted: HTMLElement | null = null;

    const clearHighlight = (): void => {
      if (!highlighted) return;
      highlighted.style.outline = "";
      highlighted.style.outlineOffset = "";
      highlighted = null;
    };

    const onMove = (event: MouseEvent): void => {
      if (previewModeRef.current === "interact") {
        clearHighlight();
        return;
      }
      const target = event.target as Node | null;
      if (!target || target.nodeType !== 1) return;
      const element = target as HTMLElement;
      if (highlighted === element) return;
      clearHighlight();
      highlighted = element;
      highlighted.style.outline = "1px solid rgba(244,241,236,.95)";
      highlighted.style.outlineOffset = "2px";
    };

    const onClick = (event: MouseEvent): void => {
      if (previewModeRef.current === "interact") return;
      event.preventDefault();
      event.stopPropagation();
      const target = event.target as Node | null;
      if (!target || target.nodeType !== 1) return;
      const element = target as HTMLElement;

      if (element.tagName.toLowerCase() === "img") {
        const image = element as HTMLImageElement;
        const selector = cssPath(image);
        const routePatch = getCmsPatches().find(
          (patch): patch is CmsImagePatch =>
            patch.kind === "image" &&
            patch.selector === selector &&
            (patch.scope === "global" || patch.route === route),
        );
        setSelection({
          kind: "image",
          route,
          selector,
          src: routePatch?.src ?? image.src,
          alt: routePatch?.alt ?? image.alt,
          scope: routePatch?.scope ?? "route",
          tag: "img",
        });
        setNotice("Image selected. Change its source URL or upload a small image.");
        return;
      }

      const node = textNodeAtPoint(doc, event.clientX, event.clientY) ?? firstTextNode(element);
      if (!node?.parentElement) return;
      const parent = node.parentElement;
      const selector = cssPath(parent);
      const textIndex = getTextNodeIndex(node);
      const routePatch = getCmsPatches().find(
        (patch): patch is CmsTextPatch =>
          patch.kind === "text" &&
          patch.selector === selector &&
          patch.textIndex === textIndex &&
          (patch.scope === "global" || patch.route === route),
      );

      setSelection({
        kind: "text",
        route,
        selector,
        textIndex,
        value: routePatch?.value ?? node.nodeValue ?? "",
        scope: routePatch?.scope ?? "route",
        tag: parent.tagName.toLowerCase(),
      });
      setNotice("Text selected. Edit it in the inspector and save.");
    };

    doc.addEventListener("mousemove", onMove, true);
    doc.addEventListener("click", onClick, true);

    cleanupRef.current = () => {
      clearHighlight();
      doc.removeEventListener("mousemove", onMove, true);
      doc.removeEventListener("click", onClick, true);
    };
  }, [route]);

  const saveSelection = (): void => {
    if (!selection) return;

    if (selection.kind === "text") {
      removeCmsPatch(makeTextPatchId("route", selection.route, selection.selector, selection.textIndex));
      removeCmsPatch(makeTextPatchId("global", selection.route, selection.selector, selection.textIndex));
      upsertCmsPatch({
        id: makeTextPatchId(
          selection.scope,
          selection.route,
          selection.selector,
          selection.textIndex,
        ),
        kind: "text",
        route: selection.route,
        scope: selection.scope,
        selector: selection.selector,
        textIndex: selection.textIndex,
        value: selection.value,
      });
    } else {
      removeCmsPatch(makeImagePatchId("route", selection.route, selection.selector));
      removeCmsPatch(makeImagePatchId("global", selection.route, selection.selector));
      upsertCmsPatch({
        id: makeImagePatchId(selection.scope, selection.route, selection.selector),
        kind: "image",
        route: selection.route,
        scope: selection.scope,
        selector: selection.selector,
        src: selection.src,
        alt: selection.alt,
      });
    }

    setNotice("Saved. The public site now uses this change in this browser.");
    refreshState();
  };

  const uploadImage = (file: File | undefined): void => {
    if (!file || !selection || selection.kind !== "image") return;
    if (!file.type.startsWith("image/")) {
      setNotice("Choose an image file.");
      return;
    }
    if (file.size > 1_000_000) {
      setNotice("For the guest demo, keep uploaded images under 1 MB so browser storage stays reliable.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setSelection((current) =>
        current?.kind === "image" ? { ...current, src: reader.result as string } : current,
      );
      setNotice("Image loaded into the editor. Save the change when ready.");
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = (): void => {
    saveCmsSettings(settings);
    setNotice("SEO title and description saved.");
    refreshState();
  };

  const clearRoute = (): void => {
    resetCmsRoute(route);
    setSelection(null);
    setNotice("Page-specific edits were cleared. Global edits are preserved.");
    refreshState();
  };

  const clearAll = (): void => {
    resetCms();
    setSettings(defaultCmsSettings);
    setSelection(null);
    setNotice("All guest CMS changes were reset to the original fashion site.");
    refreshState();
  };

  const removePatch = (id: string): void => {
    removeCmsPatch(id);
    setNotice("Change removed.");
    refreshState();
  };

  return (
    <main className="min-h-[100dvh] bg-[#11100f] text-[#f4f1ec]">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-2xl tracking-[0.2em]">CHEQ</Link>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
              Guest CMS demo
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em]">
            <Link to={route} target="_blank" className="border-b border-white/30 pb-1 text-white/70 hover:text-white">
              Open live page ↗
            </Link>
            <button type="button" onClick={clearRoute} className="border border-white/15 px-3 py-2 text-white/60 hover:border-white/35 hover:text-white">
              Reset page
            </button>
            <button type="button" onClick={clearAll} className="border border-[#8b4a4a] px-3 py-2 text-[#dca9a9] hover:bg-[#8b4a4a]/20">
              Reset all
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1800px] gap-0 lg:grid-cols-[minmax(0,1fr)_25rem]">
        <section className="min-w-0 border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-black/15 px-4 py-3 sm:px-6">
            {routes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  cleanupRef.current?.();
                  setRoute(item.value);
                  setSelection(null);
                  setRevision((value) => value + 1);
                  setNotice(`Editing ${item.label}. Click any text or image in the preview.`);
                }}
                className={`min-h-10 px-4 text-xs uppercase tracking-[0.13em] transition-colors ${
                  route === item.value
                    ? "bg-[#f4f1ec] text-[#11100f]"
                    : "border border-white/10 text-white/55 hover:border-white/30 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-1 border border-white/10 p-1">
              {(["select", "interact"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    previewModeRef.current = mode;
                    setPreviewMode(mode);
                    const doc = iframeRef.current?.contentDocument;
                    if (doc?.body) doc.body.style.cursor = mode === "select" ? "crosshair" : "auto";
                    setNotice(
                      mode === "select"
                        ? "Select mode: click text or an image to edit it."
                        : "Interact mode: use the site normally to open modals, links, and controls. Switch back to Select to edit them.",
                    );
                  }}
                  className={`min-h-8 px-3 text-[10px] uppercase tracking-[0.12em] ${
                    previewMode === mode
                      ? "bg-white/15 text-white"
                      : "text-white/40 hover:text-white/75"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#24211f] p-2 sm:p-4 lg:p-5">
            <div className="overflow-hidden rounded-sm border border-white/10 bg-white shadow-2xl">
              <iframe
                key={`${route}-${revision}`}
                ref={iframeRef}
                src={route}
                title={`CHEQ CMS preview — ${route}`}
                onLoad={attachPreviewEditor}
                className="h-[62dvh] min-h-[34rem] w-full bg-white lg:h-[calc(100dvh-10.5rem)]"
              />
            </div>
          </div>
        </section>

        <aside className="bg-[#171513] lg:max-h-[calc(100dvh-4.7rem)] lg:overflow-y-auto">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Visual editor</p>
            <h1 className="mt-2 font-display text-3xl">Content inspector</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{notice}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/35">
              Changes are saved only in this browser. This keeps the guest demo safe while behaving like a real CMS preview.
            </p>
          </div>

          <div className="border-b border-white/10 p-5 sm:p-6">
            {!selection ? (
              <div className="border border-dashed border-white/15 p-5 text-sm leading-relaxed text-white/45">
                Select content in the preview. Text is edited at the text-node level, so italic spans, headings and existing fashion typography stay intact.
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Selected</p>
                  <p className="mt-1 font-mono text-xs text-white/65">{selection.tag} · {selection.kind}</p>
                </div>

                {selection.kind === "text" ? (
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.13em] text-white/50">Text</span>
                    <textarea
                      value={selection.value}
                      onChange={(event) => setSelection({ ...selection, value: event.target.value })}
                      rows={Math.min(10, Math.max(3, Math.ceil(selection.value.length / 45)))}
                      className="mt-2 w-full resize-y border border-white/15 bg-black/20 p-3 text-sm leading-relaxed text-white outline-none focus:border-white/45"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.13em] text-white/50">Image URL</span>
                      <textarea
                        value={selection.src}
                        onChange={(event) => setSelection({ ...selection, src: event.target.value })}
                        rows={3}
                        className="mt-2 w-full resize-y border border-white/15 bg-black/20 p-3 font-mono text-xs leading-relaxed text-white outline-none focus:border-white/45"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.13em] text-white/50">Alt text</span>
                      <textarea
                        value={selection.alt}
                        onChange={(event) => setSelection({ ...selection, alt: event.target.value })}
                        rows={3}
                        className="mt-2 w-full resize-y border border-white/15 bg-black/20 p-3 text-sm leading-relaxed text-white outline-none focus:border-white/45"
                      />
                    </label>
                    <label className="block border border-dashed border-white/15 p-3 text-xs text-white/50 hover:border-white/30">
                      Upload replacement image · max 1 MB
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => uploadImage(event.target.files?.[0])}
                        className="mt-2 block w-full text-xs"
                      />
                    </label>
                  </div>
                )}

                <fieldset>
                  <legend className="text-xs uppercase tracking-[0.13em] text-white/50">Apply change to</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["route", "global"] as const).map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => setSelection({ ...selection, scope })}
                        className={`min-h-10 border px-3 text-xs uppercase tracking-[0.12em] ${
                          selection.scope === scope
                            ? "border-[#f4f1ec] bg-[#f4f1ec] text-[#11100f]"
                            : "border-white/15 text-white/50"
                        }`}
                      >
                        {scope === "route" ? "This page" : "All pages"}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="button"
                  onClick={saveSelection}
                  className="min-h-12 w-full bg-[#f4f1ec] px-5 text-xs uppercase tracking-[0.16em] text-[#11100f] hover:bg-white"
                >
                  Save content change
                </button>
              </div>
            )}
          </div>

          <div className="border-b border-white/10 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Site settings</p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.13em] text-white/50">SEO title</span>
                <input
                  value={settings.title}
                  onChange={(event) => setSettings({ ...settings, title: event.target.value })}
                  className="mt-2 w-full border border-white/15 bg-black/20 p-3 text-sm text-white outline-none focus:border-white/45"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.13em] text-white/50">Meta description</span>
                <textarea
                  value={settings.description}
                  onChange={(event) => setSettings({ ...settings, description: event.target.value })}
                  rows={3}
                  className="mt-2 w-full border border-white/15 bg-black/20 p-3 text-sm text-white outline-none focus:border-white/45"
                />
              </label>
              <button
                type="button"
                onClick={saveSettings}
                className="min-h-11 w-full border border-white/20 px-4 text-xs uppercase tracking-[0.14em] text-white/70 hover:border-white/45 hover:text-white"
              >
                Save site settings
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Saved changes</p>
              <span className="text-xs text-white/35">{relevantPatches.length}</span>
            </div>
            <div className="mt-4 space-y-2">
              {relevantPatches.length === 0 ? (
                <p className="text-sm text-white/35">No saved content changes for this view.</p>
              ) : (
                relevantPatches.map((patch) => (
                  <div key={patch.id} className="border border-white/10 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs text-white/65">{patchLabel(patch)}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/30">
                          {patch.scope === "global" ? "All pages" : patch.route}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePatch(patch.id)}
                        className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#dca9a9] hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
