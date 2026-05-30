"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Enquiry {
  _id: string;
  eventType: string;
  packageSelected: string;
  expectedGuests: number;
  preferredDate: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (!session?.user) {
          router.push("/login?callbackUrl=/profile");
          return;
        }

        const profileRes = await fetch("/api/auth/profile");
        const profileJson = await profileRes.json();
        if (profileJson.success) {
          setUser(profileJson.data);
          setEditName(profileJson.data.name);
          setEditPhone(profileJson.data.phone);
        }

        const enquiriesRes = await fetch("/api/enquiries/my");
        const enquiriesJson = await enquiriesRes.json();
        if (enquiriesJson.success) {
          setEnquiries(enquiriesJson.data || []);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        router.push("/login?callbackUrl=/profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => prev ? { ...prev, name: editName, phone: editPhone.replace(/\D/g, "") } : prev);
        setEditMode(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar activePage="Profile" />
        <main className="pt-32 pb-24 px-6 min-h-screen bg-[#F8F5F0] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
            <span className="font-label-caps text-[#C5A880] text-xs tracking-widest font-extrabold animate-pulse">
              LOADING YOUR PROFILE...
            </span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar activePage="Profile" />
      <main className="pt-32 pb-24 px-6 min-h-screen bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Profile Hero Card */}
          <section className="relative bg-white rounded-[32px] border border-[#E8E2D9] shadow-xl shadow-[#C5A880]/5 overflow-hidden">
            {/* Decorative gradient header */}
            <div className="h-32 bg-gradient-to-br from-[#1F1F1F] via-[#2a2520] to-[#3d3428] relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23C5A880%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-8 md:px-12 pb-10 -mt-16 relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#C5A880] to-[#A88B60] flex items-center justify-center border-4 border-white shadow-2xl shrink-0">
                  <span className="font-display text-3xl font-bold text-white tracking-tight">
                    {getInitials(user.name)}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="font-display text-3xl font-bold text-[#1F1F1F]">
                    {user.name}
                  </h1>
                  <p className="text-sm text-[#6B6B6B] mt-1">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 justify-center sm:justify-start">
                    <span className="font-label-caps text-[10px] text-[#C5A880] tracking-widest font-extrabold bg-[#C5A880]/10 px-3 py-1 rounded-full border border-[#C5A880]/20">
                      VALUED MEMBER
                    </span>
                    <span className="text-[11px] text-[#6B6B6B]">
                      Member since {memberSince}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => { setEditMode(!editMode); setMessage({ type: "", text: "" }); }}
                    className="px-5 py-2.5 border border-[#E8E2D9] rounded-full text-xs font-semibold text-[#1F1F1F] hover:bg-[#F8F5F0] transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-2xl text-xs font-medium border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Edit Profile Form */}
          {editMode && (
            <section className="bg-white rounded-[24px] border border-[#E8E2D9] p-8 shadow-sm animate-fade-in">
              <h2 className="font-display text-xl font-bold text-[#1F1F1F] mb-6">
                Edit Your Details
              </h2>
              <form onSubmit={handleSave} className="space-y-5 max-w-xl">
                <div className="space-y-2">
                  <label className="block text-[10px] font-label-caps text-[#C5A880] font-bold uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-5 py-3.5 rounded-full text-sm text-[#1F1F1F] focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-label-caps text-[#C5A880] font-bold uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-[#F3EEE7] border border-[#E8E2D9] px-5 py-3.5 rounded-full text-sm text-[#6B6B6B] cursor-not-allowed"
                  />
                  <p className="text-[10px] text-[#6B6B6B] ml-4">
                    Email cannot be changed for security reasons.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-label-caps text-[#C5A880] font-bold uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-5 py-3.5 rounded-full text-sm text-[#1F1F1F] focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-4 px-8 py-3.5 bg-[#1F1F1F] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A880] transition-colors disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>
            </section>
          )}

          {/* Profile Details (when not editing) */}
          {!editMode && (
            <section className="bg-white rounded-[24px] border border-[#E8E2D9] p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#1F1F1F] mb-6">
                Profile Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-label-caps text-[#C5A880] font-bold uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-[#1F1F1F]">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-label-caps text-[#C5A880] font-bold uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-[#1F1F1F]">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-label-caps text-[#C5A880] font-bold uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-[#1F1F1F]">{user.phone || "Not set"}</p>
                </div>
              </div>
            </section>
          )}

          {/* Enquiry History */}
          <section className="bg-white rounded-[24px] border border-[#E8E2D9] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[#1F1F1F]">
                My Enquiries
              </h2>
              <Link
                href="/my-enquiries"
                className="text-xs text-[#C5A880] font-bold hover:underline flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {enquiries.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-[#E8E2D9] mb-4 block">
                  event_note
                </span>
                <p className="text-sm text-[#6B6B6B] mb-4">
                  You haven&apos;t made any enquiries yet.
                </p>
                <Link
                  href="/booking"
                  className="inline-block px-6 py-3 bg-[#C5A880] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#Bfa372] transition-colors"
                >
                  Book Your First Event
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.slice(0, 5).map((enq) => (
                  <div
                    key={enq._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#F8F5F0] rounded-[16px] border border-[#E8E2D9]/60 gap-3 hover:bg-[#F3EEE7] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#C5A880] text-lg">
                          celebration
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F]">
                          {enq.eventType} — {enq.packageSelected}
                        </p>
                        <p className="text-[11px] text-[#6B6B6B]">
                          {new Date(enq.preferredDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {enq.expectedGuests} Guests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getStatusStyle(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                      {enq.status === "approved" && (
                        <span
                          className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                            enq.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          {enq.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/booking"
              className="flex items-center gap-4 p-5 bg-white rounded-[20px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:border-[#C5A880]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center group-hover:bg-[#C5A880]/20 transition-colors">
                <span className="material-symbols-outlined text-[#C5A880] text-xl">
                  add_circle
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F1F1F]">New Booking</p>
                <p className="text-[11px] text-[#6B6B6B]">Start a new enquiry</p>
              </div>
            </Link>
            <Link
              href="/my-enquiries"
              className="flex items-center gap-4 p-5 bg-white rounded-[20px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:border-[#C5A880]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center group-hover:bg-[#C5A880]/20 transition-colors">
                <span className="material-symbols-outlined text-[#C5A880] text-xl">
                  receipt_long
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F1F1F]">My Enquiries</p>
                <p className="text-[11px] text-[#6B6B6B]">Track & pay</p>
              </div>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-4 p-5 bg-white rounded-[20px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:border-[#C5A880]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center group-hover:bg-[#C5A880]/20 transition-colors">
                <span className="material-symbols-outlined text-[#C5A880] text-xl">
                  support_agent
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F1F1F]">Contact Us</p>
                <p className="text-[11px] text-[#6B6B6B]">Get help</p>
              </div>
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
