"use client";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRoles = null, // e.g. ['ADMIN']
  redirectTo = "/auth",
  forbiddenComponent = null,
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // ARTIQ redundant (təkrarlanan) useEffect API fetch sorğusu tamamilə silindi.
  // Çünki token doğrulanması tam olaraq serverdə (middleware/proxy) icra olunur.

  // İkinci useEffect yalnız kliyent tərəfində vizual yönləndirməni dəstəkləyir
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const role = user?.role;
      if (!role || !allowedRoles.includes(role)) {
        if (!forbiddenComponent) router.push("/");
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, redirectTo, forbiddenComponent]);

  if (loading) return null;

  if (!isAuthenticated) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return (
        <>
          {forbiddenComponent || (
            <div className="p-6">
              <h2 className="text-lg font-bold">Forbidden</h2>
              <p className="text-sm text-muted">You do not have access to this page.</p>
            </div>
          )}
        </>
      );
    }
  }

  return <>{children}</>;
}