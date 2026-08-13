import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  const isCmsPreview = typeof window !== "undefined" && window.self !== window.top;

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { yPercent: 8, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
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
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-background"
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
          className="h-[112%] w-full object-cover object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-cream/10 via-transparent to-cream/85"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-10 pt-28 sm:px-6 sm:pb-14 md:px-10 md:pb-16 md:pt-40">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="smallcaps text-foreground/70">Vol. 01 — The Quiet Edit</span>
            <span className="smallcaps text-foreground/70">Autumn / Winter</span>
          </div>

          {!isCmsPreview && (
            <Link
              to="/admin"
              className="smallcaps mt-4 inline-flex min-h-11 items-center gap-3 bg-ink px-4 py-3 text-cream shadow-sm transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:px-5"
              aria-label="Open the guest CMS test admin"
            >
              <span>Test Admin</span>
              <span className="text-cream/55">Guest CMS</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <h1
          ref={titleRef}
          className="font-display text-[17vw] leading-[0.84] tracking-[-0.03em] text-foreground sm:text-[14vw] md:text-[11rem] lg:text-[14rem]"
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
