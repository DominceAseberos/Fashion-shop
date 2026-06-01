# Cheq — Luxury Editorial Scrollytelling Landing

A single immersive page for the fashion house **Cheq**, structured as a Vogue-style editorial with a 5-phase narrative arc, smooth Lenis scroll, GSAP/ScrollTrigger choreography, and AI-generated model imagery.

## Visual direction

- **Palette:** off-white `#F4F1EC`, ink black `#0E0E0E`, warm taupe `#A89684`, deep oxblood accent `#3A1A1A`
- **Typography:** Display — *Cormorant Garamond* (light, wide tracking, oversized). Body — *Inter* (regular, generous leading). Editorial captions in small-caps.
- **Motion register:** slow, scrubbed, restrained. No bouncy springs. Generous negative space. Image-led, text as accent.

## Narrative arc (5 phases)

```text
0–15%    HOOK         Full-bleed hero portrait, brand mark fades in, tagline reveals on scrub
15–35%   CONTEXT      Sticky manifesto — "Quiet luxury for the modern silhouette"
                      Pinned text, parallax model image alongside
35–70%   JOURNEY      The Collection — 3 looks revealed as horizontal scroll-pinned gallery
                      Each look: large image + garment notes (fabric, origin, silhouette)
70–85%   CLIMAX       Editorial split-screen — model in motion, kinetic type reveal
                      Oversized "CHEQ" wordmark scrubs across viewport
85–100%  RESOLUTION   Atelier note, newsletter signup, minimal footer
```

## Page sections (single route `/`)

1. **Nav** — fixed, minimal: wordmark left, `Collection / Atelier / Journal / Contact` right (anchor links, native scroll only — no jacking)
2. **Hero** — full-viewport portrait, scrubbed tagline reveal
3. **Manifesto** — sticky pinned section, parallax image
4. **Lookbook** — 3 looks, horizontal pin-scroll
5. **Editorial climax** — split-screen kinetic type
6. **Atelier / Contact** — closing note + email capture (UI only, no backend)
7. **Footer** — wordmark, year, social links

## Assets to generate (AI image gen, all to `src/assets/`)

- `hero-portrait.jpg` — editorial portrait, model in cream silk slip, soft natural light, 35mm film grain, neutral studio backdrop (1920×1920)
- `manifesto-model.jpg` — model seated, oversized tailored coat, looking away, warm taupe wall (1280×1600)
- `look-01.jpg` — runway-style full-length, structured ivory suit (1280×1920)
- `look-02.jpg` — close-detail, black wool draping, monochrome (1280×1920)
- `look-03.jpg` — oxblood gown, marble interior, soft chiaroscuro (1280×1920)
- `climax-motion.jpg` — model mid-stride, blurred movement, editorial (1920×1280)
- `atelier-detail.jpg` — hands stitching fabric, warm tones (1280×960)

All prompts emphasize: editorial fashion photography, no logos, no text, Vogue-style, muted palette aligned with brand tokens.

## Technical stack & standards

- **Framework:** TanStack Start (existing template) — single route at `src/routes/index.tsx`
- **Smooth scroll:** Lenis (native scroll preserved — no scroll-jacking)
- **Animation:** GSAP + ScrollTrigger for pin/scrub; `SplitText` alternative via manual span split (free-tier); `revert()` cleanup on unmount
- **Tokens:** all colors → `src/styles.css` as oklch CSS variables; Tailwind utilities consume tokens (`bg-background`, `text-foreground`, `text-accent`)
- **Type safety:** strict TS, explicit `interface` for section props, no `any`
- **CSS naming:** BEM-style class names on custom components (`.lookbook__item--featured`)
- **A11y:**
  - Semantic landmarks (`<header> <nav> <main> <article> <footer>`)
  - 4.5:1 contrast minimum (verified against ink/cream pairing)
  - Descriptive `alt` text on all model imagery; decorative ornaments `alt=""`
  - Full keyboard navigation, visible focus rings, no traps
  - `@media (prefers-reduced-motion: reduce)` — disables ScrollTrigger scrubs, replaces with static reveals
- **Performance:**
  - Images lazy-loaded except hero (eager + `fetchpriority="high"`)
  - `visibility` toggling instead of `display: none` for animated reveals
  - No video elements, no canvas sequences (per chosen scope)
- **SEO:** unique `<title>` "Cheq — Quiet luxury for the modern silhouette", meta description, og:title/description/image (hero portrait), JSON-LD `Organization`

## Out of scope (this turn)

- No commerce / cart / product detail routes
- No video or canvas image-sequence scrubbing (declined)
- No backend / newsletter persistence (form is presentational)
- No 3D / WebGL

## File plan

```text
src/routes/index.tsx               # composes all sections, sets <head>
src/components/site/Nav.tsx
src/components/site/Hero.tsx
src/components/site/Manifesto.tsx
src/components/site/Lookbook.tsx   # horizontal pin-scroll
src/components/site/Climax.tsx
src/components/site/Atelier.tsx
src/components/site/Footer.tsx
src/hooks/useLenis.ts              # smooth scroll setup + cleanup
src/hooks/useReducedMotion.ts
src/styles.css                     # extend tokens (ink, cream, taupe, oxblood)
src/assets/*.jpg                   # 7 generated images
```

Deps to add: `gsap`, `lenis`.

After approval I'll generate the imagery first (in parallel), then scaffold sections, wire GSAP/Lenis, and verify the build.
