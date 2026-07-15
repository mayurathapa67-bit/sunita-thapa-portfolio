import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { ContentProvider } from "@/components/ContentProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sunita-thapa.vercel.app"),
  title: {
    default: "Sunita Thapa | SEO Specialist & Digital Marketing Specialist",
    template: "%s | Sunita Thapa",
  },
  description:
    "Sunita Thapa — SEO Specialist & Digital Marketing Specialist helping brands grow organic traffic, rankings and revenue with data-led strategy.",
  keywords: [
    "SEO Specialist",
    "Digital Marketing",
    "Search Engine Optimization",
    "PPC",
    "Content Marketing",
    "Nepal",
  ],
  authors: [{ name: "Sunita Thapa" }],
  openGraph: {
    title: "Sunita Thapa | SEO Specialist & Digital Marketing Specialist",
    description:
      "Data-driven SEO and digital marketing that grows organic traffic, rankings and revenue.",
    type: "website",
    locale: "en_US",
    siteName: "Sunita Thapa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunita Thapa | SEO Specialist & Digital Marketing Specialist",
    description: "Data-driven SEO and digital marketing that gets results.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning={true}
    >
      <body className="bg-background text-ink antialiased" suppressHydrationWarning={true}>
        <ContentProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ContentProvider>
      </body>
    </html>
  );
}
