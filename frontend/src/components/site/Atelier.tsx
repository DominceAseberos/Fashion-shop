import { useState, type FormEvent } from "react";
import atelierImg from "@/assets/atelier-detail.jpg";

export function Atelier() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    // Simulate API request
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <section
      id="atelier"
      aria-labelledby="atelier-heading"
      className="relative bg-background py-32 md:py-48"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-6 md:px-10">
        <div className="col-span-12 md:col-span-5">
          <div className="overflow-hidden">
            <img
              src={atelierImg}
              alt="Close-up of hands hand-stitching a draped fabric in the Cheq atelier."
              width={1600}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <p className="smallcaps mt-4 text-muted-foreground">
            The atelier — Via Solferino, Milano
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 md:pl-10">
          <p className="smallcaps text-accent">Chapter 04 — The Invitation</p>
          <h2
            id="atelier-heading"
            className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-6xl"
          >
            Visit the atelier.
            <br />
            <em className="italic text-accent">By appointment only.</em>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/80">
            Two days a week we open our doors. Bring a coffee, a question, or a
            measurement. We will receive you slowly.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-12 max-w-md"
            aria-label="Request an appointment"
          >
            <label htmlFor="email" className="smallcaps text-foreground/70">
              Receive the dossier
            </label>
            <div className="mt-3 flex items-end gap-4 border-b border-foreground/30 pb-2 focus-within:border-accent">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@address.com"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent font-body text-lg text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
                aria-describedby={status !== "idle" ? "email-status" : undefined}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="smallcaps shrink-0 text-foreground transition-colors hover:text-accent focus-visible:text-accent disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Submit →"}
              </button>
            </div>
            
            <div id="email-status" role="status" className="mt-3 h-6">
              {status === "success" && (
                <p className="text-sm italic text-green-700">
                  Thank you. The dossier is on its way.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm italic text-red-700">
                  Something went wrong. Please try again.
                </p>
              )}
              {status === "idle" && (
                <p className="text-xs text-muted-foreground">
                  A quarterly letter. No noise. Unsubscribe in one click.
                </p>
              )}
            </div>
          </form>

          <dl className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <dt className="smallcaps text-muted-foreground">Address</dt>
              <dd className="mt-2 font-display text-lg text-foreground">
                Via Solferino 14
                <br />
                Milano 20121
              </dd>
            </div>
            <div>
              <dt className="smallcaps text-muted-foreground">Hours</dt>
              <dd className="mt-2 font-display text-lg text-foreground">
                Thu — Fri
                <br />
                11.00 — 18.00
              </dd>
            </div>
            <div>
              <dt className="smallcaps text-muted-foreground">Contact</dt>
              <dd className="mt-2 font-display text-lg text-foreground">
                atelier@cheq.house
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
