"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "@/lib/uploadImage";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User,
  Share2,
  Briefcase,
  Compass,
  Quote,
  ArrowLeft,
  Loader2,
  ImagePlus,
} from "lucide-react";

const ICONS = [
  "users",
  "target",
  "pen-line",
  "megaphone",
  "list-checks",
  "compass",
  "briefcase",
  "award",
  "trending-up",
  "heart",
  "shield",
  "star",
];

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const initialForm = {
  name: "",
  role: "",
  intro: "",
  photo: "",

  social: [
    {
      label: "LinkedIn",
      href: "",
      icon: "linkedin",
    },
    {
      label: "Twitter",
      href: "",
      icon: "twitter",
    },
    {
      label: "Instagram",
      href: "",
      icon: "instagram",
    },
    {
      label: "Email",
      href: "",
      icon: "mail",
    },
  ],

  marketing: {
    heading: "",
    items: [
      {
        icon: "users",
        title: "",
        text: "",
      },
    ],
  },

  advisory: {
    heading: "",
    items: [
      {
        icon: "target",
        title: "",
        text: "",
      },
    ],
  },

  closing: "",
};

const emptyItem = (icon) => ({
  icon,
  title: "",
  text: "",
});

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
          <Icon className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-lg font-bold text-[#0b2a6a]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">
        {label}

        {required && (
          <span className="text-[#f9bd0e]">
            {" "}
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] text-[#0b2a6a] placeholder:text-slate-400 transition focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40";

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [formData, setFormData] =
    useState(initialForm);
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing team member
  useEffect(() => {
    if (!id) {
      return;
    }

    async function fetchMember() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/team/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch team member"
          );
        }

        const member = data.teamMember;

        setFormData({
          name: member.name || "",
          role: member.role || "",
          intro: member.intro || "",
          photo: member.photo || "",

          social:
            member.social?.length > 0
              ? member.social
              : initialForm.social,

          marketing: {
            heading:
              member.marketing?.heading || "",

            items:
              member.marketing?.items?.length > 0
                ? member.marketing.items
                : initialForm.marketing.items,
          },

          advisory: {
            heading:
              member.advisory?.heading || "",

            items:
              member.advisory?.items?.length > 0
                ? member.advisory.items
                : initialForm.advisory.items,
          },

          closing: member.closing || "",
        });
      } catch (error) {
        console.error(
          "Fetch team member error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlePhotoSelect(e) {
    const input = e.currentTarget;
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setPhotoUploading(true);
      setPhotoError("Uploading image to Cloudinary...");
      const uploaded = await uploadImage(file, "team");
      setFormData((prev) => ({ ...prev, photo: uploaded.url }));
      setPhotoFileName(file.name);
      setPhotoError("");
    } catch (uploadError) {
      setPhotoError(uploadError.message || "Image upload failed.");
    } finally {
      setPhotoUploading(false);
      input.value = "";
    }
  }

  function clearPhoto() {
    setFormData((prev) => ({ ...prev, photo: "" }));
    setPhotoFileName("");
    setPhotoError("");
  }

  function handleSocialChange(
    index,
    field,
    value
  ) {
    setFormData((prev) => {
      const social = [...prev.social];

      social[index] = {
        ...social[index],
        [field]: value,
      };

      return {
        ...prev,
        social,
      };
    });
  }

  function handleGroupChange(
    group,
    field,
    value
  ) {
    setFormData((prev) => ({
      ...prev,

      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  }

  function handleGroupItemChange(
    group,
    index,
    field,
    value
  ) {
    setFormData((prev) => {
      const items = [...prev[group].items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,

        [group]: {
          ...prev[group],
          items,
        },
      };
    });
  }

  function addGroupItem(
    group,
    defaultIcon
  ) {
    setFormData((prev) => ({
      ...prev,

      [group]: {
        ...prev[group],

        items: [
          ...prev[group].items,
          emptyItem(defaultIcon),
        ],
      },
    }));
  }

  function removeGroupItem(
    group,
    index
  ) {
    setFormData((prev) => {
      const items = prev[group].items.filter(
        (_, i) => i !== index
      );

      return {
        ...prev,

        [group]: {
          ...prev[group],

          items: items.length
            ? items
            : [emptyItem("star")],
        },
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/team/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        setError(
          data?.message ||
            "Failed to update team member"
        );

        return;
      }

      setMessage(
        data?.message ||
          "Team member updated successfully!"
      );

      // Go back to team list
      setTimeout(() => {
        router.push("/admin/team");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "Update team member error:",
        error
      );

      setError(
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  // Loading existing data
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-10">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}

        <div className="mb-8">
          <Link
            href="/admin/team"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#0b2a6a]"
          >
            <ArrowLeft size={17} />
            Back to Team
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#0b2a6a]">
            Admin
          </span>

          <h1 className="mt-3 text-3xl font-bold text-[#0b2a6a]">
            Edit Team Member
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update this team member&apos;s profile
            information.
          </p>
        </div>

        {/* Status messages */}

        {message && (
          <p
            role="status"
            className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />

            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />

            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          {/* BASIC INFORMATION */}

          <Section
            icon={User}
            title="Basic Information"
          >
            <Field
              label="Name"
              required
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ayesha Chapman"
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Role"
              required
            >
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="CCC's Strategic Visionary and Chief Advisor"
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Introduction"
              required
            >
              <textarea
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                placeholder="Team member introduction"
                rows={5}
                required
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Photo">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                ref={photoInputRef}
                onChange={handlePhotoSelect}
              />

              {formData.photo ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={formData.photo}
                    alt="Selected preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#0b2a6a]">
                      {photoFileName || "Selected photo"}
                    </p>
                    <div className="mt-1.5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-xs font-semibold text-[#0b2a6a] underline-offset-2 hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="text-xs font-semibold text-red-500 underline-offset-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e]/10"
                >
                  <ImagePlus className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-semibold text-[#0b2a6a]">
                    Click to select an image
                  </span>
                  <span className="text-xs text-slate-400">
                    PNG or JPG, up to 5MB
                  </span>
                </button>
              )}

              {photoError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {photoError}
                </p>
              )}
            </Field>
          </Section>

          {/* SOCIAL */}

          <Section
            icon={Share2}
            title="Social Links"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {formData.social.map(
                (social, index) => (
                  <Field
                    key={social.label}
                    label={social.label}
                  >
                    <input
                      type="text"
                      value={social.href}
                      onChange={(e) =>
                        handleSocialChange(
                          index,
                          "href",
                          e.target.value
                        )
                      }
                      placeholder={`${social.label} URL`}
                      className={
                        inputClass
                      }
                    />
                  </Field>
                )
              )}
            </div>
          </Section>

          {/* MARKETING */}

          <Section
            icon={Briefcase}
            title="Marketing Expertise"
            subtitle="Shown as skill cards on the profile page."
          >
            <Field label="Section heading">
              <textarea
                value={
                  formData.marketing
                    .heading
                }
                onChange={(e) =>
                  handleGroupChange(
                    "marketing",
                    "heading",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="She's a hands-on leader who excels at:"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="space-y-4">
              {formData.marketing.items.map(
                (item, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Item {index + 1}
                      </span>

                      {formData.marketing
                        .items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeGroupItem(
                              "marketing",
                              index
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[0.6fr_1.4fr]">
                      <Field label="Icon">
                        <select
                          value={
                            item.icon
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "marketing",
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          className={
                            inputClass
                          }
                        >
                          {ICONS.map(
                            (ic) => (
                              <option
                                key={ic}
                                value={ic}
                              >
                                {ic}
                              </option>
                            )
                          )}
                        </select>
                      </Field>

                      <Field label="Title">
                        <input
                          type="text"
                          value={
                            item.title
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "marketing",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Team Building"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>

                    <div className="mt-3">
                      <Field label="Text">
                        <textarea
                          value={
                            item.text
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "marketing",
                              index,
                              "text",
                              e.target.value
                            )
                          }
                          rows={2}
                          placeholder="Assembling high-performing teams that deliver exceptional results."
                          className={`${inputClass} resize-none`}
                        />
                      </Field>
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                addGroupItem(
                  "marketing",
                  "users"
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#0b2a6a]/30 px-4 py-2 text-sm font-semibold text-[#0b2a6a] transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e]/10"
            >
              <Plus className="h-4 w-4" />

              Add marketing item
            </button>
          </Section>

          {/* ADVISORY */}

          <Section
            icon={Compass}
            title="Advisory Role"
            subtitle="Shown on the dark band of the profile page."
          >
            <Field label="Section heading">
              <textarea
                value={
                  formData.advisory
                    .heading
                }
                onChange={(e) =>
                  handleGroupChange(
                    "advisory",
                    "heading",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="She serves as Greg's trusted advisor, providing guidance on:"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="space-y-4">
              {formData.advisory.items.map(
                (item, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Item {index + 1}
                      </span>

                      {formData.advisory
                        .items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeGroupItem(
                              "advisory",
                              index
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[0.6fr_1.4fr]">
                      <Field label="Icon">
                        <select
                          value={
                            item.icon
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "advisory",
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          className={
                            inputClass
                          }
                        >
                          {ICONS.map(
                            (ic) => (
                              <option
                                key={ic}
                                value={ic}
                              >
                                {ic}
                              </option>
                            )
                          )}
                        </select>
                      </Field>

                      <Field label="Title">
                        <input
                          type="text"
                          value={
                            item.title
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "advisory",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Client Needs"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>

                    <div className="mt-3">
                      <Field label="Text">
                        <textarea
                          value={
                            item.text
                          }
                          onChange={(e) =>
                            handleGroupItemChange(
                              "advisory",
                              index,
                              "text",
                              e.target.value
                            )
                          }
                          rows={2}
                          placeholder="Deeply understanding client motivations and desired outcomes."
                          className={`${inputClass} resize-none`}
                        />
                      </Field>
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                addGroupItem(
                  "advisory",
                  "target"
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#0b2a6a]/30 px-4 py-2 text-sm font-semibold text-[#0b2a6a] transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e]/10"
            >
              <Plus className="h-4 w-4" />

              Add advisory item
            </button>
          </Section>

          {/* CLOSING */}

          <Section
            icon={Quote}
            title="Closing Statement"
          >
            <textarea
              name="closing"
              value={formData.closing}
              onChange={handleChange}
              rows={4}
              placeholder="Closing description"
              className={`${inputClass} resize-none`}
            />
          </Section>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving || photoUploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}

            {photoUploading
              ? "Uploading photo..."
              : saving
              ? "Updating..."
              : "Update Team Member"}
          </button>
        </form>
      </div>
    </div>
  );
}