import { useEffect } from "react";
import { applyCmsPatches } from "./cmsRuntime";

export function useCmsRuntime(route: string): void {
  useEffect(() => {
    let frame = 0;
    let queued = false;

    const apply = (): void => {
      applyCmsPatches(document, route);
    };

    const queueApply = (): void => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(() => {
        queued = false;
        apply();
      });
    };

    apply();

    const observer = new MutationObserver(queueApply);
    const root = document.getElementById("root");
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("cheq:cms-updated", queueApply);
    window.addEventListener("storage", queueApply);

    return () => {
      observer.disconnect();
      window.removeEventListener("cheq:cms-updated", queueApply);
      window.removeEventListener("storage", queueApply);
      window.cancelAnimationFrame(frame);
    };
  }, [route]);
}
