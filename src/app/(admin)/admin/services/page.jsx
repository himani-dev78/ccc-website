"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Layers3, Loader2, Plus, Trash2 } from "lucide-react";

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch("/api/admin/services", {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load services.");
        setServices(data.services || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load services.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  async function deleteService(service) {
    if (!window.confirm(`Delete "${service.title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(service._id);
      const response = await fetch(`/api/admin/services/${service._id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to delete service.");
      setServices((current) => current.filter((item) => item._id !== service._id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete service.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Layers3 className="text-[#0b2a6a]" size={25} />
            <h1 className="text-2xl font-bold text-[#0b2a6a]">Services</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage service pages and the links shown in the website navigation.
          </p>
        </div>
        <Link href="/admin/services/add" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#153b87]">
          <Plus size={18} /> Add Service
        </Link>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={22} /> Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <Layers3 className="text-slate-300" size={38} />
            <h2 className="mt-4 text-lg font-semibold text-[#0b2a6a]">No services yet</h2>
            <p className="mt-1 text-sm text-slate-500">Add a service to publish its page and add it to the Services menu.</p>
            <Link href="/admin/services/add" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a]">
              <Plus size={17} /> Add your first service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Service</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Sections</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} className="border-b last:border-0 hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {service.heroImage ? (
                            <Image src={service.heroImage} alt="" fill sizes="80px" className="object-cover" />
                          ) : <Layers3 className="m-auto mt-4 text-slate-300" size={24} />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#0b2a6a]">{service.title}</p>
                          <Link href={`/services/${service.slug}`} target="_blank" className="mt-1 block truncate text-xs text-slate-400 hover:text-[#0b2a6a]">
                            /services/{service.slug}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{service.sections?.length || 0} content sections</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.push(`/admin/services/${service._id}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#0b2a6a] hover:bg-slate-50" aria-label={`Edit ${service.title}`}>
                          <Edit size={15} /> Edit
                        </button>
                        <button type="button" onClick={() => deleteService(service)} disabled={deletingId === service._id} className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${service.title}`}>
                          {deletingId === service._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
