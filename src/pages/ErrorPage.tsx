import { Link } from "react-router-dom";
import { Nav } from "@/components/site/Nav";

export function ErrorPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center relative isolate px-6 pt-32 pb-16 md:px-10">
        <div className="relative z-10 mx-auto max-w-[1440px] flex flex-col items-center text-center">
          <p className="smallcaps text-foreground/70 mb-4">404 — Not Found</p>
          <h1 className="font-display text-6xl leading-[0.9] tracking-tight text-foreground md:text-8xl lg:text-9xl mb-8">
            The page has
            <br />
            <em className="font-light italic text-accent">slipped</em>
            <br />
            away.
          </h1>
          <p className="max-w-md font-body text-base leading-relaxed text-foreground/80 mb-10">
            It seems this thread has unraveled. The page you are looking for does not exist in our current collection.
          </p>
          <Link
            to="/"
            className="smallcaps inline-flex items-center gap-3 text-foreground hover:text-accent transition-colors"
          >
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            Return to the Atelier
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
          </Link>
        </div>
      </main>
    </div>
  );
}
