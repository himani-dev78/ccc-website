"use client";

import { useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette sampled from the CCC header: navy #0b2a6a, yellow #f9bd0e, white, black.
 */
const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "Your full name", full: false },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@company.com", full: false },
  { name: "phone", label: "Phone", type: "tel", required: false, placeholder: "(+1) 555 000 0000", full: false },
  { name: "subject", label: "Subject", type: "text", required: false, placeholder: "What's this about?", full: false },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Guard against a non-JSON response (e.g. a 500 HTML error page)
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data?.message || "Your message has been sent.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f6f7fb] py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
            Get in touch
          </span>
          <h1
            className={`${bebas.className} mt-5 text-[clamp(2.75rem,6vw,4.5rem)] uppercase leading-[0.95] text-[#0b2a6a]`}
          >
            Send a <span className="text-[#f9bd0e]">Message</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-500">
            Questions about our programs or ready to start? Fill out the form
            and our team will get back to you shortly.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(11,42,106,0.25)] lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          {/* Info panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#0b2a6a] p-10 text-white lg:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f9bd0e]/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#f9bd0e]/10 blur-3xl"
            />

            <div className="relative">
              <h2 className={`${bebas.className} text-3xl uppercase tracking-wide`}>
                Contact Info
              </h2>
              <span className="mt-3 block h-1 w-14 rounded-full bg-[#f9bd0e]" />

              <ul className="mt-9 space-y-7 text-[15px]">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f9bd0e] text-[#0b2a6a]">
                    <Phone className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-white/60">Call us</p>
                    <a href="tel:+919971764792" className="font-semibold text-white hover:text-[#f9bd0e]">
                      (+91) 997-176-4792
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f9bd0e] text-[#0b2a6a]">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-white/60">Email us</p>
                    <a
                      href="mailto:greg@cccforleaders.com"
                      className="break-all font-semibold text-white hover:text-[#f9bd0e]"
                    >
                      greg@cccforleaders.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f9bd0e] text-[#0b2a6a]">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-white/60">Find us</p>
                    <p className="font-semibold text-white">
                      Add your office address here
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <p className="relative mt-12 text-[13px] text-white/50">
              We typically reply within one business day.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-8 lg:p-12">
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                  <label
                    htmlFor={f.name}
                    className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]"
                  >
                    {f.label}
                    {f.required && <span className="text-[#f9bd0e]"> *</span>}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-[#0b2a6a] placeholder:text-slate-400 transition focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]"
                >
                  Message<span className="text-[#f9bd0e]"> *</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about what you need..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-[#0b2a6a] placeholder:text-slate-400 transition focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40"
                />
              </div>
            </div>

            {/* Status messages */}
            {error && (
              <p
                role="alert"
                className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${bebas.className} group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-[#0b2a6a] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b2a6a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
            >
              {loading ? (
                <>
                  <span
                    aria-hidden
                    className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b2a6a]/30 border-t-[#0b2a6a]"
                  />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}