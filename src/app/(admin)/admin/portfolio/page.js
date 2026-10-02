"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Briefcase,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "CLIENT PARTNERING",
  "COACHING FOR LEADERS",
  "HIGH IMPACT COMMUNICATION",
  "I.D. & F.S.",
  "STORYTELLING FOR BUSINESS",
  "TEAM SYNERGY",
];

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [error, setError] = useState("");

  async function fetchPortfolio() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/portfolio");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch portfolio"
        );
      }

      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error(
        "Fetch portfolio error:",
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

  async function fetchCategories() {
    try {
      const response = await fetch("/api/admin/portfolio/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      setCategories(data.categories || []);
    } catch (_error) {
      setCategories([]);
    }
  }

  useEffect(() => {
    fetchPortfolio();
    fetchCategories();
  }, []);

  function openDeleteModal(item) {
    setPortfolioToDelete(item);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;

    setPortfolioToDelete(null);
  }

  async function handleDelete() {
    if (!portfolioToDelete) return;

    const id = portfolioToDelete._id;

    try {
      setDeleteLoading(id);

      const response = await fetch(
        `/api/admin/portfolio/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete portfolio"
        );
      }

      setPortfolio((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      setPortfolioToDelete(null);
    } catch (error) {
      console.error(
        "Delete portfolio error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete portfolio"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  async function handleAddCategory(event) {
    event.preventDefault();

    const trimmed = newCategoryName.trim();

    if (!trimmed) return;

    try {
      setCategoryLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/portfolio/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: trimmed }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add category"
        );
      }

      setCategories((prev) => [...prev, data.category]);
      setNewCategoryName("");
    } catch (error) {
      setError(
        error.message || "Failed to add category"
      );
    } finally {
      setCategoryLoading(false);
    }
  }

  async function handleDeleteCategory(categoryId) {
    try {
      setCategoryLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/portfolio/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category"
        );
      }

      setCategories((prev) =>
        prev.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      setError(
        error.message || "Failed to delete category"
      );
    } finally {
      setCategoryLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase
                size={24}
                className="text-[#0b2a6a]"
              />

              <h1 className="text-2xl font-semibold text-gray-900">
                Portfolio
              </h1>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage the case studies displayed on your
              website.
            </p>
          </div>

          <Link
            href="/admin/portfolio/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b2a6a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
          >
            <Plus size={18} />
            Add Portfolio
          </Link>
        </div>

        {/* Category Manager */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0b2a6a]">
                Portfolio Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add or remove categories used in portfolio case studies.
              </p>
            </div>

            <form
              onSubmit={handleAddCategory}
              className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Add a category"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40"
              />

              <button
                type="submit"
                disabled={categoryLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={16} />
                {categoryLoading ? "Adding..." : "Add"}
              </button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(categories.length ? categories : DEFAULT_CATEGORIES.map((name) => ({ _id: name, name }))).map((category) => (
              <div
                key={category._id || category.name}
                className="inline-flex items-center gap-2 rounded-full border border-[#0b2a6a]/10 bg-[#f9bd0e]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]"
              >
                <span>{category.name}</span>

                {category._id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-slate-500 transition hover:text-red-500"
                    aria-label={`Delete ${category.name}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded p-1 transition hover:bg-red-100"
              aria-label="Close error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={30}
                className="animate-spin text-[#0b2a6a]"
              />

              <p className="text-sm text-gray-500">
                Loading portfolio...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Empty State */}
            {portfolio.length === 0 ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Briefcase
                    size={30}
                    className="text-gray-400"
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  No portfolio items yet
                </h2>

                <p className="mt-1 max-w-md text-sm text-gray-500">
                  Add your first portfolio case study to
                  start displaying your work on the website.
                </p>

                <Link
                  href="/admin/portfolio/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0b2a6a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
                >
                  <Plus size={17} />
                  Add Portfolio
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop / Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-6 py-4 text-sm font-medium text-gray-600">
                          Portfolio
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-gray-600">
                          Client
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-gray-600">
                          Category
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-gray-600">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {portfolio.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          {/* Portfolio */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Image */}
                              {(item.images?.[0] || item.image) ? (
                                <img
                                  src={item.images?.[0] || item.image}
                                  alt={item.title}
                                  className="h-14 w-20 shrink-0 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[#0b2a6a]/10 text-[#0b2a6a]">
                                  <Briefcase
                                    size={22}
                                  />
                                </div>
                              )}

                              {/* Title */}
                              <div className="min-w-0">
                                <p className="max-w-sm truncate font-medium text-gray-900">
                                  {item.title}
                                </p>

                                {item.shortDescription && (
                                  <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
                                    {
                                      item.shortDescription
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Client */}
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-700">
                              {item.client || "-"}
                            </p>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="inline-flex max-w-[230px] rounded-full bg-[#f9bd0e]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#0b2a6a]">
                              {item.category || "-"}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "-"}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              {/* View */}
                              <Link
                                href={`/admin/portfolio/${item._id}`}
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                title="View"
                              >
                                <Eye size={18} />
                              </Link>

                              {/* Edit */}
                              <Link
                                href={`/admin/portfolio/edit/${item._id}`}
                                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                                title="Edit"
                              >
                                <Pencil
                                  size={18}
                                />
                              </Link>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteModal(
                                    item
                                  )
                                }
                                disabled={
                                  deleteLoading ===
                                  item._id
                                }
                                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete"
                              >
                                {deleteLoading ===
                                item._id ? (
                                  <Loader2
                                    size={18}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={18}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="border-t bg-gray-50 px-6 py-3">
                  <p className="text-xs text-gray-500">
                    Total portfolio items:{" "}
                    <span className="font-semibold text-gray-700">
                      {portfolio.length}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {portfolioToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Warning Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle
                size={24}
                className="text-red-600"
              />
            </div>

            {/* Title */}
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Delete Portfolio
            </h2>

            {/* Message */}
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete this portfolio
              case study?
            </p>

            {/* Portfolio Name */}
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-900">
                {portfolioToDelete.title}
              </p>

              {portfolioToDelete.client && (
                <p className="mt-1 text-xs text-gray-500">
                  Client:{" "}
                  {portfolioToDelete.client}
                </p>
              )}
            </div>

            {/* Warning */}
            <p className="mt-3 text-sm text-gray-500">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {deleteLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}