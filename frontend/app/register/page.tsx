"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: cleanedPhone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setSuccess("Account created successfully! Redirecting to login...");
        const callbackUrl = searchParams.get("callbackUrl") || "";
        const loginUrl = `/login?registered=true${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
        setTimeout(() => {
          router.push(loginUrl);
        }, 2000);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activePage="Register" />
      <main className="pt-32 pb-24 px-6 min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-[#E8E2D9] shadow-xl shadow-secondary/5">
          <div className="text-center mb-8">
            <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold uppercase">THE GRAND LOUNGE</span>
            <h1 className="font-display text-3xl font-semibold text-primary mt-2">Create Account</h1>
            <p className="text-xs text-on-surface-variant mt-1.5">Join us for bespoke lounge curations.</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[10px] font-label-caps text-secondary font-bold mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Julianne Moore"
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
            </div>

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
              <label className="block text-[10px] font-label-caps text-secondary font-bold mb-1.5 uppercase">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-label-caps text-secondary font-bold mb-1.5 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-label-caps text-secondary font-bold mb-1.5 uppercase">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-primary text-on-primary rounded-full text-[11px] font-label-caps font-bold hover:bg-secondary transition-all shadow-md tracking-wider flex items-center justify-center"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#E8E2D9] pt-6 text-[11px] text-[#6B6B6B]">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
