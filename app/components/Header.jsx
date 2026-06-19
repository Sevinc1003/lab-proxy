"use client";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, loading, logout, user } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-panel-border">
      <span className="glitch neon-text text-primary text-xl font-bold tracking-[0.3em]">
        DEVFORGE
      </span>

      {!loading && (
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Button href="/auth" variant="outline" size="sm">
              &gt; access_terminal
            </Button>
          ) : (
            <>
              <Button href="/dashboard" variant="outline" size="sm">
                dashboard
              </Button>
              {user?.role === "ADMIN" && (
                <Button href="/admin" variant="outline" size="sm">
                  admin
                </Button>
              )}
              <Button onClick={logout} variant="outline" size="sm">
                &lt; logout
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
