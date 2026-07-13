import Link from "next/link";
import fs from "fs";
import path from "path";

type Social = { platform: string; url: string; icon: string };
type ContactData = { email: string; socials: Social[] };

function getFooterData(): ContactData {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return content.contact;
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const contact = getFooterData();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-sm font-bold tracking-[0.08em] uppercase text-[#1A1A1A] hover:text-[#8B5CF6] transition-colors">
              Sunita Thapa
            </Link>
            <p className="text-xs text-[#1A1A1A]/60 mt-4 max-w-xs leading-relaxed">
              UI/UX Designer crafting intuitive digital experiences through research-driven design with purpose and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 mb-5">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#1A1A1A]/70 hover:text-[#8B5CF6] transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 mb-5">
              Connect
            </p>
            <div className="flex flex-wrap gap-3">
              {contact.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-full border border-gray-200 text-xs font-medium text-[#1A1A1A]/70 hover:border-[#8B5CF6]/30 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#1A1A1A]/40">
            &copy; {new Date().getFullYear()} Sunita Thapa. All rights reserved.
          </p>
          <p className="text-xs text-[#1A1A1A]/30">
            Designed with passion
          </p>
        </div>
      </div>
    </footer>
  );
}
