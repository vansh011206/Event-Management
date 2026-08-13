"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase(),
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        // Sync admin token and inspect session role
        try {
          const syncRes = await fetch("/api/auth/admin-sync", { method: "POST" });
          const syncData = await syncRes.json();

          const callbackUrl = searchParams.get("callbackUrl");

          if (syncData?.isAdmin) {
            setSuccess("Admin authenticated! Redirecting to Dashboard...");
            const adminDest =
              callbackUrl && callbackUrl.startsWith("/admin") && callbackUrl !== "/admin/login"
                ? callbackUrl
                : "/admin/dashboard";
            router.push(adminDest);
            router.refresh();
          } else {
            setSuccess("Signed in successfully! Redirecting...");
            let userDest = callbackUrl || "/profile";
            if (userDest.startsWith("/admin")) {
              userDest = "/profile";
            }
            router.push(userDest);
            router.refresh();
          }
        } catch {
          // Fallback standard routing
          const callbackUrl = searchParams.get("callbackUrl") || "/profile";
          router.push(callbackUrl.startsWith("/admin") ? "/profile" : callbackUrl);
          router.refresh();
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-[#E8E2D9] shadow-xl shadow-secondary/5">
      <div className="text-center mb-8">
        <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold uppercase">THE GRAND LOUNGE</span>
        <h1 className="font-display text-3xl font-semibold text-primary mt-2 font-medium">Welcome Back</h1>
        <p className="text-xs text-on-surface-variant mt-1.5">Sign in to your curator portal.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[10px] font-label-caps text-secondary font-bold mb-1.5 uppercase">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@domain.com"
            className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[10px] font-label-caps text-secondary font-bold uppercase">Password</label>
            <span className="text-[10px] text-secondary font-bold hover:underline cursor-pointer">Forgot?</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 bg-primary text-on-primary rounded-full text-[11px] font-label-caps font-bold hover:bg-secondary transition-all shadow-md tracking-wider flex items-center justify-center"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-[#E8E2D9] pt-6 text-[11px] text-[#6B6B6B]">
        New here?{" "}
        <Link href="/register" className="text-secondary font-bold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar activePage="Login" />
      <main className="pt-32 pb-24 px-6 min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <Suspense fallback={<div className="text-xs text-secondary font-bold">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
