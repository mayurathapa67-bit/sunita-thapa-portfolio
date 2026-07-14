import type { Metadata } from "next";
import HomeView from "./HomeView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home | Sunita Thapa",
  description:
    "Sunita Thapa — SEO Specialist & Digital Marketing Specialist. Data-driven SEO and marketing that grows traffic, rankings and revenue.",
};

export default function Page() {
  return <HomeView />;
}
