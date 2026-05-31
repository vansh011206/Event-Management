"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  bookingsCount?: number;
  adminName?: string;
}

function SidebarContent({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  bookingsCount = 0,
  adminName = "Vanshaj Sharma"
}: SidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
    { id: "bookings", label: "Bookings", icon: "assignment", href: "/admin/dashboard?tab=bookings" },
    { id: "calendar", label: "Calendar", icon: "calendar_month", href: "/admin/dashboard?tab=calendar" },
    { id: "packages", label: "Packages", icon: "category", href: "/admin/dashboard?tab=packages" },
    { id: "gallery", label: "Gallery", icon: "collections", href: "/admin/dashboard?tab=gallery" },
    { id: "testimonials", label: "Testimonials", icon: "reviews", href: "/admin/dashboard?tab=testimonials" },
    { id: "cms", label: "Website Content", icon: "web", href: "/admin/dashboard?tab=cms" },
    { id: "inquiries", label: "Inquiries", icon: "mail", href: "/admin/dashboard?tab=inquiries" },
    { id: "analytics", label: "Analytics", icon: "analytics", href: "/admin/dashboard?tab=analytics" },
    { id: "settings", label: "Settings", icon: "settings", href: "/admin/dashboard?tab=settings" },
  ];

  const handleLogout = async () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 transform ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:h-full w-72 bg-[#FFFFFF] border-r border-[#E8E2D9] flex flex-col z-40 p-6 shadow-sm shrink-0`}
    >
      <div className="py-6 border-b border-[#E8E2D9] mb-8">
        <Link href="/" className="font-display text-2xl text-[#1F1F1F] font-bold tracking-tight">
          The Grand Lounge
        </Link>
        <p className="font-label-caps text-[10px] text-[#C5A880] mt-1 tracking-[0.2em] font-semibold">
          Luxury Venue Panel
        </p>
      </div>

      <nav className="space-y-1 pr-1 flex-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all text-sm group relative ${
                isActive
                  ? "bg-[#F3EEE7] text-[#1F1F1F] font-semibold"
                  : "text-[#6B6B6B] hover:bg-[#F8F5F0] hover:text-[#1F1F1F]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#C5A880] rounded-r" />
              )}
              <span
                className="material-symbols-outlined text-xl text-[#6B6B6B] group-hover:text-[#1F1F1F] transition-colors shrink-0"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span className="whitespace-nowrap shrink-0">{link.label}</span>
              {link.id === "inquiries" && bookingsCount > 0 && (
                <span className="ml-auto bg-[#C5A880] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0">
                  {bookingsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-[#E8E2D9] mt-6">
        <div className="w-full flex items-center gap-3 bg-[#F8F5F0] p-3.5 rounded-[16px] border border-[#E8E2D9]/60 hover:bg-[#F3EEE7] transition-all text-left">
          <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center font-display text-sm font-bold text-[#C5A880] shrink-0 border border-[#C5A880]/10">
            VS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#1F1F1F] truncate">{adminName}</p>
            <p className="text-[10px] text-[#6B6B6B] tracking-wider uppercase font-semibold font-poppins">General Manager</p>
          </div>
          <button 
            onClick={handleLogout}
            className="material-symbols-outlined text-base text-[#6B6B6B]/60 hover:text-red-600 transition-colors"
            title="Log Out"
          >
            logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<div className="w-72 bg-[#FFFFFF] border-r border-[#E8E2D9]" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
