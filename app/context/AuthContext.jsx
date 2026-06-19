"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend "who am I?". The cookie is sent automatically.
  useEffect(() => {
    fetch("http://localhost:8080/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    setUser(await res.json()); // store the user, never the token
  }

  async function logout() {
    // Only the backend can delete an httpOnly cookie, so we ask it to.
    await fetch("http://localhost:8080/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  const value = { user, isAuthenticated: !!user, loading, login, logout }; 
  // !!user means "true if user exists, false if null"

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
