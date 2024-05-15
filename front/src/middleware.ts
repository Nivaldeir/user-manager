import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenNext = request.cookies.get("next-auth.session-token");
  const tokenBackend = request.cookies.get("jwt");

  const pathname = request.nextUrl.pathname;
  if (pathname === "/sign-in" && tokenNext && tokenBackend) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (pathname.includes("/") && !tokenNext) {
    return NextResponse.rewrite(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
