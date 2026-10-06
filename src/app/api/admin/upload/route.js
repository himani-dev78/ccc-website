import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedFolders = new Set(["portfolio", "team", "testimonials", "blogs", "services"]);
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function isAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Cloudinary is not configured. Add its credentials to the server environment." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const requestedFolder = formData.get("folder");

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Select a valid image file" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ message: "Images must be smaller than 5MB" }, { status: 413 });
    }

    if (typeof requestedFolder !== "string" || !allowedFolders.has(requestedFolder)) {
      return NextResponse.json({ message: "Invalid upload folder" }, { status: 400 });
    }

    const folder = `ccc/${requestedFolder}`;
    const publicId = randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureParams = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(`${signatureParams}${apiSecret}`)
      .digest("hex");
    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", String(timestamp));
    cloudForm.append("folder", folder);
    cloudForm.append("public_id", publicId);
    cloudForm.append("signature", signature);

    const cloudResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudForm }
    );
    const cloudData = await cloudResponse.json().catch(() => null);

    if (!cloudResponse.ok) {
      const providerMessage =
        typeof cloudData?.error?.message === "string"
          ? cloudData.error.message.slice(0, 300)
          : "The image provider returned an unreadable response";
      console.error("Cloudinary upload failed:", {
        status: cloudResponse.status,
        message: providerMessage,
      });
      return NextResponse.json(
        { message: `Cloudinary rejected the upload: ${providerMessage}` },
        { status: 502 }
      );
    }

    if (typeof cloudData?.secure_url !== "string" || !cloudData.secure_url) {
      console.error("Cloudinary upload response did not include an image URL");
      return NextResponse.json(
        { message: "Cloudinary accepted the upload but returned no image URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: {
        url: cloudData.secure_url,
        publicId: cloudData.public_id,
      },
    });
  } catch (error) {
    console.error("Admin image upload error:", error);
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
  }
}