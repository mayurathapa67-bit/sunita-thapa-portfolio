import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";

type Content = {
  hero: {
    title: string; role: string; subtitle: string; location: string;
    cta_primary: string; cta_secondary: string; image: string;
  };
  skills: {
    categories: { title: string; icon: string; items: string[] }[];
    tools: { name: string; level: number }[];
  };
  process: {
    phase: string; number: string; title: string;
    description: string; color: string;
  }[];
  testimonials: {
    quote: string; name: string; role: string;
    company: string; avatar: string; rating: number;
  }[];
};

function getContent(): Content {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Home() {
  const content = getContent();

  return (
    <>
      <Hero hero={content.hero} />
      <Skills skills={content.skills} />
      <Process process={content.process} />
      <Testimonials testimonials={content.testimonials} />
    </>
  );
}
