import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Collection", href: "/collection" },
  { label: "Atelier", href: "/atelier" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const location = useLocation();
  const open = menuPath === location.pathname;

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || open
          ? "border-foreground/10 bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-6 md:px-10 md:py-5"
      >
        <Link
          to="/"
          aria-label="Cheq — home"
          className="relative z-50 font-display text-2xl tracking-[0.18em] text-foreground transition-colors hover:text-accent"
        >
          CHEQ
        </Link>

        <ul className="hidden items-center gap-7 lg:gap-10 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `smallcaps transition-colors hover:text-accent ${
                    isActive ? "text-accent" : "text-foreground/80"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <span className="smallcaps hidden text-foreground/55 lg:inline">AW · MMXXVI</span>

        <button
          type="button"
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-accent md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setMenuPath(open ? null : location.pathname)}
        >
          {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 top-0 z-40 bg-cream transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 sm:px-6">
          <p className="smallcaps mb-6 text-foreground/45">Navigate the house</p>
          <ul className="border-t border-foreground/15">
            {links.map((link, index) => (
              <li key={link.label} className="border-b border-foreground/15">
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `group flex items-baseline justify-between py-4 font-display text-[clamp(2.7rem,14vw,5rem)] leading-none transition-colors ${
                      isActive ? "text-accent" : "text-foreground hover:text-accent"
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <span className="smallcaps font-body text-foreground/35">0{index + 1}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <p className="smallcaps mt-8 text-foreground/45">Maison Cheq · Milano</p>
        </div>
      </div>
    </header>
  );
}
