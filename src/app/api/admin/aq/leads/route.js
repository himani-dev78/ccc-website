import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { slugifyKey } from "@/lib/aqScoring";
import AQSettings, { AQSubmission } from "@/model/AQSettings";

export const dynamic = "force-dynamic";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function parseDate(value, endOfDay = false) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Spec §8.5 — leads table, filters by profile + date range, CSV export, summary strip.
export async function GET(request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const q = new URL(request.url).searchParams;
    const filter = {};
    const profile = q.get("profile");
    if (profile) filter.resultProfileKey = String(profile).slice(0, 80);
    const from = parseDate(q.get("from"));
    const to = parseDate(q.get("to"), true);
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }
    if (q.get("synced") === "no") filter.syncedToEsp = false;
    if (q.get("emailed") === "no") filter.resultEmailSentAt = null;
    if (q.get("emailed") === "yes") filter.resultEmailSentAt = { $ne: null };
    const search = q.get("q")?.trim().slice(0, 100);
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: pattern }, { email: pattern }, { phone: pattern }, { company: pattern }];
    }

    await connectDB();
    const [leads, aq] = await Promise.all([
      AQSubmission.find(filter).sort({ createdAt: -1 }).limit(2000).select("-answers").lean(),
      AQSettings.findOne().select("profiles.key profiles.name").lean(),
    ]);
    const profileList = (aq?.profiles || []).map((p) => ({ key: p.key || slugifyKey(p.name), name: p.name }));
    const profileNames = Object.fromEntries(profileList.map((p) => [p.key, p.name]));

    if (q.get("format") === "csv") {
      const esc = (v) => {
        let s = String(v ?? "");
        if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
        return `"${s.replace(/"/g, '""')}"`;
      };
      const header = ["Name", "Email", "Phone", "Company", "Profile", "Secondary profile", "Score", "Source", "Campaign", "Country", "Date", "Result email sent", "Synced to Brevo"];
      const rows = leads.map((l) =>
        [
          l.name,
          l.email,
          l.phone,
          l.company,
          profileNames[l.resultProfileKey] || l.resultProfileKey,
          l.secondaryProfileKey ? profileNames[l.secondaryProfileKey] || l.secondaryProfileKey : "",
          l.maxScore ? `${l.score}/${l.maxScore}` : l.score,
          l.source,
          l.campaign,
          l.ipCountry,
          new Date(l.createdAt).toISOString(),
          l.resultEmailSentAt ? new Date(l.resultEmailSentAt).toISOString() : "no",
          l.syncedToEsp ? "yes" : "no",
        ]
          .map(esc)
          .join(","),
      );
      return new NextResponse([header.join(","), ...rows].join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="aq-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Summary strip (always over all leads, not the filtered view)
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [total, thisMonth, lastWeek, unsynced, awaitingEmail, topProfiles] = await Promise.all([
      AQSubmission.countDocuments(),
      AQSubmission.countDocuments({ createdAt: { $gte: monthStart } }),
      AQSubmission.countDocuments({ createdAt: { $gte: weekAgo } }),
      AQSubmission.countDocuments({ syncedToEsp: false }),
      AQSubmission.countDocuments({ resultEmailSentAt: null }),
      AQSubmission.aggregate([
        { $group: { _id: "$resultProfileKey", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);
    const top = topProfiles[0];

    return NextResponse.json({
      leads,
      profiles: profileList,
      summary: {
        total,
        thisMonth,
        lastWeek,
        unsynced,
        awaitingEmail,
        topProfile: top ? { key: top._id, name: profileNames[top._id] || top._id, count: top.count } : null,
      },
    });
  } catch (error) {
    console.error("Get AQ leads error:", error);
    return NextResponse.json({ message: "Unable to load leads" }, { status: 500 });
  }
}
