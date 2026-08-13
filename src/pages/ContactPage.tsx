import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import atelierDetail from "@/assets/atelier-detail.jpg";

export function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Correspondence"
        title={<>Begin with a <em className="font-light italic text-cream/80">conversation.</em></>}
        intro="For private fittings, garment enquiries, press notes or a visit to the atelier, write to the house. We answer correspondence in the same considered spirit as the clothes."
        image={atelierDetail}
        alt="Close detail of hands carefully stitching fabric in an atelier."
        imagePosition="50% 48%"
      />

      <section className="bg-background py-20 sm:py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-6 md:grid-cols-12 md:gap-10 md:px-10">
          <ScrollReveal className="md:col-span-5">
            <p className="smallcaps text-accent">Contact the house</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.03] sm:text-5xl md:text-6xl">
              Tell us what you would like to see, fit or discuss.
            </h2>
            <p className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-foreground/72 sm:text-lg">
              Appointments are intentionally unhurried. Let us know whether you are interested in a particular garment, a fitting, or simply visiting the room where the collection is made.
            </p>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-6 md:col-start-7" delay={0.08}>
            <dl className="border-t border-foreground/20">
              <div className="grid gap-2 border-b border-foreground/15 py-7 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="smallcaps text-foreground/45">Atelier</dt>
                <dd className="font-display text-2xl sm:text-3xl">Via Solferino 14 · Milano 20121</dd>
              </div>
              <div className="grid gap-2 border-b border-foreground/15 py-7 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="smallcaps text-foreground/45">Email</dt>
                <dd className="font-display text-2xl sm:text-3xl">
                  <a className="break-all transition-colors hover:text-accent" href="mailto:atelier@cheq.house">
                    atelier@cheq.house
                  </a>
                </dd>
              </div>
              <div className="grid gap-2 border-b border-foreground/15 py-7 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="smallcaps text-foreground/45">Appointments</dt>
                <dd className="font-display text-2xl sm:text-3xl">Thursday — Friday · 11.00 — 18.00</dd>
              </div>
              <div className="grid gap-2 border-b border-foreground/15 py-7 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="smallcaps text-foreground/45">Press</dt>
                <dd className="font-display text-2xl sm:text-3xl">
                  <a className="break-all transition-colors hover:text-accent" href="mailto:press@cheq.house">
                    press@cheq.house
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="mailto:atelier@cheq.house"
                className="smallcaps inline-flex min-h-12 items-center justify-center bg-ink px-6 py-3 text-cream transition-colors hover:bg-accent"
              >
                Write to the atelier →
              </a>
              <Link
                to="/atelier"
                className="smallcaps inline-flex min-h-12 items-center justify-center border border-foreground/25 px-6 py-3 transition-colors hover:border-accent hover:text-accent"
              >
                Visit information
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-cream sm:py-24 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 text-center sm:px-6 md:px-10">
          <ScrollReveal>
            <p className="smallcaps text-cream/45">For the current edit</p>
            <p className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
              Prefer to begin with the clothes?
            </p>
            <Link
              to="/collection"
              className="smallcaps mt-8 inline-flex items-center gap-4 border-b border-cream/30 pb-2 transition-colors hover:border-accent hover:text-accent"
            >
              View Collection I — VI <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
