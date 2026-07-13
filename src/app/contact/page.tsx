import fs from "fs";
import path from "path";
import Contact from "@/components/Contact";

type ContactData = {
  email: string;
  phone: string;
  location: string;
  socials: { platform: string; url: string; icon: string }[];
  cta: string;
};

function getContactData(): { contact: ContactData } {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return { contact: content.contact };
}

export default function ContactPage() {
  const { contact } = getContactData();
  return <Contact contact={contact} />;
}
