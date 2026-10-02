"use client";

import { useEffect, useState } from "react";

const defaultSettings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  newsletterTitle: "Presentation Science",
  phone: "+91 99717 64792",
  email: "clientcenteredconsulting@gmail.com",
  address: "India",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/settings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch settings");
        }

        setSettings({ ...defaultSettings, ...(data.settings || {}) });
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings");
      }

      setSettings({ ...defaultSettings, ...(data.settings || {}) });
      setSuccess("Footer settings updated successfully.");
    } catch (submitError) {
      setError(submitError.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f9bd0e]">Website settings</p>
          <h1 className="mt-2 text-3xl font-black text-[#0b2a6a]">Footer & brand details</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Loading settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Site name</label>
                <input name="siteName" value={settings.siteName || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Tagline</label>
                <input name="tagline" value={settings.tagline || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Newsletter title</label>
                <input name="newsletterTitle" value={settings.newsletterTitle || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Phone</label>
                <input name="phone" value={settings.phone || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Email</label>
                <input name="email" type="email" value={settings.email || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Address</label>
                <input name="address" value={settings.address || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Facebook URL</label>
                <input name="facebook" value={settings.facebook || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">LinkedIn URL</label>
                <input name="linkedin" value={settings.linkedin || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Instagram URL</label>
                <input name="instagram" value={settings.instagram || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">YouTube URL</label>
                <input name="youtube" value={settings.youtube || ""} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123e96] disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? "Saving..." : "Save settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
