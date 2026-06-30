import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return unauthorized("Admin access is not configured.");
  }

  const headerPassword = request.headers.get("x-admin-password");
  if (headerPassword && constantTimeEqual(headerPassword, adminPassword)) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  const credentials = parseBasicAuth(authorization);
  const adminUsername = process.env.ADMIN_USERNAME || "admin";

  if (
    credentials &&
    constantTimeEqual(credentials.username, adminUsername) &&
    constantTimeEqual(credentials.password, adminPassword)
  ) {
    return NextResponse.next();
  }

  return unauthorized("Admin authentication required.");
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};

function unauthorized(message: string) {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Velomac Admin", charset="UTF-8"'
    }
  });
}

function parseBasicAuth(authorization: string | null) {
  if (!authorization?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separator = decoded.indexOf(":");

    if (separator < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}
