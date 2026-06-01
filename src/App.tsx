import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Lookbook } from "@/components/site/Lookbook";
import { Climax } from "@/components/site/Climax";
import { Atelier } from "@/components/site/Atelier";
import { Footer } from "@/components/site/Footer";
import { useLenis } from "@/hooks/useLenis";

export default function App() {
  useLenis();
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Lookbook />
        <Climax />
        <Atelier />
      </main>
      <Footer />
    </div>
  );
}
