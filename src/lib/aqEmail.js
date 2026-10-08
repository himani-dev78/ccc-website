const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const paragraphs = (text = "") =>
  String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
const bullets = (items = [], color) =>
  items
    .map((i) => `<li style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#334155"><span style="color:${color}">●</span>&nbsp; ${esc(i)}</li>`)
    .join("");

/**
 * The AQ result email — used for the admin preview and for sending.
 * @param {{name, profile, secondaryProfile?, score, maxScore, service?: {title, slug}, note?}} data
 */
export function buildResultEmail({ name, profile, secondaryProfile, score, maxScore, service, note }) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const firstName = String(name || "").trim().split(/\s+/)[0] || "there";
  const subject = `Your Authority Quotient result: ${profile.name}`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff">
  <tr><td style="background:#0b2a6a;padding:36px 32px;text-align:center">
    <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#f9bd0e;font-weight:bold">Your AQ result</p>
    ${maxScore > 0 ? `<p style="margin:16px 0 0;font-size:48px;line-height:1;font-weight:bold;color:#f9bd0e">${esc(score)}<span style="font-size:22px;color:#ffffff99"> / ${esc(maxScore)}</span></p>
    <p style="margin:6px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ffffffaa">AQ score</p>` : ""}
    <h1 style="margin:22px 0 0;font-size:28px;line-height:1.2;color:#ffffff">${esc(profile.name)}</h1>
    <p style="margin:10px 0 0;font-size:16px;line-height:1.5;color:#ffffffdd">${esc(profile.headline)}</p>
  </td></tr>
  <tr><td style="padding:32px">
    <p style="margin:0 0 16px;font-size:15px;color:#334155">Hi ${esc(firstName)},</p>
    ${note ? paragraphs(note) : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155">Thank you for taking the Authority Quotient assessment. Here is your detailed result.</p>`}
    <h2 style="margin:24px 0 10px;font-size:18px;color:#0b2a6a">About your profile</h2>
    ${paragraphs(profile.description)}
    ${secondaryProfile ? `<p style="margin:0 0 14px;font-size:14px;color:#64748b">Your secondary profile: <strong style="color:#0b2a6a">${esc(secondaryProfile.name)}</strong></p>` : ""}
    ${profile.strengths?.length ? `<h2 style="margin:24px 0 10px;font-size:18px;color:#0b2a6a">Your strengths</h2><ul style="margin:0;padding:0;list-style:none">${bullets(profile.strengths, "#059669")}</ul>` : ""}
    ${profile.watchOuts?.length ? `<h2 style="margin:24px 0 10px;font-size:18px;color:#0b2a6a">Areas to watch</h2><ul style="margin:0;padding:0;list-style:none">${bullets(profile.watchOuts, "#f9bd0e")}</ul>` : ""}
    ${service ? `<div style="margin:28px 0 0;padding:18px;background:#fffaea"><p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a77b00;font-weight:bold">Recommended for you</p>
      <p style="margin:6px 0 0;font-size:16px"><a href="${esc(site)}/services/${esc(service.slug)}" style="color:#0b2a6a;font-weight:bold">${esc(service.title)}</a></p></div>` : ""}
    <p style="margin:28px 0 0;font-size:15px;line-height:1.6;color:#334155">If you'd like to talk through your result, just reply to this email.</p>
    <p style="margin:16px 0 0;font-size:15px;color:#334155">Greg<br><span style="color:#64748b">CCC for Leaders</span></p>
  </td></tr>
</table>
</body></html>`;

  const text = [
    `Hi ${firstName},`,
    "",
    note || "Thank you for taking the Authority Quotient assessment. Here is your detailed result.",
    "",
    `YOUR AQ PROFILE: ${profile.name}`,
    maxScore > 0 ? `AQ score: ${score} / ${maxScore}` : null,
    profile.headline,
    "",
    profile.description,
    secondaryProfile ? `\nSecondary profile: ${secondaryProfile.name}` : null,
    profile.strengths?.length ? `\nYOUR STRENGTHS\n${profile.strengths.map((s) => `- ${s}`).join("\n")}` : null,
    profile.watchOuts?.length ? `\nAREAS TO WATCH\n${profile.watchOuts.map((s) => `- ${s}`).join("\n")}` : null,
    service ? `\nRecommended for you: ${service.title}${site ? ` (${site}/services/${service.slug})` : ""}` : null,
    "",
    "If you'd like to talk through your result, just reply to this email.",
    "",
    "Greg",
    "CCC for Leaders",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

// Brevo contact + list (spec §9.6 step 4). Needs BREVO_API_KEY and BREVO_LIST_ID.
export async function pushToBrevo({ email, name, company, profileName, source }) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID) {
    throw new Error("Brevo is not configured (BREVO_API_KEY / BREVO_LIST_ID)");
  }
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [Number(process.env.BREVO_LIST_ID)], // the "Presentation Science / Assessment" list
      attributes: { NAME: name, COMPANY: company || "", PROFILE: profileName, SOURCE: source || "" },
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}
