import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { ParallaxImage } from "@/components/site/ParallaxImage";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import manifestoModel from "@/assets/manifesto-model.jpg";
import journalStitch from "@/assets/journal-stitch.jpg";
import climaxMotion from "@/assets/climax-motion.jpg";

export function JournalPage() {
  return (
    <main>
      <PageHero
        eyebrow="Journal — Note 01"
        title={<>On making things <em className="font-light italic text-cream/80">that remain.</em></>}
        intro="A note from the house on patience, repetition and why a garment should still make sense after the season that introduced it has passed."
        image={manifestoModel}
        alt="Model wearing an oversized tailored taupe coat in warm window light."
        imagePosition="50% 30%"
      />

      <article className="bg-background py-20 sm:py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <ScrollReveal className="md:col-span-3">
              <p className="smallcaps text-accent">Manifesto, continued</p>
              <p className="mt-5 max-w-xs font-display text-2xl italic leading-snug text-foreground/65">
                “The point is not to make less visible clothing. It is to make clothing that does not need novelty to stay interesting.”
              </p>
            </ScrollReveal>

            <div className="md:col-span-7 md:col-start-5">
              <ScrollReveal>
                <p className="font-display text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
                  Fashion is very good at teaching us to look forward. The next image, the next delivery, the next reason to replace what was already working.
                </p>
              </ScrollReveal>

              <div className="mt-10 space-y-7 text-pretty text-base leading-[1.85] text-foreground/76 sm:text-lg">
                <ScrollReveal>
                  <p>
                    We wanted Cheq to begin somewhere else: with repetition. The same coat worn through different weather. The same black dress moved from dinner to train platform. A suit that becomes more specific to its owner as the elbows soften and the cloth learns where she sits.
                  </p>
                </ScrollReveal>
                <ScrollReveal>
                  <p>
                    Longevity is not only a question of durability. A garment can survive physically and still feel visually exhausted. We therefore spend as much time removing decisions as making them. Fewer seams. Fewer gestures. Fewer details that belong to one particular moment.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>

          <div className="my-20 grid gap-5 sm:my-24 md:my-36 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8">
              <ParallaxImage
                src={journalStitch}
                alt="Hands guiding fabric through a sewing machine during garment construction."
                className="aspect-[4/3]"
                imageClassName="min-h-full"
                position="50% 50%"
              />
            </div>
            <ScrollReveal className="self-end md:col-span-3 md:col-start-10">
              <p className="smallcaps text-foreground/45">A repeated gesture</p>
              <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">
                Precision is not spectacle. Most of the work is simply doing a small thing well, again.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <ScrollReveal className="md:col-span-7 md:col-start-3">
              <p className="smallcaps text-accent">I — Patience</p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
                Time changes the quality of a decision.
              </h2>
              <div className="mt-7 space-y-7 text-pretty text-base leading-[1.85] text-foreground/76 sm:text-lg">
                <p>
                  A pattern that looks resolved at the end of a fast day can look unnecessarily clever the next morning. We leave room for that second look. It is one of the simplest luxuries a small atelier can protect.
                </p>
                <p>
                  This is also why editions remain limited. Scale is useful, but it creates distance. We would rather understand a smaller number of garments completely: how they are cut, where they strain, where they relax and how they return after wear.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="my-20 sm:my-24 md:my-36">
            <ParallaxImage
              src={climaxMotion}
              alt="Model in motion wearing a flowing garment against a warm backdrop."
              className="aspect-[16/9] md:aspect-[2/1]"
              imageClassName="min-h-full"
              position="50% 45%"
            />
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <ScrollReveal className="md:col-span-3">
              <p className="smallcaps text-accent">II — Movement</p>
            </ScrollReveal>
            <ScrollReveal className="md:col-span-7 md:col-start-5">
              <h2 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
                The final fitting happens outside the fitting room.
              </h2>
              <div className="mt-7 space-y-7 text-pretty text-base leading-[1.85] text-foreground/76 sm:text-lg">
                <p>
                  Clothing is architecture that refuses to stay still. It sits, folds, catches wind, disappears beneath a coat and returns at the end of a staircase. A beautiful front view is not enough.
                </p>
                <p>
                  We finish a piece when its movement feels unforced. That may mean opening a hem, shifting a seam by a small amount, or removing structure that looked persuasive on the hanger but too deliberate on the body.
                </p>
              </div>
              <Link
                to="/collection"
                className="smallcaps mt-10 inline-flex items-center gap-4 border-b border-foreground/30 pb-2 transition-colors hover:border-accent hover:text-accent"
              >
                See the current edit <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </article>
    </main>
  );
}
