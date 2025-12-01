import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保護後台路由（除了登入頁面）
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 簡單驗證 token
    try {
      const decoded = Buffer.from(token.value, "base64").toString("utf-8");
      const isValid = decoded.startsWith(
        process.env.ADMIN_USERNAME || "admin:"
      );

      if (!isValid) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

