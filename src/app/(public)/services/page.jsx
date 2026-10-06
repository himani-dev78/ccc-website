"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, Loader2 } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch("/api/services", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load services.");
        if (!data || !Array.isArray(data.services)) {
          throw new Error("The services response was not in the expected format.");
        }
        setServices(data.services);
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

  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="bg-[#0b2a6a] px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f9bd0e]">
            <Layers3 size={15} /> CCC for Leaders
          </span>
          <h1 className="mt-5 text-4xl font-bold uppercase sm:text-6xl">Our Services</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Explore programs designed to strengthen teams, communication and leadership.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">
        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={22} /> Loading services...
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Layers3 className="mx-auto text-slate-300" size={36} />
            <h2 className="mt-4 text-lg font-semibold text-[#0b2a6a]">Services coming soon</h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0b2a6a]">
                  {service.heroImage ? (
                    <Image
                      src={service.heroImage}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#f9bd0e]">
                      <Layers3 size={42} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold uppercase leading-snug text-[#0b2a6a]">{service.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{service.intro}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b2a6a] group-hover:text-[#a77b00]">
                    Explore service <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
