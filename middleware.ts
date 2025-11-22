import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// simple decoder: we only need payload, not verification
function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicUserRoutes = ["/user/login", "/user/signup"];
  const publicAdminRoutes = ["/admin/login", "/admin/signup"];

  const isPublicUser = publicUserRoutes.includes(pathname);
  const isPublicAdmin = publicAdminRoutes.includes(pathname);

  // No token → redirect to login for protected routes
  if (!token) {
    if (pathname.startsWith("/admin") && !isPublicAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (pathname.startsWith("/user") && !isPublicUser) {
      return NextResponse.redirect(new URL("/user/login", req.url));
    }
    return NextResponse.next();
  }

  const decoded = decodeJwt(token);
  const role = decoded?.role;

  // Logged in & hits login again → send to dashboard
  if (role === "user" && isPublicUser) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }
  if (role === "admin" && isPublicAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Role protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
