import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as cookie from "cookie";
import { Auth } from "./api/auth";

const authClient = new Auth();

export default async function middleware(req: NextRequest) {
  // Parse cookies from the request headers
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.accessToken;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/dashboard")) {
    // Redirect to the login page if the token is not present
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Verify the token
    const response = await authClient.helper.verifyToken(token);
    if (response.status === false) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (path.startsWith("/")) {
    if (token) {
      const response = await authClient.helper.verifyToken(token);

      if (response.status === true) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
