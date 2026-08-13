import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  position?: string;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  position = "50% 50%",
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !frameRef.current || !imageRef.current) return;

    const animation = gsap.fromTo(
      imageRef.current,
      { yPercent: -5, scale: 1.08 },
      {
        yPercent: 5,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reduced]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-[112%] w-full object-cover ${imageClassName}`}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
