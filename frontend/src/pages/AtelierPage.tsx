import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { ParallaxImage } from "@/components/site/ParallaxImage";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import atelierStudio from "@/assets/atelier-studio.jpg";
import tailoringTable from "@/assets/tailoring-table.jpg";
import atelierDetail from "@/assets/atelier-detail.jpg";

const process = [
  {
    index: "01",
    title: "Draft",
    body: "A silhouette begins on paper with balance, proportion and the intended movement of the cloth. We remove before we add.",
  },
  {
    index: "02",
    title: "Cut",
    body: "Patterns are placed by grain, weight and fall. Every cut is made with the final body in mind, not only the flat garment.",
  },
  {
    index: "03",
    title: "Fit",
    body: "The first fitting resolves posture, ease and length. Adjustments are marked directly on the garment and returned to the table.",
  },
  {
    index: "04",
    title: "Finish",
    body: "Hems, internal structure and final pressing are completed slowly. The quietest details are often the ones that determine how a piece lives.",
  },
] as const;

export function AtelierPage() {
  return (
    <main>
      <PageHero
        eyebrow="The Atelier — Milano"
        title={<>Made close to <em className="font-light italic text-cream/80">the hand.</em></>}
        intro="Behind every Cheq garment is a small sequence of deliberate decisions: paper pattern, cloth, fitting, adjustment and finish. The atelier is where those decisions remain visible."
        image={atelierStudio}
        alt="A bright tailor studio with garments, worktables and dress forms."
        imagePosition="50% 55%"
      />

      <section className="bg-background py-20 sm:py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-6 md:grid-cols-12 md:gap-10 md:px-10">
          <ScrollReveal className="md:col-span-4">
            <p className="smallcaps text-accent">A room for making</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Nothing is hidden behind speed.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-7 md:col-start-6" delay={0.08}>
            <div className="max-w-2xl space-y-6 text-pretty text-base leading-relaxed text-foreground/78 sm:text-lg">
              <p>
                The atelier is intentionally small. Patterns can stay on the table long enough to be reconsidered; garments can return to the body before a seam becomes final. That extra time is not decoration — it is part of the construction.
              </p>
              <p>
                We work from the inside out. Structure is kept only where it changes the line, and hand finishing is used where a machine would make the cloth behave differently. The result should feel resolved without feeling overworked.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-cream pb-20 sm:pb-24 md:pb-36">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-5 sm:px-6 md:grid-cols-12 md:gap-8 md:px-10">
          <div className="md:col-span-7">
            <ParallaxImage
              src={tailoringTable}
              alt="Tailoring table with fabric, measuring tape and dressmaking tools."
              className="aspect-[4/3]"
              imageClassName="min-h-full"
            />
            <p className="smallcaps mt-3 text-foreground/50">On the table — measure, mark, cut</p>
          </div>
          <div className="md:col-span-5 md:pt-24">
            <ParallaxImage
              src={atelierDetail}
              alt="Hands carefully stitching fabric in a fashion atelier."
              className="aspect-[4/5]"
              imageClassName="min-h-full"
            />
            <p className="smallcaps mt-3 text-foreground/50">At the finish — detail by hand</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="atelier-process-heading" className="bg-ink py-20 text-cream sm:py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10">
          <ScrollReveal className="max-w-3xl">
            <p className="smallcaps text-cream/50">The sequence</p>
            <h2 id="atelier-process-heading" className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
              Four moments before a garment leaves the room.
            </h2>
          </ScrollReveal>

          <div className="mt-12 border-t border-cream/15 md:mt-16">
            {process.map((step, index) => (
              <ScrollReveal key={step.index} delay={Math.min(index * 0.05, 0.12)}>
                <article className="grid gap-4 border-b border-cream/15 py-7 sm:grid-cols-[4rem_1fr] md:grid-cols-12 md:gap-8 md:py-9">
                  <p className="smallcaps text-cream/35 md:col-span-1">{step.index}</p>
                  <h3 className="font-display text-3xl sm:text-4xl md:col-span-3">{step.title}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-cream/65 sm:text-base md:col-span-7 md:col-start-6">
                    {step.body}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-6 md:grid-cols-12 md:px-10">
          <ScrollReveal className="md:col-span-7">
            <p className="smallcaps text-accent">Private appointments</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.03] sm:text-5xl md:text-7xl">
              Come with a measurement, a question, or simply time.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-4 md:col-start-9" delay={0.08}>
            <dl className="space-y-7 border-t border-foreground/15 pt-6">
              <div>
                <dt className="smallcaps text-foreground/45">Address</dt>
                <dd className="mt-2 font-display text-2xl">Via Solferino 14 · Milano 20121</dd>
              </div>
              <div>
                <dt className="smallcaps text-foreground/45">Appointments</dt>
                <dd className="mt-2 font-display text-2xl">Thursday — Friday · 11.00 — 18.00</dd>
              </div>
              <div>
                <dt className="smallcaps text-foreground/45">Correspondence</dt>
                <dd className="mt-2 font-display text-2xl">atelier@cheq.house</dd>
              </div>
            </dl>
            <Link
              to="/contact"
              className="smallcaps mt-9 inline-flex items-center gap-4 border-b border-foreground/30 pb-2 transition-colors hover:border-accent hover:text-accent"
            >
              Request an appointment <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
