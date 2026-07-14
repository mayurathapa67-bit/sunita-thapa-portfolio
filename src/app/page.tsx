export const dynamic = 'force-dynamic';

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

export default async function Home() {
  const res = await fetch('https://sunita-thapa.vercel.app/api/content?t=' + Date.now(), {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  const content: Content = await res.json();

  return (
    <>
      <Hero hero={content.hero} />
      <Skills skills={content.skills} />
      <Process process={content.process} />
      <Testimonials testimonials={content.testimonials} />
    </>
  );
}
