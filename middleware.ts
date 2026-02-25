import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    const allowedOrigins = [
    "https://ai-chat-bot-sigma-seven.vercel.app",
    "http://localhost:3000",
    "https://hoseless-municipally-jennifer.ngrok-free.dev",
    "https://paycoolbackend.onrender.com"
  ];

    const origin = request.headers.get("origin");
    const response = NextResponse.next();
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        request.headers.get("access-control-request-headers") || ""
      );
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }

  const token = request.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  
  if (pathname.startsWith("/login") || (!pathname.startsWith("/admin") && !pathname.startsWith("/chat"))) {
    return NextResponse.next();
  }


  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
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
  matcher: ["/api/:path*", "/admin/:path*", "/chat/:path*", "/choose-plan/:path*"],
};
