import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero-portrait.jpg";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { yPercent: 8, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.6, ease: "power3.out", delay: 0.2 }
      );
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(titleRef.current, {
        yPercent: -30,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate min-h-screen w-full overflow-hidden bg-background"
    >
      <div className="absolute inset-0">
        <img
          ref={imgRef}
          src={heroImg}
          alt="Model in a flowing cream silk slip dress, soft window light, editorial portrait."
          width={1080}
          height={1920}
          fetchPriority="high"
          decoding="async"
          className="h-[115%] w-full object-cover object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-cream/10 via-transparent to-cream/85"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between px-6 pb-16 pt-32 md:px-10 md:pt-40">
        <div className="flex items-baseline justify-between">
          <span className="smallcaps text-foreground/70">Vol. 01 — The Quiet Edit</span>
          <span className="smallcaps text-foreground/70">Autumn / Winter</span>
        </div>

        <h1
          ref={titleRef}
          className="font-display text-[14vw] leading-[0.85] tracking-[-0.02em] text-foreground md:text-[11rem] lg:text-[14rem]"
        >
          Quiet
          <br />
          <em className="font-light italic text-accent">luxury,</em>
          <br />
          worn loud.
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md font-body text-base leading-relaxed text-foreground/80">
            A house of slow tailoring. Garments cut for the considered woman —
            stitched in our Milanese atelier, photographed on the women who wear them.
          </p>
          <a
            href="#manifesto"
            className="smallcaps inline-flex items-center gap-3 self-start text-foreground hover:text-accent md:self-end"
          >
            Begin the journey
            <span aria-hidden="true" className="block h-px w-12 bg-current" />
          </a>
        </div>
      </div>
    </section>
  );
}
