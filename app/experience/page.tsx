import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience | Sunita Thapa",
  description:
    "SEO and digital marketing career of Sunita Thapa — SEO Specialist & Digital Marketing Specialist.",
};

export default function Page() {
  return <ExperienceView />;
}
