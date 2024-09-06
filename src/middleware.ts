import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Redirect untuk jalur /istri
    if (path.startsWith("/istri")) {
      if (path === "/istri/login" && req.nextUrl.pathname !== "/istri/dashboard") {
        return NextResponse.redirect(new URL("/istri/dashboard", req.url));
      }
    }

    // Redirect untuk jalur /admin
    // if (path.startsWith("/admin")) {
    //   if (path === "/admin/login" && req.nextUrl.pathname !== "/admin/dashboard") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    //   }
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Memastikan pengguna login jika token ada
      },
    },
    pages: {
      signIn: "/istri/login", // Mengatur halaman login untuk jalur /istri
      // Pengaturan halaman login untuk /admin dapat menggunakan pengaturan default atau mekanisme berbeda
    },
  }
);

export const config = {
  matcher: ["/istri/:path*", "/admin/:path*"],
};
