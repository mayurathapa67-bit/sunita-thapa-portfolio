import type { Metadata } from "next";
import AboutView from "./AboutView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | Sunita Thapa",
  description:
    "About Sunita Thapa — SEO Specialist & Digital Marketing Specialist based in Nepal.",
};

export default function Page() {
  return <AboutView />;
}
