export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-5xl tracking-[0.25em] text-foreground md:text-7xl">
              VAYORA
            </p>
            <p className="smallcaps mt-3 text-muted-foreground">
              Quiet luxury for the modern silhouette
            </p>
          </div>
          <ul className="flex flex-wrap gap-6">
            {["Instagram", "Pinterest", "Journal", "Press"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="smallcaps text-foreground/70 transition-colors hover:text-accent"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} Maison Vayora · Milano</p>
          <p className="italic">Cut by hand. Worn slowly.</p>
        </div>
      </div>
    </footer>
  );
}
