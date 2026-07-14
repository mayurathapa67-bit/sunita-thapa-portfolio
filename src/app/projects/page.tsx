export const dynamic = 'force-dynamic';

import Projects from "@/components/Projects";

type Project = {
  title: string;
  category: string;
  description: string;
  tools: string[];
  image: string;
  link: string;
  year: number;
  featured: boolean;
};

export default async function ProjectsPage() {
  const res = await fetch('https://sunita-thapa.vercel.app/api/content?t=' + Date.now(), {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  const data = await res.json();
  const { projects } = data as { projects: Project[] };
  return <Projects projects={projects} />;
}
