import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image: string;
  alt: string;
  imagePosition?: string;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
  imagePosition = "50% 50%",
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      );

      gsap.to(imageRef.current, {
        yPercent: 10,
        scale: 1.04,
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
      ref={sectionRef}
      className="relative isolate min-h-[82svh] overflow-hidden bg-ink text-cream md:min-h-[92svh]"
    >
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={image}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="h-[112%] w-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/80" />
      </div>

      <div
        ref={copyRef}
        className="relative z-10 mx-auto flex min-h-[82svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 sm:px-6 md:min-h-[92svh] md:px-10 md:pb-20 md:pt-36"
      >
        <p className="smallcaps text-cream/70">{eyebrow}</p>
        <h1 className="mt-5 max-w-5xl text-balance font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] tracking-[-0.035em]">
          {title}
        </h1>
        <p className="mt-7 max-w-xl text-pretty font-body text-base leading-relaxed text-cream/80 sm:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}
