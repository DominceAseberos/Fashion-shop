import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-foreground/10 bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-6 sm:py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Link
              to="/"
              className="font-display text-[clamp(3rem,10vw,6rem)] leading-none tracking-[0.18em] text-foreground transition-colors hover:text-accent"
            >
              CHEQ
            </Link>
            <p className="smallcaps mt-4 text-foreground/45">
              Quiet luxury for the modern silhouette
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
            {[
              ["Collection", "/collection"],
              ["Atelier", "/atelier"],
              ["Journal", "/journal"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  className="smallcaps text-foreground/65 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} Maison Cheq · Milano</p>
          <p className="italic">Cut by hand. Worn slowly.</p>
        </div>
      </div>
    </footer>
  );
}
