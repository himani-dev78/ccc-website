"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(null);

  // Stores the member we want to delete
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [error, setError] = useState("");

  async function fetchTeam() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/team");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch team");
      }

      setTeam(data.team || []);
    } catch (error) {
      console.error("Fetch team error:", error);

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, []);

  // Open delete popup
  function openDeleteModal(member) {
    setMemberToDelete(member);
  }

  // Close delete popup
  function closeDeleteModal() {
    if (deleteLoading) {
      return;
    }

    setMemberToDelete(null);
  }

  // Actually delete the member
  async function handleDelete() {
    if (!memberToDelete) {
      return;
    }

    const id = memberToDelete._id;

    try {
      setDeleteLoading(id);

      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete team member");
      }

      // Remove deleted member from UI
      setTeam((prev) => prev.filter((member) => member._id !== id));

      // Close popup
      setMemberToDelete(null);
    } catch (error) {
      console.error("Delete team member error:", error);

      setError(error.message || "Failed to delete team member");
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2a6a] text-[#f9bd0e]">
                <Users size={19} />
              </span>
              <h1 className="text-2xl font-bold text-[#0b2a6a]">
                Team Members
              </h1>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Manage the team members displayed on your website.
            </p>
          </div>

          {/* Add Team Member */}
          <Link
            href="/admin/team/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-[#0b2a6a] hover:text-white"
          >
            <Plus size={18} />
            Add Team Member
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={30} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {team.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9bd0e]/15">
                  <Users size={28} className="text-[#0b2a6a]" />
                </span>

                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  No team members yet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first team member to get started.
                </p>

                <Link
                  href="/admin/team/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-[#0b2a6a] hover:text-white"
                >
                  <Plus size={17} />
                  Add Team Member
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f6f7fb] text-left">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Member
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Role
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Email
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {team.map((member) => {
                      const email = member.social?.find(
                        (item) => item.label === "Email"
                      );

                      return (
                        <tr
                          key={member._id}
                          className="border-b border-slate-100 last:border-0 transition hover:bg-[#f9bd0e]/5"
                        >
                          {/* Member */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={member.name}
                                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#f9bd0e]/30"
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b2a6a] text-[#f9bd0e]">
                                  <Users size={19} />
                                </div>
                              )}

                              <div>
                                <p className="font-semibold text-[#0b2a6a]">
                                  {member.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Team Member
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <p className="max-w-xs text-sm text-slate-600">
                              {member.role}
                            </p>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {email?.href
                                ? email.href.replace("mailto:", "")
                                : "-"}
                            </p>
                          </td>

                          {/* Created */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-500">
                              {member.createdAt
                                ? new Date(member.createdAt).toLocaleDateString()
                                : "-"}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1.5">
                              {/* View */}
                              <Link
                                href={`/admin/team/${member._id}`}
                                className="rounded-lg p-2 text-[#0b2a6a] transition hover:bg-[#0b2a6a]/10"
                                title="View"
                              >
                                <Eye size={18} />
                              </Link>

                              {/* Edit */}
                              <Link
                                href={`/admin/team/edit/${member._id}`}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-[#f9bd0e]/15 hover:text-[#0b2a6a]"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </Link>

                              {/* Delete */}
                              <button
                                onClick={() => openDeleteModal(member)}
                                disabled={deleteLoading === member._id}
                                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                title="Delete"
                              >
                                {deleteLoading === member._id ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b2a6a]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={24} className="text-red-600" />
            </div>

            {/* Content */}
            <h2 className="mt-4 text-xl font-bold text-[#0b2a6a]">
              Delete Team Member
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to delete the team member?
            </p>

            <p className="mt-2 text-sm font-semibold text-[#0b2a6a]">
              {memberToDelete.name}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}