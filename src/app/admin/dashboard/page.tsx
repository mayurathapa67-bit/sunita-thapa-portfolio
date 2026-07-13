"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/admin-auth";
import ImageUploader from "@/components/ImageUploader";

type Content = Record<string, unknown>;

const TABS = [
  { id: "content", label: "Content", icon: "M4 6h16M4 12h16M4 18h16" },
  { id: "submissions", label: "Submissions", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] transition-shadow">
      <div className="px-7 py-5 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="px-7 py-6 space-y-5">{children}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]/40 transition-all resize-none"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]/40 transition-all"
        />
      )}
    </div>
  );
}

type SubItem = Record<string, unknown>;

function ArrayEditor({
  items,
  onChange,
  fields,
  titleKey = "title",
}: {
  items: SubItem[];
  onChange: (items: SubItem[]) => void;
  fields: { key: string; label: string; multiline?: boolean }[];
  titleKey?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const updateItem = (index: number, key: string, value: string) => {
    onChange(safeItems.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const empty: SubItem = {};
    fields.forEach((f) => {
      if (f.key === "number") empty[f.key] = String(safeItems.length + 1).padStart(2, "0");
      else if (f.key === "color") empty[f.key] = "#8B5CF6";
      else if (f.key === "rating") empty[f.key] = 5;
      else if (f.key === "featured") empty[f.key] = false;
      else if (f.key === "tools" || f.key === "items") empty[f.key] = [];
      else if (f.key === "icon") empty[f.key] = "monitor";
      else if (f.key === "year") empty[f.key] = new Date().getFullYear();
      else if (f.key === "link") empty[f.key] = "#";
      else if (f.key === "image" || f.key === "avatar") empty[f.key] = "";
      else empty[f.key] = "";
    });
    onChange([...safeItems, empty]);
  };

  return (
    <div className="space-y-3">
      {safeItems.length === 0 ? (
        <p className="text-sm text-gray-300 italic py-2">No items yet.</p>
      ) : (
        safeItems.map((item, i) => (
          <div key={i} className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item?.[titleKey] ? String(item[titleKey]) : `Item ${i + 1}`}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="text-[11px] text-red-300 hover:text-red-500 transition-colors font-medium"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f) => {
                if (
                  ["image", "avatar", "tools", "items", "socials", "stats", "categories", "competencies", "rating"].includes(f.key)
                ) return null;
                const val = item?.[f.key];
                return (
                  <div key={f.key} className={f.multiline ? "md:col-span-2" : ""}>
                    <EditableField
                      label={f.label}
                      value={typeof val === "string" ? val : JSON.stringify(val ?? "")}
                      onChange={(v) => updateItem(i, f.key, v)}
                      multiline={f.multiline}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-300 hover:text-[#8B5CF6]/60 hover:border-[#8B5CF6]/20 transition-all font-medium"
      >
        + Add Item
      </button>
    </div>
  );
}

function safeStr(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [content, setContent] = useState<Content | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return void router.push("/admin");
    if (loaded.current) return;
    loaded.current = true;
    fetch("/api/content").then((r) => r.json()).then((d) => setContent(d || {})).catch(() => setContent({}));
    fetch("/api/submissions").then((r) => r.json()).then(setSubmissions).catch(() => {});
  }, [isAuthenticated, router]);

  const saveContent = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setMessage((await res.json())?.message || "Saved!");
    } catch { setMessage("Error saving"); }
    setSaving(false);
  }, [content]);

  if (!isAuthenticated) return null;

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  const upd = (s: string, k: string, v: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const u = { ...prev };
      const sec = u[s] as Record<string, unknown> | undefined;
      if (sec) sec[k] = v; else (u as Record<string, unknown>)[s] = { [k]: v };
      return u;
    });
  };

  const updArr = (s: string, items: SubItem[]) => setContent((prev) => prev ? { ...prev, [s]: items } : prev);
  const updObjArr = (p: string, k: string, items: SubItem[]) => {
    setContent((prev) => {
      if (!prev) return prev;
      const u = { ...prev };
      const po = u[p] as Record<string, unknown> | undefined;
      if (po) po[k] = items; else (u as Record<string, unknown>)[p] = { [k]: items };
      return u;
    });
  };
  const imgUp = (s: string, f: string) => (url: string) => upd(s, f, url);

  const nav = (content?.nav as Record<string, unknown>) || {};
  const hero = (content?.hero as Record<string, string>) || {};
  const about = (content?.about as Record<string, unknown>) || {};
  const skills = (content?.skills as Record<string, unknown>) || {};
  const services = (content?.services as SubItem[]) || [];
  const projects = (content?.projects as SubItem[]) || [];
  const processData = (content?.process as SubItem[]) || [];
  const testimonials = (content?.testimonials as SubItem[]) || [];

  const PageSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  );

  const renderContent = () => (
    <div>
      <SectionCard title="Navigation">
        <EditableField label="Logo Text" value={safeStr(nav?.logo)} onChange={(v) => upd("nav", "logo", v)} />
      </SectionCard>

      <SectionCard title="Hero">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField label="Title" value={safeStr(hero?.title)} onChange={(v) => upd("hero", "title", v)} />
          <EditableField label="Role" value={safeStr(hero?.role)} onChange={(v) => upd("hero", "role", v)} />
          <div className="md:col-span-2">
            <EditableField label="Subtitle" value={safeStr(hero?.subtitle)} onChange={(v) => upd("hero", "subtitle", v)} multiline />
          </div>
          <EditableField label="Location" value={safeStr(hero?.location)} onChange={(v) => upd("hero", "location", v)} />
          <EditableField label="CTA Primary" value={safeStr(hero?.cta_primary)} onChange={(v) => upd("hero", "cta_primary", v)} />
          <EditableField label="CTA Secondary" value={safeStr(hero?.cta_secondary)} onChange={(v) => upd("hero", "cta_secondary", v)} />
        </div>
        <ImageUploader label="Hero Image" currentUrl={safeStr(hero?.image)} onUpload={imgUp("hero", "image")} />
      </SectionCard>

      <SectionCard title="About">
        <div className="space-y-4">
          <EditableField label="Headline" value={safeStr(about?.headline)} onChange={(v) => upd("about", "headline", v)} />
          <EditableField label="Bio" value={safeStr(about?.bio)} onChange={(v) => upd("about", "bio", v)} multiline />
          <EditableField label="Philosophy" value={safeStr(about?.philosophy)} onChange={(v) => upd("about", "philosophy", v)} multiline />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableField label="Email" value={safeStr(about?.email)} onChange={(v) => upd("about", "email", v)} />
            <EditableField label="Phone" value={safeStr(about?.phone)} onChange={(v) => upd("about", "phone", v)} />
            <EditableField label="Location" value={safeStr(about?.location)} onChange={(v) => upd("about", "location", v)} />
          </div>
          <details className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 group">
            <summary className="text-xs font-medium text-gray-500 cursor-pointer group-open:text-gray-700 transition-colors">
              Education &amp; Certifications
            </summary>
            <div className="mt-4 space-y-4">
              <EditableField
                label="Education (JSON)"
                value={JSON.stringify(about?.education ?? [])}
                onChange={(v) => { try { upd("about", "education", v); } catch {} }}
                multiline
              />
              <EditableField
                label="Certifications (JSON)"
                value={JSON.stringify(about?.certifications ?? [])}
                onChange={(v) => { try { upd("about", "certifications", v); } catch {} }}
                multiline
              />
              <EditableField
                label="Interests (JSON)"
                value={JSON.stringify(about?.interests ?? [])}
                onChange={(v) => { try { upd("about", "interests", v); } catch {} }}
                multiline
              />
            </div>
          </details>
        </div>
        <div className="mt-4">
          <ImageUploader label="About Image" currentUrl={safeStr(about?.image)} onUpload={imgUp("about", "image")} />
        </div>
      </SectionCard>

      <SectionCard title="Skills">
        <PageSection title="Categories">
          <ArrayEditor
            items={(skills?.categories as SubItem[]) || []}
            onChange={(items) => updObjArr("skills", "categories", items)}
            titleKey="title"
            fields={[
              { key: "title", label: "Category Title" },
              { key: "icon", label: "Icon (monitor, search, layers, grid)" },
            ]}
          />
        </PageSection>
        <PageSection title="Tools">
          <ArrayEditor
            items={(skills?.tools as SubItem[]) || []}
            onChange={(items) => updObjArr("skills", "tools", items)}
            titleKey="name"
            fields={[
              { key: "name", label: "Tool Name" },
              { key: "level", label: "Proficiency (0-100)" },
            ]}
          />
        </PageSection>
      </SectionCard>

      <SectionCard title="Services">
        <ArrayEditor
          items={services}
          onChange={(items) => updArr("services", items)}
          titleKey="title"
          fields={[
            { key: "title", label: "Service Title" },
            { key: "description", label: "Description", multiline: true },
            { key: "icon", label: "Icon" },
          ]}
        />
      </SectionCard>

      <SectionCard title="Projects">
        <ArrayEditor
          items={projects}
          onChange={(items) => updArr("projects", items)}
          titleKey="title"
          fields={[
            { key: "title", label: "Project Title" },
            { key: "category", label: "Category (Mobile, Web, Dashboard)" },
            { key: "description", label: "Description", multiline: true },
          ]}
        />
      </SectionCard>

      <SectionCard title="Process">
        <ArrayEditor
          items={processData}
          onChange={(items) => updArr("process", items)}
          titleKey="phase"
          fields={[
            { key: "phase", label: "Phase Name" },
            { key: "number", label: "Number (01, 02...)" },
            { key: "title", label: "Phase Title" },
            { key: "description", label: "Description", multiline: true },
            { key: "color", label: "Accent Color" },
          ]}
        />
      </SectionCard>

      <SectionCard title="Testimonials">
        <ArrayEditor
          items={testimonials}
          onChange={(items) => updArr("testimonials", items)}
          titleKey="name"
          fields={[
            { key: "quote", label: "Quote", multiline: true },
            { key: "name", label: "Client Name" },
            { key: "role", label: "Role" },
            { key: "company", label: "Company" },
          ]}
        />
      </SectionCard>

      <div className="sticky bottom-0 pb-8 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <span className="text-xs text-gray-400">{message}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Submissions</h3>
        <span className="text-xs text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
          {Array.isArray(submissions) ? submissions.length : 0} total
        </span>
      </div>
      {!Array.isArray(submissions) || submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-10 text-center">
          <p className="text-sm text-gray-300">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <div key={sub?.id ? String(sub.id) : i} className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{safeStr(sub?.name)}</p>
                  <p className="text-xs text-gray-300">{safeStr(sub?.email)}</p>
                </div>
                <span className="text-[11px] text-gray-300 whitespace-nowrap ml-4">
                  {sub?.timestamp
                    ? new Date(String(sub.timestamp)).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{safeStr(sub?.message)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div>
      <SectionCard title="Environment Variables">
        <p className="text-xs text-gray-400 mb-4">
          Set these in your <code className="bg-gray-50 px-1.5 py-0.5 rounded text-[11px] font-mono">.env.local</code> file:
        </p>
        <pre className="bg-gray-50 rounded-xl p-4 text-[11px] text-gray-500 overflow-x-auto font-mono leading-relaxed">
{`ADMIN_PASSWORD=admin2024
GITHUB_TOKEN=your_token
GITHUB_REPO=username/repo
GITHUB_BRANCH=main
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret`}
        </pre>
      </SectionCard>
      <button
        onClick={logout}
        className="mt-4 px-6 py-2.5 border border-red-100 text-red-400 rounded-full text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all"
      >
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 p-4 shrink-0">
        <div className="px-3 pt-2 pb-8">
          <h2 className="text-sm font-semibold text-gray-700 tracking-tight">Admin</h2>
          <p className="text-[11px] text-gray-300 mt-0.5">Sunita Thapa</p>
        </div>
        <nav className="flex-1 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gray-50 text-gray-800"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8 lg:pt-8 pt-20 max-w-4xl min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-gray-700">
            {activeTab === "content" ? "Content" : activeTab === "submissions" ? "Submissions" : "Settings"}
          </h1>
          {activeTab === "content" && (
            <button
              onClick={saveContent}
              disabled={saving}
              className="px-5 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-medium hover:bg-gray-800 disabled:opacity-40 transition-all"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
        {activeTab === "content" && renderContent()}
        {activeTab === "submissions" && renderSubmissions()}
        {activeTab === "settings" && renderSettings()}
      </main>
    </div>
  );
}
