import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenNext = request.cookies.get("next-auth.session-token");
  const tokenBackend = request.cookies.get("jwt");

  const pathname = request.nextUrl.pathname;

  // Se ambos os tokens estão presentes, permitir acesso
  if (tokenNext && tokenBackend) {
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Se nenhum token está presente e a rota não é sign-in ou sign-up, redirecionar para /sign-in
  if (
    !tokenNext &&
    !pathname.startsWith("/sign-in") &&
    !pathname.startsWith("/sign-up")
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Permitir acesso a páginas de sign-in e sign-up sem autenticação
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.next();
  }

  // Caso contrário, bloquear acesso e redirecionar para sign-in
  if (!tokenNext || !tokenBackend) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
