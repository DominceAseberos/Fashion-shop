export type CmsScope = "route" | "global";

export interface CmsTextPatch {
  id: string;
  kind: "text";
  route: string;
  scope: CmsScope;
  selector: string;
  textIndex: number;
  value: string;
}

export interface CmsImagePatch {
  id: string;
  kind: "image";
  route: string;
  scope: CmsScope;
  selector: string;
  src: string;
  alt: string;
}

export type CmsPatch = CmsTextPatch | CmsImagePatch;

export interface CmsSettings {
  title: string;
  description: string;
}

const PATCHES_KEY = "cheq.cms.patches.v1";
const SETTINGS_KEY = "cheq.cms.settings.v1";

export const defaultCmsSettings: CmsSettings = {
  title: "Cheq — Quiet luxury for the modern silhouette",
  description: "Quiet luxury for the modern silhouette",
};

export function getCmsPatches(): CmsPatch[] {
  try {
    const raw = window.localStorage.getItem(PATCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CmsPatch[]) : [];
  } catch {
    return [];
  }
}

export function saveCmsPatches(patches: CmsPatch[]): void {
  window.localStorage.setItem(PATCHES_KEY, JSON.stringify(patches));
  window.dispatchEvent(new CustomEvent("cheq:cms-updated"));
}

export function getCmsSettings(): CmsSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultCmsSettings;
    return { ...defaultCmsSettings, ...(JSON.parse(raw) as Partial<CmsSettings>) };
  } catch {
    return defaultCmsSettings;
  }
}

export function saveCmsSettings(settings: CmsSettings): void {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("cheq:cms-updated"));
}

export function resetCms(): void {
  window.localStorage.removeItem(PATCHES_KEY);
  window.localStorage.removeItem(SETTINGS_KEY);
  window.dispatchEvent(new CustomEvent("cheq:cms-updated"));
}

export function resetCmsRoute(route: string): void {
  const next = getCmsPatches().filter(
    (patch) => patch.scope === "global" || patch.route !== route,
  );
  saveCmsPatches(next);
}

export function upsertCmsPatch(patch: CmsPatch): void {
  const patches = getCmsPatches();
  const index = patches.findIndex((item) => item.id === patch.id);
  if (index >= 0) patches[index] = patch;
  else patches.push(patch);
  saveCmsPatches(patches);
}

export function removeCmsPatch(id: string): void {
  saveCmsPatches(getCmsPatches().filter((patch) => patch.id !== id));
}

export function cssPath(element: Element): string {
  if (element.id === "root") return "#root";

  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current.id !== "root") {
    const tagName = current.tagName;
    const tag = tagName.toLowerCase();
    const parentElement: Element | null = current.parentElement;
    if (!parentElement) break;
    const siblings: Element[] = Array.from(parentElement.children).filter(
      (child: Element) => child.tagName === tagName,
    );
    const position = siblings.indexOf(current) + 1;
    parts.unshift(`${tag}:nth-of-type(${position})`);
    current = parentElement;
  }

  return `#root > ${parts.join(" > ")}`;
}

export function getTextNodeIndex(node: Text): number {
  const parent = node.parentElement;
  if (!parent) return 0;
  const textNodes = Array.from(parent.childNodes).filter(
    (child): child is Text => child.nodeType === Node.TEXT_NODE,
  );
  return Math.max(0, textNodes.indexOf(node));
}

export function getTextNode(element: Element, index: number): Text | null {
  const textNodes = Array.from(element.childNodes).filter(
    (child): child is Text => child.nodeType === Node.TEXT_NODE,
  );
  return textNodes[index] ?? null;
}

export function makeTextPatchId(
  scope: CmsScope,
  route: string,
  selector: string,
  textIndex: number,
): string {
  return `text:${scope}:${scope === "global" ? "*" : route}:${selector}:${textIndex}`;
}

export function makeImagePatchId(
  scope: CmsScope,
  route: string,
  selector: string,
): string {
  return `image:${scope}:${scope === "global" ? "*" : route}:${selector}`;
}

export function applyCmsPatches(doc: Document, route: string): void {
  const patches = getCmsPatches().filter(
    (patch) => patch.scope === "global" || patch.route === route,
  );

  for (const patch of patches) {
    const element = doc.querySelector(patch.selector);
    if (!element) continue;

    if (patch.kind === "text") {
      const node = getTextNode(element, patch.textIndex);
      if (node && node.nodeValue !== patch.value) node.nodeValue = patch.value;
    } else if (element instanceof HTMLImageElement) {
      if (element.src !== patch.src) element.src = patch.src;
      if (element.alt !== patch.alt) element.alt = patch.alt;
    }
  }

  const settings = getCmsSettings();
  if (doc.title !== settings.title) doc.title = settings.title;
  let meta = doc.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = doc.createElement("meta");
    meta.name = "description";
    doc.head.appendChild(meta);
  }
  if (meta.content !== settings.description) meta.content = settings.description;
}
