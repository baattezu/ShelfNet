import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_MATCHERS = ["/demo/protected"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const shouldProtect = PROTECTED_MATCHERS.some((path) =>
    pathname.startsWith(path)
  );

  if (!shouldProtect) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("shelfnet_token")?.value;
  if (!sessionToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/demo";
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo/protected/:path*"],
};
