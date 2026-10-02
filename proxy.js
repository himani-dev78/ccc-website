import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(secret);

export async function proxy(request) {
  const token = request.cookies.get("admin_token")?.value;

  // No token → go to login
  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    // Verify JWT
    await jwtVerify(token, secretKey);

    // Token is valid → allow request
    return NextResponse.next();
  } catch (error) {
    // Invalid/expired token → go to login
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/team/:path*",
    "/admin/portfolio/:path*",
  ],
};