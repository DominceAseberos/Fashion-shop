import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { looks, type Look } from "@/data/looks";
import { ProductModal } from "./ProductModal";

gsap.registerPlugin(ScrollTrigger);

export function Lookbook() {
  const ref = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  useEffect(() => {
    if (reduced || !ref.current || !trackRef.current) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const section = ref.current;
        if (!track || !section) return;

        const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
        if (getScrollAmount() <= 0) return;

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });
    }, ref);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="lookbook"
      aria-labelledby="lookbook-heading"
      className="relative bg-ink py-20 text-cream md:flex md:min-h-[100dvh] md:flex-col md:justify-center md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-6 md:px-10 md:pt-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="smallcaps text-cream/60">Chapter 02</p>
            <h2
              id="lookbook-heading"
              className="mt-4 font-display text-5xl leading-none tracking-[-0.015em] md:text-7xl"
            >
              The Collection
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/70 sm:text-right">
            Six garments. On larger screens, scroll to traverse the edit. On touch screens, move naturally through the looks.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="lookbook__track mx-auto mt-10 flex w-full max-w-[1440px] flex-col gap-14 px-5 sm:px-6 md:mx-0 md:mt-16 md:w-max md:max-w-none md:flex-row md:items-center md:gap-20 md:px-10"
      >
        {looks.map((look) => (
          <article
            key={look.id}
            className="lookbook__item group w-full md:w-[58vw] md:shrink-0 lg:w-[44vw]"
          >
            <button
              type="button"
              onClick={() => setSelectedLook(look)}
              className="block w-full text-left"
              aria-label={`View details for ${look.name}`}
            >
              <div className="relative overflow-hidden bg-cream/5">
                <img
                  src={look.image}
                  alt={look.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] md:h-[60dvh] md:aspect-auto"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 left-4 font-display text-[6rem] leading-none text-cream/30 sm:text-[8rem] md:bottom-5 md:left-5 md:text-[10rem]"
                >
                  {look.index}
                </span>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-12 md:gap-4">
                <div className="md:col-span-7">
                  <p className="smallcaps text-accent transition-colors group-hover:text-cream">Look {look.index}</p>
                  <h3 className="mt-2 font-display text-3xl leading-tight transition-colors group-hover:text-accent md:text-4xl">
                    {look.name}
                  </h3>
                  <p className="mt-1 text-sm italic text-cream/70">{look.subtitle}</p>
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:col-span-5">
                  {look.notes.map((note) => (
                    <div key={note.label}>
                      <dt className="smallcaps text-cream/50">{note.label}</dt>
                      <dd className="mt-1 text-sm text-cream/90">{note.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </button>
          </article>
        ))}

        <div className="flex w-full items-center border-t border-cream/15 pt-10 md:w-[40vw] md:shrink-0 md:border-0 md:pr-10 md:pt-0">
          <p className="font-display text-3xl italic leading-tight text-cream/80 md:text-5xl">
            …and the rest, you must see in person.
          </p>
        </div>
      </div>

      {selectedLook && <ProductModal look={selectedLook} onClose={() => setSelectedLook(null)} />}
    </section>
  );
}
