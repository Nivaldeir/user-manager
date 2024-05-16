import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenNext = request.cookies.get("__Secure-next-auth.session-token");
  const tokenBackend = request.cookies.get("jwt");

  const pathname = request.nextUrl.pathname;

  // Usuário está autenticado e tenta acessar a página de login
  if (pathname === "/sign-in" && tokenNext && tokenBackend) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Usuário não está autenticado e tenta acessar qualquer rota exceto /sign-in e /sign-up
  if (
    !tokenNext &&
    !pathname.startsWith("/sign-up") &&
    !pathname.startsWith("/sign-in")
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Permite acesso às rotas /sign-in e /sign-up
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.next();
  }

  // Usuário autenticado tentando acessar uma rota protegida
  if (tokenNext && tokenBackend) {
    return NextResponse.next();
  }

  // Caso padrão: redireciona para a página de login
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
