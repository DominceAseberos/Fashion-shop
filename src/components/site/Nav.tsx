import { useEffect, useState } from "react";

const links: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Collection", href: "#lookbook" },
  { label: "Atelier", href: "#atelier" },
  { label: "Journal", href: "#manifesto" },
  { label: "Contact", href: "#atelier" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10"
      >
        <a
          href="#top"
          aria-label="Vayora — home"
          className="font-display text-2xl tracking-widest text-foreground transition-colors"
        >
          VAYORA
        </a>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="smallcaps text-foreground/80 transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="smallcaps hidden text-muted-foreground md:inline">
          AW · MMXXVI
        </span>
      </nav>
    </header>
  );
}
