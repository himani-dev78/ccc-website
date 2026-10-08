import { redirect } from "next/navigation";

// Results are no longer shown on screen — the admin emails them from /admin/aq/leads.
export default function AQResultPage() {
  redirect("/assessment");
}
