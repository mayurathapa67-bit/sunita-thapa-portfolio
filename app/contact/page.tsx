import type { Metadata } from "next";
import ContactView from "./ContactView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | Sunita Thapa",
  description:
    "Get in touch with Sunita Thapa — SEO Specialist & Digital Marketing Specialist based in Nepal.",
};

export default function Page() {
  return <ContactView />;
}
