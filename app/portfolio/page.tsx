import type { Metadata } from "next";
import PortfolioView from "./PortfolioView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Sunita Thapa",
  description:
    "A filterable portfolio of case studies — SEO projects, PPC campaigns, content marketing and social media work by Sunita Thapa.",
};

export default function Page() {
  return <PortfolioView />;
}
