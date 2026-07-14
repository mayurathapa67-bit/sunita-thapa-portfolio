export const dynamic = 'force-dynamic';

import fs from "fs";
import path from "path";
import Services from "@/components/Services";

type Service = {
  title: string;
  description: string;
  icon: string;
};

function getServicesData(): { services: Service[] } {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return { services: content.services };
}

export default function ServicesPage() {
  const { services } = getServicesData();
  return <Services services={services} />;
}
