import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export async function createToken(adminId) {
  return await new SignJWT({
    adminId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

// For route handlers: true when the request carries a valid admin session cookie.
export async function isAdminRequest() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? Boolean(await verifyToken(token)) : false;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    return payload;
  } catch {
    return null;
  }
}