"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid admin credentials.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-[#E8E2D9] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2D2D2D] rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-label-caps text-[#C5A880] text-[10px] tracking-[0.3em] font-bold uppercase">THE GRAND LOUNGE</span>
          <h1 className="font-display text-3xl text-[#E8E2D9] mt-3 font-semibold">Admin Access</h1>
          <p className="text-xs text-[#888888] mt-1.5 font-medium">Please authenticate to access the Curator Panel.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-900 rounded-2xl text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-label-caps text-[#C5A880] tracking-wider font-semibold mb-2 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@thegrandlounge.com"
              className="w-full bg-[#222222] border border-[#333333] px-4 py-3 rounded-full text-xs text-[#E8E2D9] placeholder-[#555555] focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-label-caps text-[#C5A880] tracking-wider font-semibold mb-2 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#222222] border border-[#333333] px-4 py-3 rounded-full text-xs text-[#E8E2D9] placeholder-[#555555] focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-[#C5A880] text-[#111111] rounded-full text-[11px] font-label-caps font-bold hover:bg-[#Bfa372] transition-all tracking-widest flex items-center justify-center"
          >
            {loading ? "AUTHENTICATING..." : "SECURE LOGIN"}
          </button>
        </form>
      </div>
    </main>
  );
}
