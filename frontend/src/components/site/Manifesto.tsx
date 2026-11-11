import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import manifestoImg from "@/assets/manifesto-model.jpg";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const ref = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const lines = ref.current!.querySelectorAll<HTMLElement>("[data-line]");
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
            },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="relative bg-background py-32 md:py-48"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        <aside className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <div className="relative overflow-hidden">
            <img
              ref={imgRef}
              src={manifestoImg}
              alt="Model wearing an oversized tailored taupe coat, photographed in warm window light."
              width={1280}
              height={1600}
              loading="lazy"
              decoding="async"
              className="h-[120%] w-full object-cover"
            />
          </div>
          <p className="smallcaps mt-4 text-muted-foreground">
            Lara — wearing The Camel, hand-stitched in Milan
          </p>
        </aside>

        <article className="md:col-span-7 md:pt-12">
          <p className="smallcaps mb-8 text-accent">— Manifesto, no. 01</p>
          <h2
            id="manifesto-heading"
            className="font-display text-5xl leading-[1.05] tracking-[-0.015em] text-foreground md:text-7xl"
          >
            <span className="block overflow-hidden">
              <span data-line className="block">We do not chase</span>
            </span>
            <span className="block overflow-hidden">
              <span data-line className="block italic text-accent">the season.</span>
            </span>
            <span className="block overflow-hidden">
              <span data-line className="block">We make garments</span>
            </span>
            <span className="block overflow-hidden">
              <span data-line className="block">that outlive it.</span>
            </span>
          </h2>

          <div className="mt-16 max-w-xl space-y-6 font-body text-lg leading-relaxed text-foreground/85">
            <p>
              <span className="smallcaps mr-2 text-accent">I.</span>
              Cheq is a house built on patience. Each piece is drafted, cut, and
              finished by hand — a quiet protest against the disposable.
            </p>
            <p>
              <span className="smallcaps mr-2 text-accent">II.</span>
              We photograph the women who wear our work. No avatars, no
              composites — only the considered silhouette, on the considered body.
            </p>
            <p>
              <span className="smallcaps mr-2 text-accent">III.</span>
              Less, but better. The same axiom Dieter Rams gave us — adopted, in
              wool and silk.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
