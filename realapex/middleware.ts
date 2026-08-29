import { NextRequest, NextResponse } from "next/server";

/**
 * Logs unique visitor hits to analytics without blocking the response.
 *
 * A lightweight cookie (`ra_v`) marks a visitor as already-counted for ~24h,
 * so `page_view` events approximate UNIQUE visitors rather than raw hits.
 * The actual DB write is delegated to /api/analytics/track and dispatched
 * with `fetch` + no `await` on the critical path, keeping page loads fast.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isNewVisitor = !req.cookies.get("ra_v");
  if (isNewVisitor) {
    // Mark the visitor for 24h.
    res.cookies.set("ra_v", "1", {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    // Fire the analytics beacon without awaiting (never delays the response).
    const url = new URL("/api/analytics/track", req.url);
    void fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the client IP + UA so the API can hash/store them.
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
        "user-agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ event_type: "page_view", path: req.nextUrl.pathname }),
      keepalive: true,
    }).catch(() => {
      // swallow — analytics must never impact navigation
    });
  }

  return res;
}

export const config = {
  // Only run on real page routes — skip API, static assets, and images.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
