import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return;
  }

  const pathnameParams = request.nextUrl.pathname
    .split("/")
    .filter((item) => item);

  if (pathnameParams.length !== 1 || typeof pathnameParams[0] !== "string") {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  const res = await fetch(
    `${request.nextUrl.origin}/api/get-url/${pathnameParams[0]}`
  );
  const data = await res.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
  return NextResponse.redirect(request.nextUrl.origin);
}

export const config = {
  matcher: ["/((?!api|static|favicon.ico|_next).*)"],
};
