export async function uploadImage(file, folder) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.image;
}