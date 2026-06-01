import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "@/assets/look-01.jpg";
import look2 from "@/assets/look-02.png";
import look3 from "@/assets/look-03.jpg";
import look4 from "@/assets/look-04.png";
import look5 from "@/assets/look-05.png";
import look6 from "@/assets/look-06.png";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProductModal } from "./ProductModal";

gsap.registerPlugin(ScrollTrigger);

interface Look {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly subtitle: string;
  readonly notes: ReadonlyArray<{ label: string; value: string }>;
  readonly image: string;
  readonly alt: string;
}

const looks: ReadonlyArray<Look> = [
  {
    id: "look-01",
    index: "I",
    name: "The Ivory Suit",
    subtitle: "Single-breasted, peak lapel",
    notes: [
      { label: "Fabric", value: "Italian virgin wool 110" },
      { label: "Origin", value: "Biella, Piedmont" },
      { label: "Edition", value: "32 garments" },
    ],
    image: look1,
    alt: "Model in a structured ivory tailored suit photographed against a stone wall.",
  },
  {
    id: "look-02",
    index: "II",
    name: "The Onyx Drape",
    subtitle: "Bias-cut, hand-finished hem",
    notes: [
      { label: "Fabric", value: "Wool crepe, double face" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "18 garments" },
    ],
    image: look2,
    alt: "Close detail of draped black wool garment in dramatic chiaroscuro light.",
  },
  {
    id: "look-03",
    index: "III",
    name: "The Oxblood Column",
    subtitle: "Floor-length, low cowl back",
    notes: [
      { label: "Fabric", value: "Silk satin, garment-dyed" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "12 garments" },
    ],
    image: look3,
    alt: "Model in a floor-length oxblood silk gown in a marble interior with classical columns.",
  },
  {
    id: "look-04",
    index: "IV",
    name: "The Azure Trench",
    subtitle: "Structured, oversized silhouette",
    notes: [
      { label: "Fabric", value: "Heavyweight cotton gabardine" },
      { label: "Origin", value: "Prato, Tuscany" },
      { label: "Edition", value: "24 garments" },
    ],
    image: look4,
    alt: "Model wearing a structured, oversized azure blue trench coat photographed against a neutral stone background.",
  },
  {
    id: "look-05",
    index: "V",
    name: "The Emerald Silk",
    subtitle: "Flowing, bias-cut evening dress",
    notes: [
      { label: "Fabric", value: "Pure silk charmeuse" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "10 garments" },
    ],
    image: look5,
    alt: "Model wearing a flowing emerald green silk dress with dramatic chiaroscuro lighting.",
  },
  {
    id: "look-06",
    index: "VI",
    name: "The Charcoal Knit",
    subtitle: "Chunky, oversized proportions",
    notes: [
      { label: "Fabric", value: "Cashmere and merino blend" },
      { label: "Origin", value: "Biella, Piedmont" },
      { label: "Edition", value: "40 garments" },
    ],
    image: look6,
    alt: "Model wearing a chunky, oversized charcoal grey knit sweater and tailored wool skirt in a minimalist studio.",
  },
];

export function Lookbook() {
  const ref = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  useEffect(() => {
    if (reduced || !ref.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;
      if (getScrollAmount() <= 0) return;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  // Handle escape to close here if needed, or inside ProductModal
  // ProductModal handles its own escape key

  return (
    <section
      ref={ref}
      id="lookbook"
      aria-labelledby="lookbook-heading"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-ink text-cream"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-16 md:px-10 md:pt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="smallcaps text-cream/60">Chapter 02</p>
            <h2
              id="lookbook-heading"
              className="mt-4 font-display text-5xl leading-none tracking-[-0.015em] md:text-7xl"
            >
              The Collection
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-cream/70 md:block">
            Six garments. Each photographed on the woman it was cut for.
            Scroll to traverse the edit.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="lookbook__track mt-10 flex w-max items-center gap-8 px-6 md:mt-16 md:gap-20 md:px-10"
      >
        {looks.map((look) => (
          <article
            key={look.id}
            className="lookbook__item flex w-[85vw] shrink-0 flex-col gap-4 md:w-[58vw] md:gap-6 lg:w-[44vw] group cursor-pointer"
            onClick={() => setSelectedLook(look)}
          >
            <div className="relative overflow-hidden bg-ink/40">
              <img
                src={look.image}
                alt={look.alt}
                width={1280}
                height={1920}
                loading="lazy"
                decoding="async"
                className="h-[45dvh] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[60dvh]"
              />
              <span
                aria-hidden="true"
                className="absolute left-5 top-5 font-display text-[7rem] leading-none text-cream/30 md:text-[10rem]"
              >
                {look.index}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7">
                <p className="smallcaps text-accent group-hover:text-cream transition-colors">Look {look.index}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight group-hover:text-accent transition-colors md:text-4xl">
                  {look.name}
                </h3>
                <p className="mt-1 text-sm italic text-cream/70">
                  {look.subtitle}
                </p>
              </div>
              <dl className="col-span-12 grid grid-cols-3 gap-3 md:col-span-5">
                {look.notes.map((n) => (
                  <div key={n.label}>
                    <dt className="smallcaps text-cream/50">{n.label}</dt>
                    <dd className="mt-1 text-sm text-cream/90">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}

        <div className="flex w-[40vw] shrink-0 items-center pr-10">
          <p className="font-display text-3xl italic leading-tight text-cream/80 md:text-5xl">
            …and the rest, you must see in person.
          </p>
        </div>
      </div>
      
      {selectedLook && (
        <ProductModal look={selectedLook} onClose={() => setSelectedLook(null)} />
      )}
    </section>
  );
}
