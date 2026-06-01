import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import climaxImg from "@/assets/climax-motion.jpg";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Climax() {
  const ref = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { xPercent: 25 },
        {
          xPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        imgRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      aria-labelledby="climax-heading"
      className="relative isolate overflow-hidden bg-background py-32 md:py-48"
    >
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[28vw] font-light leading-none tracking-[-0.04em] text-taupe/25"
      >
        VAYORA — VAYORA
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 md:px-10">
        <div className="col-span-12 md:col-span-7">
          <div className="relative overflow-hidden">
            <img
              ref={imgRef}
              src={climaxImg}
              alt="Model in motion, mid-stride, photographed against a warm backdrop with motion blur."
              width={1920}
              height={1280}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>

        <div className="col-span-12 flex flex-col justify-end pb-2 md:col-span-5">
          <p className="smallcaps text-accent">Chapter 03 — In Motion</p>
          <h2
            id="climax-heading"
            className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-6xl"
          >
            A garment is finished only when it <em className="italic text-accent">moves</em>.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-foreground/80">
            Cut on the body. Released on the street. Vayora is not a still image —
            it is the shape a woman makes when she leaves a room.
          </p>
        </div>
      </div>
    </section>
  );
}
