import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Şirin (Cheap) yoxlanış: Cookie var ya yox?
  // Əgər cookie adı fərqlidirsə, "token" sözünü backend-in qoyduğu adla əvəzlə
  const tokenCookie = request.cookies.get("token"); 
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // 2. Güclü (Secure) yoxlanış: Tokeni backend-də təsdiqləyirik
    // Server-side olduğumuz üçün cookie-ni backend-ə özümüz əllə ötürürük
    const res = await fetch("http://localhost:8080/api/me", {
      headers: {
        Cookie: `token=${token}`, // Cookie başlığını bura əlavə edirik
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const user = await res.json();

    // 3. /admin marşrutu üçün rol yoxlanışı (Enforce Role)
    if (pathname.startsWith("/admin")) {
      if (!user || user.role !== "ADMIN") {
        // Admin deyilsə, ana səhifəyə və ya auth-a göndər
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Hər şey qaydasındadırsa, keçidə icazə ver
    return NextResponse.next();
  } catch (error) {
    // Backend çökərsə və ya xəta baş verərsə, təhlükəsizlik üçün login-ə at
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

// Proxy-nin yalnız hansı səhifələrdə işləyəcəyini təyin edən matcher
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};