import fs from "fs";
import path from "path";
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

function getAboutData(): { about: AboutData } {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return { about: content.about };
}

export default function AboutPage() {
  const { about } = getAboutData();
  return <About about={about} />;
}
