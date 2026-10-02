"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  User,
  Share2,
  Briefcase,
  Compass,
  Quote,
  Loader2,
} from "lucide-react";

export default function TeamMemberDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      setMember(data.teamMember);
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

  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id]);

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

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Team
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/team"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Team
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900">
            Team Member Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View complete information about this
            team member.
          </p>
        </div>

        <Link
          href={`/admin/team/edit/${member._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Pencil size={17} />
          Edit Member
        </Link>
      </div>

      {/* Basic Information */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <User size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="text-sm text-gray-500">
              Personal and professional information
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Photo */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Photo
            </p>

            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <User size={30} />
              </div>
            )}
          </div>

          {/* Name */}

          <div>
            <p className="text-sm font-medium text-gray-500">
              Name
            </p>

            <p className="mt-1 text-gray-900">
              {member.name}
            </p>
          </div>

          {/* Role */}

          <div>
            <p className="text-sm font-medium text-gray-500">
              Role
            </p>

            <p className="mt-1 text-gray-900">
              {member.role}
            </p>
          </div>

          {/* Intro */}

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">
              Introduction
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
              {member.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Share2 size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Social Links
            </h2>

            <p className="text-sm text-gray-500">
              Social media and contact information
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {member.social?.map((social, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-sm font-medium text-gray-500">
                {social.label}
              </p>

              <a
                href={social.href}
                target={
                  social.href?.startsWith("mailto:")
                    ? undefined
                    : "_blank"
                }
                rel="noreferrer"
                className="mt-1 block break-all text-sm text-blue-600 hover:underline"
              >
                {social.href || "-"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Marketing */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Briefcase size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Marketing Expertise
            </h2>

            <p className="text-sm text-gray-500">
              Skills and areas of expertise
            </p>
          </div>
        </div>

        {member.marketing?.heading && (
          <p className="mb-5 text-sm leading-6 text-gray-600">
            {member.marketing.heading}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {member.marketing?.items?.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-gray-50 p-5"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {item.title || "Untitled"}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.text || "-"}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Advisory */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Compass size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Advisory Role
            </h2>

            <p className="text-sm text-gray-500">
              Advisory responsibilities
            </p>
          </div>
        </div>

        {member.advisory?.heading && (
          <p className="mb-5 text-sm leading-6 text-gray-600">
            {member.advisory.heading}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {member.advisory?.items?.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-gray-50 p-5"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {item.title || "Untitled"}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.text || "-"}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Closing */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Quote size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Closing Statement
            </h2>
          </div>
        </div>

        <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
          {member.closing || "-"}
        </p>
      </section>
    </div>
  );
}