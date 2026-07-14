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
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>
      <div className="px-6 py-6 space-y-5">{children}</div>
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
        className="block text-sm font-medium text-gray-600 mb-1.5"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]/40 transition-all resize-none"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]/40 transition-all"
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
  renderItemExtra,
}: {
  items: SubItem[];
  onChange: (items: SubItem[]) => void;
  fields: { key: string; label: string; multiline?: boolean }[];
  titleKey?: string;
  renderItemExtra?: (item: SubItem, index: number) => React.ReactNode;
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
    <div className="space-y-4">
      {safeItems.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-2">No items yet.</p>
      ) : (
        safeItems.map((item, i) => (
          <div key={i} className="bg-gray-50/60 rounded-xl p-5 border border-gray-100 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {item?.[titleKey] ? String(item[titleKey]) : `Item ${i + 1}`}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
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
            {renderItemExtra?.(item, i)}
          </div>
        ))
      )}
      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/30 transition-all"
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subError, setSubError] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return void router.push("/admin");
    if (loaded.current) return;
    loaded.current = true;
    fetch("/api/content", { cache: "no-store" }).then((r) => r.json()).then((d) => setContent(d || {})).catch(() => setContent({}));
    fetch("/api/submissions").then((r) => r.json()).then(setSubmissions).catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/submissions").then((r) => r.json()).then(setSubmissions).catch(() => {});
    }, 8000);

    return () => clearInterval(interval);
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

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    setDeletingId(id);
    setSubError("");
    try {
      const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to delete");
      }
      const updated = await fetch("/api/submissions").then((r) => r.json());
      setSubmissions(updated);
    } catch {
      setSubError("Failed to delete submission. Please try again.");
    }
    setDeletingId(null);
  };

  if (!isAuthenticated) return null;

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading...</span>
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

  const contentSections = (
    <div className="space-y-12">
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
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField label="Headline" value={safeStr(about?.headline)} onChange={(v) => upd("about", "headline", v)} />
          </div>
          <EditableField label="Bio" value={safeStr(about?.bio)} onChange={(v) => upd("about", "bio", v)} multiline />
          <EditableField label="Philosophy" value={safeStr(about?.philosophy)} onChange={(v) => upd("about", "philosophy", v)} multiline />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableField label="Email" value={safeStr(about?.email)} onChange={(v) => upd("about", "email", v)} />
            <EditableField label="Phone" value={safeStr(about?.phone)} onChange={(v) => upd("about", "phone", v)} />
            <EditableField label="Location" value={safeStr(about?.location)} onChange={(v) => upd("about", "location", v)} />
          </div>
          <details className="bg-gray-50/60 rounded-xl p-5 border border-gray-100 group">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer group-open:text-gray-800 transition-colors">
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
        <div className="mt-5">
          <ImageUploader label="About Image" currentUrl={safeStr(about?.image)} onUpload={imgUp("about", "image")} />
        </div>
      </SectionCard>

      <SectionCard title="Skills">
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-4">Categories</h4>
            <ArrayEditor
              items={(skills?.categories as SubItem[]) || []}
              onChange={(items) => updObjArr("skills", "categories", items)}
              titleKey="title"
              fields={[
                { key: "title", label: "Category Title" },
                { key: "icon", label: "Icon (monitor, search, layers, grid)" },
              ]}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-4">Tools</h4>
            <ArrayEditor
              items={(skills?.tools as SubItem[]) || []}
              onChange={(items) => updObjArr("skills", "tools", items)}
              titleKey="name"
              fields={[
                { key: "name", label: "Tool Name" },
                { key: "level", label: "Proficiency (0-100)" },
              ]}
            />
          </div>
        </div>
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
          renderItemExtra={(item, i) => (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <ImageUploader
                label="Project Image"
                currentUrl={safeStr(item?.image)}
                onUpload={(url) => {
                  const next = [...projects];
                  next[i] = { ...next[i], image: url };
                  updArr("projects", next);
                }}
              />
              {item?.image ? (
                <button
                  onClick={() => {
                    const next = [...projects];
                    next[i] = { ...next[i], image: "" };
                    updArr("projects", next);
                  }}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                >
                  Remove image
                </button>
              ) : null}
            </div>
          )}
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
    </div>
  );

  const renderSubmissions = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-gray-800">Submissions</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">Live • 8s</span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {Array.isArray(submissions) ? submissions.length : 0} total
          </span>
        </div>
      </div>
      {subError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {subError}
        </div>
      )}
      {!Array.isArray(submissions) || submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-12 text-center">
          <p className="text-sm text-gray-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <div key={sub?.id ? String(sub.id) : i} className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{safeStr(sub?.name)}</p>
                  <p className="text-xs text-gray-500">{safeStr(sub?.email)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {sub?.timestamp
                      ? new Date(String(sub.timestamp)).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })
                      : ""}
                  </span>
                  <button
                    onClick={() => deleteSubmission(String(sub.id))}
                    disabled={deletingId === String(sub.id)}
                    className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors font-medium whitespace-nowrap"
                  >
                    {deletingId === String(sub.id) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{safeStr(sub?.message)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <SectionCard title="Environment Variables">
        <p className="text-sm text-gray-500 mb-4">
          Set these in your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">.env.local</code> file:
        </p>
        <pre className="bg-gray-50 rounded-xl p-5 text-xs text-gray-700 overflow-x-auto font-mono leading-relaxed border border-gray-100">
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
        className="px-6 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all"
      >
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200/60 p-4 shrink-0">
        <div className="px-3 pt-2 pb-8">
          <h2 className="text-sm font-bold text-gray-800 tracking-tight">Admin</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sunita Thapa</p>
        </div>
        <nav className="flex-1 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200/60 px-4 py-3 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 lg:pt-10 pt-20 mx-auto w-full max-w-5xl min-h-screen">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === "content" ? "Content" : activeTab === "submissions" ? "Submissions" : "Settings"}
          </h1>
        </div>
        {activeTab === "content" && contentSections}
        {activeTab === "submissions" && renderSubmissions()}
        {activeTab === "settings" && renderSettings()}

        {/* Sticky save bar for content tab */}
        {activeTab === "content" && (
          <div className="sticky bottom-0 pb-8 pt-6 bg-gradient-to-t from-[#F9F9F7] via-[#F9F9F7] to-transparent mt-12">
            <div className="flex items-center gap-4">
              <button
                onClick={saveContent}
                disabled={saving}
                className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-all shadow-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {message && (
                <span className="text-sm text-gray-500 font-medium">{message}</span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
