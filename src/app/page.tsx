import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

type Content = {
  nav: { logo: string; links: { label: string; href: string }[] };
  hero: {
    title: string; role: string; subtitle: string; location: string;
    cta_primary: string; cta_secondary: string; image: string;
  };
  about: {
    headline: string; bio: string; philosophy: string; image: string;
    stats: { number: string; label: string }[];
    education: { degree: string; school: string; year: string }[];
    certifications: { title: string; issuer: string; year: string }[];
    interests: string[];
    email: string; phone: string; location: string;
  };
  skills: {
    categories: { title: string; icon: string; items: string[] }[];
    tools: { name: string; level: number }[];
  };
  services: { title: string; description: string; icon: string }[];
  projects: {
    title: string; category: string; description: string;
    tools: string[]; image: string; link: string; year: number; featured: boolean;
  }[];
  process: {
    phase: string; number: string; title: string;
    description: string; color: string;
  }[];
  testimonials: {
    quote: string; name: string; role: string;
    company: string; avatar: string; rating: number;
  }[];
  contact: {
    email: string; phone: string; location: string;
    socials: { platform: string; url: string; icon: string }[];
    cta: string;
  };
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
      <About about={content.about} />
      <Skills skills={content.skills} />
      <Services services={content.services} />
      <Projects projects={content.projects} />
      <Process process={content.process} />
      <Testimonials testimonials={content.testimonials} />
      <Contact contact={content.contact} />
    </>
  );
}
