"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Loader2,
  AlertCircle,
  X,
  Eye,
  Phone,
  Tag,
  Calendar,
} from "lucide-react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Message currently open in the preview modal
  const [selected, setSelected] = useState(null);

  async function openMessage(contact) {
    setSelected(contact);

    if (contact.readAt) return;

    try {
      const response = await fetch(`/api/admin/contacts/${contact._id}`, {
        method: "PATCH",
      });

      if (!response.ok) return;

      const data = await response.json();
      const updatedContact = { ...contact, readAt: data.contact.readAt };
      setSelected(updatedContact);
      setContacts((previous) =>
        previous.map((item) => item._id === contact._id ? updatedContact : item)
      );
      window.dispatchEvent(new Event("admin-contact-read"));
    } catch (markError) {
      console.error("Mark message as read error:", markError);
    }
  }

  useEffect(() => {
    let active = true;

    fetch("/api/admin/contacts", { method: "PATCH" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to mark messages as read");
        }
      })
      .then(() => fetch("/api/admin/contacts", { cache: "no-store" }))
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load messages");
        }
        return data.contacts || [];
      })
      .then(async (loadedContacts) => {
        if (!active) return;
        setContacts(loadedContacts);
        window.dispatchEvent(new Event("admin-contact-read"));

        const messageId = new URLSearchParams(window.location.search).get("message");
        const requestedMessage = loadedContacts.find((contact) => contact._id === messageId);

        if (requestedMessage) {
          setSelected(requestedMessage);
          if (!requestedMessage.readAt) {
            const response = await fetch(`/api/admin/contacts/${requestedMessage._id}`, {
              method: "PATCH",
            });
            if (response.ok) {
              const data = await response.json();
              const updatedContact = { ...requestedMessage, readAt: data.contact.readAt };
              if (active) {
                setSelected(updatedContact);
                setContacts((previous) => previous.map((item) =>
                  item._id === updatedContact._id ? updatedContact : item
                ));
                window.dispatchEvent(new Event("admin-contact-read"));
              }
            }
          }
        }
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Something went wrong");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function truncate(text, max = 60) {
    if (!text) return "-";
    return text.length > max ? `${text.slice(0, max)}…` : text;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2a6a] text-[#f9bd0e]">
                <Mail size={19} />
              </span>
              <h1 className="text-2xl font-bold text-[#0b2a6a]">
                Contact Messages
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Messages submitted through your website&apos;s contact form.
            </p>
          </div>

          {contacts.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-sm font-bold text-[#0b2a6a]">
              {contacts.length} {contacts.length === 1 ? "message" : "messages"}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span className="flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </span>
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
            {contacts.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9bd0e]/15">
                  <Mail size={28} className="text-[#0b2a6a]" />
                </span>
                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  No messages yet
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Messages from your contact form will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f6f7fb] text-left">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Email
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Message
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#0b2a6a]/70">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        onClick={() => openMessage(contact)}
                        className={`cursor-pointer border-b border-slate-100 last:border-0 transition hover:bg-[#f9bd0e]/5 ${contact.readAt ? "" : "bg-amber-50/60"}`}
                      >
                        <td className="px-6 py-4">
                          <p className="flex items-center gap-2 font-semibold text-[#0b2a6a]">
                            {!contact.readAt && <span aria-label="Unread" className="h-2 w-2 rounded-full bg-red-500" />}
                            {contact.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">
                            {contact.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">
                            {contact.phone || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="max-w-[160px] truncate text-sm text-slate-600">
                            {contact.subject || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="max-w-xs truncate text-sm text-slate-500">
                            {truncate(contact.message)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="whitespace-nowrap text-sm text-slate-500">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMessage(contact);
                            }}
                            className="rounded-lg p-2 text-[#0b2a6a] transition hover:bg-[#0b2a6a]/10"
                            title="View message"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MESSAGE PREVIEW MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b2a6a]/50 px-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b2a6a]">
                  {selected.name}
                </h2>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-sm font-medium text-[#0b2a6a]/70 hover:text-[#0b2a6a] hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 border-b border-slate-100 pb-5 text-sm text-slate-500">
              {selected.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {selected.phone}
                </span>
              )}
              {selected.subject && (
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} />
                  {selected.subject}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
              {selected.message}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-[#0b2a6a] hover:text-white"
              >
                <Mail size={16} />
                Reply by email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}