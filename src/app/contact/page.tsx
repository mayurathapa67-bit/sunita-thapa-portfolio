export const dynamic = 'force-dynamic';

import Contact from "@/components/Contact";

type ContactData = {
  email: string;
  phone: string;
  location: string;
  socials: { platform: string; url: string; icon: string }[];
  cta: string;
};

export default async function ContactPage() {
  const res = await fetch('https://sunita-thapa.vercel.app/api/content?t=' + Date.now(), {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  const data = await res.json();
  const { contact } = data as { contact: ContactData };
  return <Contact contact={contact} />;
}
