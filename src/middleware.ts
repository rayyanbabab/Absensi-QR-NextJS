import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSessionCookie = request.cookies.get("absensi_session");
  const ortuSessionCookie = request.cookies.get("ortu_session");

  let isAdmin = false;
  if (adminSessionCookie?.value) {
    try {
      const parsed = JSON.parse(adminSessionCookie.value);
      if (
        parsed &&
        (parsed.id || parsed.username) &&
        parsed.role !== "orang_tua" &&
        parsed.active !== false
      ) {
        isAdmin = true;
      }
    } catch {
      isAdmin = false;
    }
  }

  let isOrtu = false;
  if (ortuSessionCookie?.value) {
    try {
      const parsed = JSON.parse(ortuSessionCookie.value);
      if (parsed && (parsed.role === "orang_tua" || parsed.namaOrangTua)) {
        isOrtu = true;
      }
    } catch {
      isOrtu = false;
    }
  }

  // 1. Protected Admin API routes
  if (
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/petugas") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/broadcast")
  ) {
    if (!isAdmin) {
      if (isOrtu) {
        return NextResponse.json(
          {
            error:
              "Akses ditolak: Akun Wali Murid / Orang Tua tidak memiliki izin untuk mengakses fitur administrasi.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "Akses ditolak: Silakan login sebagai administrator terlebih dahulu." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Protected Admin Pages: /admin and any sub-routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdmin) {
      if (isOrtu) {
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("error", "ortu_restricted");
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      } else {
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const proxy = middleware;
export default middleware;

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/petugas/:path*",
    "/api/settings/:path*",
    "/api/broadcast/:path*",
  ],
};
