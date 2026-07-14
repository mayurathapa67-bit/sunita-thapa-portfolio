import type { Metadata } from "next";
import ServicesView from "./ServicesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Sunita Thapa",
  description:
    "SEO audits, on-page optimisation, content marketing, PPC, social media and email automation by Sunita Thapa.",
};

export default function Page() {
  return <ServicesView />;
}
