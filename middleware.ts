import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // ------------------------------------
  // ✅ CORS FOR API ROUTES (VERCEL → LOCAL)
  // ------------------------------------
 if (pathname.startsWith("/api")) {
  const allowedOrigins = [
    "https://ai-chat-bot-sigma-seven.vercel.app",
  ];

  const origin = request.headers.get("origin");
  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    request.headers.get("access-control-request-headers") || ""
  );

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}


  // ------------------------------------
  // ✅ AUTH PROTECTION
  // ------------------------------------
  const token = request.cookies.get("token")?.value;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/chat")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const decoded = payload as { role?: string };

    if (pathname.startsWith("/admin") && decoded.role !== "Admin") {
      return NextResponse.redirect(new URL("/chat", request.url));
    }

    if (pathname.startsWith("/chat") && decoded.role !== "User") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/chat/:path*"],
};
