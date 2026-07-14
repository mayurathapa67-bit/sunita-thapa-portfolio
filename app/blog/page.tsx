import type { Metadata } from "next";
import BlogView from "./BlogView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Sunita Thapa",
  description:
    "Articles and notes on SEO, PPC and digital marketing by Sunita Thapa.",
};

export default function Page() {
  return <BlogView />;
}
