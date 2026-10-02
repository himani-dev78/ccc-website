"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";
import {
  Eye,
  EyeOff,
  ImagePlus,
  MessageSquareQuote,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  role: "",
  org: "",
  text: "",
  photo: "",
  rating: 5,
  active: true,
  order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/testimonials", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch testimonials");
        }
        return data.testimonials || [];
      })
      .then((items) => {
        if (active) setTestimonials(items);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Failed to load testimonials");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (editorOpen) {
      document.getElementById("testimonial-editor")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [editorOpen, editingId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handlePhotoSelect(event) {
    const input = event.currentTarget;
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 5MB.");
      input.value = "";
      return;
    }

    try {
      setPhotoUploading(true);
      setPhotoError("Uploading to Cloudinary...");
      const uploaded = await uploadImage(file, "testimonials");
      setFormData((prev) => ({ ...prev, photo: uploaded.url }));
      setPhotoError("");
    } catch (uploadError) {
      setPhotoError(uploadError.message || "Image upload failed.");
    } finally {
      setPhotoUploading(false);
      input.value = "";
    }
  }

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId("");
    setPhotoError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save testimonial");
      }

      if (editingId) {
        setTestimonials((prev) =>
          prev.map((item) => (item._id === editingId ? data.testimonial : item))
        );
        setSuccess("Testimonial updated successfully.");
      } else {
        setTestimonials((prev) => [data.testimonial, ...prev]);
        setSuccess("Testimonial added successfully.");
      }

      resetForm();
      setEditorOpen(false);
    } catch (submitError) {
      setError(submitError.message || "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name || "",
      role: item.role || "",
      org: item.org || "",
      text: item.text || "",
      photo: item.photo || "",
      rating: item.rating || 5,
      active: item.active !== false,
      order: item.order || 0,
    });
    setEditorOpen(true);
    setPhotoError("");
  };

  const handleDelete = async () => {
    const id = testimonialToDelete?._id;
    if (!id) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete testimonial");
      }

      setTestimonials((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Testimonial deleted successfully.");
      setTestimonialToDelete(null);

      if (editingId === id) {
        resetForm();
        setEditorOpen(false);
      }
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete testimonial");
    } finally {
      setDeletingId("");
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const searchText = `${item.name} ${item.role} ${item.org} ${item.text}`.toLowerCase();
    const matchesSearch = searchText.includes(search.trim().toLowerCase());
    const matchesVisibility = visibilityFilter === "all"
      || (visibilityFilter === "published" && item.active !== false)
      || (visibilityFilter === "hidden" && item.active === false);

    return matchesSearch && matchesVisibility;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2a6a] text-[#f9bd0e]">
              <MessageSquareQuote size={19} />
            </span>
            <h1 className="text-2xl font-bold text-[#0b2a6a]">Testimonials</h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage homepage stories, profile photos, ratings, and visibility.
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {testimonials.length} total · {testimonials.filter((item) => item.active !== false).length} published · {testimonials.filter((item) => item.active === false).length} hidden
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setEditorOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-[#0b2a6a] hover:text-white"
        >
          <Plus size={18} /> Add testimonial
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {editorOpen && <div id="testimonial-editor" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f9bd0e]">Home page</p>
            <h2 className="mt-2 text-2xl font-black text-[#0b2a6a]">{editingId ? "Edit testimonial" : "Add testimonial"}</h2>
            <p className="mt-2 text-sm text-slate-500">{editingId ? "Update the details and homepage visibility, then save your changes." : "Create, edit, publish, and remove customer stories shown on the homepage."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Role</label>
            <input name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Company / Organization</label>
            <input name="org" value={formData.org} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Profile photo</label>
            <div className="flex min-h-28 items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              {formData.photo ? (
                <Image src={formData.photo} alt="Selected profile photo" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-[#f9bd0e]" />
              ) : (
                <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#0b2a6a]/10 text-[#0b2a6a]"><ImagePlus size={24} /></span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#0b2a6a]">{formData.photo ? "Profile photo selected" : "Add a profile photo"}</p>
                <p className="mt-1 text-xs text-slate-500">PNG, JPG, or WEBP · max 5 MB</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label htmlFor="testimonial-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0b2a6a] px-3 py-2 text-xs font-bold text-white hover:bg-[#123e96]">
                    <ImagePlus size={14} /> {photoUploading ? "Uploading..." : formData.photo ? "Change photo" : "Select photo"}
                  </label>
                  <input id="testimonial-photo" type="file" accept="image/*" onChange={handlePhotoSelect} disabled={photoUploading} className="sr-only" />
                  {formData.photo && <button type="button" onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))} className="text-xs font-semibold text-red-700 hover:text-red-900">Remove</button>}
                </div>
                {photoError && <p className="mt-2 text-xs text-slate-600">{photoError}</p>}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Testimonial text</label>
            <textarea name="text" rows={5} value={formData.text} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" required />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-[#0b2a6a]">Star rating</legend>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Testimonial star rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  role="radio"
                  aria-checked={Number(formData.rating) === rating}
                  aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                  onClick={() => setFormData((prev) => ({ ...prev, rating }))}
                  className="rounded p-1 text-[#d89e00] transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0b2a6a]"
                >
                  <Star size={23} fill={rating <= Number(formData.rating) ? "currentColor" : "none"} />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-600">{formData.rating} / 5</span>
            </div>
          </fieldset>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">Display order</label>
            <input name="order" type="number" value={formData.order} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#0b2a6a]">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-[#f9bd0e] focus:ring-[#f9bd0e]" />
              Show on homepage
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => { resetForm(); setEditorOpen(false); }} disabled={saving || photoUploading} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={saving || photoUploading} className="rounded-xl bg-[#0b2a6a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123e96] disabled:cursor-not-allowed disabled:opacity-70">
                {photoUploading ? "Uploading photo..." : saving ? "Saving..." : editingId ? "Update testimonial" : "Add testimonial"}
              </button>
            </div>
          </div>
        </form>
      </div>
      }

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0b2a6a]">Manage testimonials</h2>
            <p className="mt-1 text-sm text-slate-500">{testimonials.length} total · {testimonials.filter((item) => item.active !== false).length} published · {testimonials.filter((item) => item.active === false).length} hidden</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search testimonials" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none sm:w-56" />
            </label>
            <select value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)} aria-label="Filter testimonials by visibility" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0b2a6a] focus:border-[#f9bd0e] focus:outline-none">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No testimonials yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            {filteredTestimonials.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">No testimonials match these filters.</div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#f6f7fb] text-left">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Client</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Testimonial</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Rating</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Homepage</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Order</th>
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestimonials.map((item) => (
                    <tr key={item._id} className="border-b border-slate-100 last:border-0 hover:bg-[#f9bd0e]/5">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.photo ? <Image src={item.photo} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" /> : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b2a6a] text-sm font-bold text-white">{item.name?.slice(0, 1)}</span>}
                          <div>
                            <p className="font-semibold text-[#0b2a6a]">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.role}{item.org ? ` · ${item.org}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-sm px-5 py-4 text-sm text-slate-600"><p className="line-clamp-2">{item.text}</p></td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-amber-600">★ {item.rating || 5} / 5</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${item.active === false ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                          {item.active === false ? <EyeOff size={13} /> : <Eye size={13} />}
                          {item.active === false ? "Hidden" : "Published"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{item.order ?? 0}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button type="button" onClick={() => handleEdit(item)} title="Edit testimonial" aria-label={`Edit ${item.name}`} className="rounded-lg p-2 text-[#0b2a6a] hover:bg-[#0b2a6a]/10"><Pencil size={17} /></button>
                          <button type="button" onClick={() => setTestimonialToDelete(item)} title="Delete testimonial" aria-label={`Delete ${item.name}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {testimonialToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b2a6a]/50 px-4 backdrop-blur-sm" role="presentation" onClick={() => !deletingId && setTestimonialToDelete(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-testimonial-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Delete testimonial</p>
                <h2 id="delete-testimonial-title" className="mt-2 text-xl font-black text-[#0b2a6a]">Remove this story?</h2>
              </div>
              <button type="button" disabled={Boolean(deletingId)} onClick={() => setTestimonialToDelete(null)} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X size={18} /></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">“{testimonialToDelete.text}”</p>
            <p className="mt-2 text-sm font-semibold text-[#0b2a6a]">{testimonialToDelete.name}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={Boolean(deletingId)} onClick={() => setTestimonialToDelete(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button type="button" disabled={Boolean(deletingId)} onClick={handleDelete} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">{deletingId ? "Deleting..." : "Delete testimonial"}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
