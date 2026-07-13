import fs from "fs";
import path from "path";
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

function getProjectsData(): { projects: Project[] } {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return { projects: content.projects };
}

export default function ProjectsPage() {
  const { projects } = getProjectsData();
  return <Projects projects={projects} />;
}
