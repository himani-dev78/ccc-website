export function normalizeLines(value) {
  return Array.isArray(value)
    ? value
        .filter((line) => typeof line === "string")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
}

export function readService(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const intro = typeof body.intro === "string" ? body.intro.trim() : "";
  const sections = Array.isArray(body.sections)
    ? body.sections
        .filter((section) => section && typeof section.title === "string")
        .map((section) => ({
          title: section.title.trim(),
          subtitle: typeof section.subtitle === "string" ? section.subtitle.trim() : "",
          description: typeof section.description === "string" ? section.description.trim() : "",
          features: Array.isArray(section.features)
            ? section.features
                .filter(
                  (feature) =>
                    feature &&
                    typeof feature.title === "string" &&
                    typeof feature.text === "string",
                )
                .map((feature) => ({
                  title: feature.title.trim(),
                  text: feature.text.trim(),
                }))
                .filter((feature) => feature.title && feature.text)
            : [],
        }))
        .filter((section) => section.title)
    : [];

  return {
    title,
    slug,
    heroImage: typeof body.heroImage === "string" ? body.heroImage.trim() : "",
    intro,
    audienceHeading:
      typeof body.audienceHeading === "string" && body.audienceHeading.trim()
        ? body.audienceHeading.trim()
        : "Who should attend?",
    audience: normalizeLines(body.audience),
    outcomesHeading:
      typeof body.outcomesHeading === "string" && body.outcomesHeading.trim()
        ? body.outcomesHeading.trim()
        : "Program outcomes",
    outcomes: normalizeLines(body.outcomes),
    sections,
  };
}

export function validateService(service) {
  if (!service.title || !service.intro) {
    return "Service title and introduction are required";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)) {
    return "Enter a valid URL slug using lowercase letters, numbers and hyphens";
  }
  return "";
}
