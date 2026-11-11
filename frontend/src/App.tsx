import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Lookbook } from "@/components/site/Lookbook";
import { Climax } from "@/components/site/Climax";
import { Atelier } from "@/components/site/Atelier";

export default function App() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Lookbook />
      <Climax />
      <Atelier />
    </main>
  );
}
