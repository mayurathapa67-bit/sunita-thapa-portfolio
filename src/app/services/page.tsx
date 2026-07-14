export const dynamic = 'force-dynamic';

import Services from "@/components/Services";

type Service = {
  title: string;
  description: string;
  icon: string;
};

export default async function ServicesPage() {
  const res = await fetch('https://sunita-thapa.vercel.app/api/content?t=' + Date.now(), {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  const data = await res.json();
  const { services } = data as { services: Service[] };
  return <Services services={services} />;
}
