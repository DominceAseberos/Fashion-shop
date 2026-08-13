import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { ParallaxImage } from "@/components/site/ParallaxImage";
import { ProductModal } from "@/components/site/ProductModal";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { looks, type Look } from "@/data/looks";

export function CollectionPage() {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  return (
    <main>
      <PageHero
        eyebrow="Collection — Autumn / Winter MMXXVI"
        title={<>Six studies in <em className="font-light italic text-cream/80">proportion.</em></>}
        intro="The Quiet Edit is built as a wardrobe rather than a season: six limited garments designed to share a language of line, weight and restraint."
        image={looks[2].image}
        alt={looks[2].alt}
        imagePosition="50% 35%"
      />

      <section className="bg-background py-20 sm:py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-6 md:grid-cols-12 md:gap-10 md:px-10">
          <ScrollReveal className="md:col-span-4">
            <p className="smallcaps text-accent">The edit, no. 01</p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Less choice. More consideration.
            </h2>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-7 md:col-start-6" delay={0.08}>
            <div className="max-w-2xl space-y-6 text-pretty text-base leading-relaxed text-foreground/78 sm:text-lg">
              <p>
                Every look begins with the same question: what remains when novelty is removed? We work with familiar forms — a suit, a column dress, a trench, a winter knit — and refine them until the silhouette feels inevitable.
              </p>
              <p>
                Cloth is chosen for how it falls, creases and recovers. Editions stay deliberately small so fitting and finishing remain close to the hands that drafted each pattern.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section aria-labelledby="collection-grid-heading" className="bg-ink py-20 text-cream sm:py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10">
          <div className="flex flex-col gap-5 border-b border-cream/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="smallcaps text-cream/50">The complete edit</p>
              <h2 id="collection-grid-heading" className="mt-3 font-display text-4xl sm:text-5xl md:text-7xl">
                Looks I — VI
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/60 sm:text-right">
              Select a look for fabric, origin and edition details.
            </p>
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-16 md:gap-x-10 md:gap-y-20">
            {looks.map((look, index) => (
              <ScrollReveal key={look.id} delay={(index % 2) * 0.08}>
                <article className="group">
                  <button
                    type="button"
                    onClick={() => setSelectedLook(look)}
                    className="block w-full text-left"
                    aria-label={`View ${look.name}`}
                  >
                    <div className="relative overflow-hidden bg-cream/5">
                      <img
                        src={look.image}
                        alt={look.alt}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      />
                      <span className="pointer-events-none absolute bottom-4 left-4 font-display text-7xl text-cream/40 sm:text-8xl">
                        {look.index}
                      </span>
                    </div>
                  </button>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)]">
                    <div>
                      <p className="smallcaps text-cream/45">Look {look.index}</p>
                      <h3 className="mt-2 font-display text-3xl sm:text-4xl">{look.name}</h3>
                      <p className="mt-2 text-sm italic text-cream/60">{look.subtitle}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-cream/65">{look.story}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedLook(look)}
                    className="smallcaps mt-5 border-b border-cream/35 pb-1 text-cream transition-colors hover:border-accent hover:text-accent"
                  >
                    View garment
                  </button>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-7">
            <ParallaxImage
              src={looks[0].image}
              alt={looks[0].alt}
              className="aspect-[4/3]"
              imageClassName="min-h-full"
              position="50% 35%"
            />
          </div>
          <ScrollReveal className="md:col-span-4 md:col-start-9">
            <p className="smallcaps text-accent">Fitting room</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              The collection is finished on the body.
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/75">
              Visit the Milan atelier for proportion adjustments, cloth consultation and a private fitting of the current edit.
            </p>
            <Link
              to="/atelier"
              className="smallcaps mt-8 inline-flex items-center gap-4 border-b border-foreground/30 pb-2 transition-colors hover:border-accent hover:text-accent"
            >
              Enter the atelier <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {selectedLook && <ProductModal look={selectedLook} onClose={() => setSelectedLook(null)} />}
    </main>
  );
}
