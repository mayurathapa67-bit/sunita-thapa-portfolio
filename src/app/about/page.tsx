export const dynamic = 'force-dynamic';

import About from "@/components/About";

type AboutData = {
  headline: string;
  bio: string;
  philosophy: string;
  image: string;
  stats: { number: string; label: string }[];
  education: { degree: string; school: string; year: string }[];
  certifications: { title: string; issuer: string; year: string }[];
  interests: string[];
  email: string;
  phone: string;
  location: string;
};

export default async function AboutPage() {
  const res = await fetch('https://sunita-thapa.vercel.app/api/content?t=' + Date.now(), {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  const data = await res.json();
  const { about } = data as { about: AboutData };
  return <About about={about} />;
}
