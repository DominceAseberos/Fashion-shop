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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled && !open
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
            className="font-display text-2xl tracking-[0.18em] text-foreground transition-colors hover:text-accent"
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
            className="inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-accent md:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Open menu"
            onClick={() => setMenuPath(location.pathname)}
          >
            <Menu aria-hidden="true" size={24} />
          </button>
        </nav>
      </header>

      {/* Full-screen Mobile Navigation Drawer (Independent of Header) */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col justify-between bg-[#F4F1EC] transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto visible opacity-100 translate-y-0"
            : "pointer-events-none invisible opacity-0 -translate-y-2"
        }`}
      >
        {/* Top Header inside overlay */}
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-6">
          <Link
            to="/"
            aria-label="Cheq — home"
            onClick={() => setMenuPath(null)}
            className="font-display text-2xl tracking-[0.18em] text-foreground transition-colors hover:text-accent"
          >
            CHEQ
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-accent"
            aria-label="Close menu"
            onClick={() => setMenuPath(null)}
          >
            <X aria-hidden="true" size={24} />
          </button>
        </div>

        {/* Links Content */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
          <p className="smallcaps mb-6 text-foreground/45">Navigate the house</p>
          <ul className="border-t border-foreground/15">
            {links.map((link, index) => (
              <li key={link.label} className="border-b border-foreground/15">
                <NavLink
                  to={link.href}
                  onClick={() => setMenuPath(null)}
                  className={({ isActive }) =>
                    `group flex items-baseline justify-between py-4 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-none transition-colors ${
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
    </>
  );
}
