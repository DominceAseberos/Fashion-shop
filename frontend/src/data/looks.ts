import look1 from "@/assets/look-01.jpg";
import look2 from "@/assets/look-02.png";
import look3 from "@/assets/look-03.jpg";
import look4 from "@/assets/look-04.png";
import look5 from "@/assets/look-05.png";
import look6 from "@/assets/look-06.png";

export interface Look {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly subtitle: string;
  readonly notes: ReadonlyArray<{ label: string; value: string }>;
  readonly image: string;
  readonly alt: string;
  readonly story: string;
}

export const looks: ReadonlyArray<Look> = [
  {
    id: "look-01",
    index: "I",
    name: "The Ivory Suit",
    subtitle: "Single-breasted, peak lapel",
    notes: [
      { label: "Fabric", value: "Italian virgin wool 110" },
      { label: "Origin", value: "Biella, Piedmont" },
      { label: "Edition", value: "32 garments" },
    ],
    image: look1,
    alt: "Model in a structured ivory tailored suit photographed against a stone wall.",
    story:
      "A softened study in authority: an elongated shoulder, a clean waist, and enough ease through the body to let the cloth move rather than hold a pose.",
  },
  {
    id: "look-02",
    index: "II",
    name: "The Onyx Drape",
    subtitle: "Bias-cut, hand-finished hem",
    notes: [
      { label: "Fabric", value: "Wool crepe, double face" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "18 garments" },
    ],
    image: look2,
    alt: "Close detail of draped black wool garment in dramatic chiaroscuro light.",
    story:
      "Cut to fall away from the body, the Onyx Drape relies on weight, bias and a nearly invisible finish instead of surface decoration.",
  },
  {
    id: "look-03",
    index: "III",
    name: "The Oxblood Column",
    subtitle: "Floor-length, low cowl back",
    notes: [
      { label: "Fabric", value: "Silk satin, garment-dyed" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "12 garments" },
    ],
    image: look3,
    alt: "Model in a floor-length oxblood silk gown in a marble interior with classical columns.",
    story:
      "A single uninterrupted line from shoulder to floor. The color is applied after construction so seams and folds carry their own subtle depth.",
  },
  {
    id: "look-04",
    index: "IV",
    name: "The Azure Trench",
    subtitle: "Structured, oversized silhouette",
    notes: [
      { label: "Fabric", value: "Heavyweight cotton gabardine" },
      { label: "Origin", value: "Prato, Tuscany" },
      { label: "Edition", value: "24 garments" },
    ],
    image: look4,
    alt: "Model wearing a structured, oversized azure blue trench coat photographed against a neutral stone background.",
    story:
      "The familiar trench is enlarged, simplified and stripped of unnecessary hardware. Its volume is intentional; the belt decides the silhouette each time it is worn.",
  },
  {
    id: "look-05",
    index: "V",
    name: "The Emerald Silk",
    subtitle: "Flowing, bias-cut evening dress",
    notes: [
      { label: "Fabric", value: "Pure silk charmeuse" },
      { label: "Origin", value: "Como, Lombardy" },
      { label: "Edition", value: "10 garments" },
    ],
    image: look5,
    alt: "Model wearing a flowing emerald green silk dress with dramatic chiaroscuro lighting.",
    story:
      "A dress designed around light rather than ornament. Every panel is placed to let the charmeuse shift between shadow and reflection as the wearer moves.",
  },
  {
    id: "look-06",
    index: "VI",
    name: "The Charcoal Knit",
    subtitle: "Chunky, oversized proportions",
    notes: [
      { label: "Fabric", value: "Cashmere and merino blend" },
      { label: "Origin", value: "Biella, Piedmont" },
      { label: "Edition", value: "40 garments" },
    ],
    image: look6,
    alt: "Model wearing a chunky, oversized charcoal grey knit sweater and tailored wool skirt in a minimalist studio.",
    story:
      "Dense enough to hold shape and soft enough to collapse into the body, the Charcoal Knit is built as a winter layer that does not feel temporary.",
  },
];
