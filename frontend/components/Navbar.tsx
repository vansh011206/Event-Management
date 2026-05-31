"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  id?: string;
}

export default function Navbar({ activePage = "" }: { activePage?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkSession();
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      
      const target = e.target as HTMLElement;
      const isMenuButtonClicked = target.closest('[aria-label="Toggle Menu"]');
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !isMenuButtonClicked
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await signOut({ redirect: false });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Facilities", href: "/facilities" },
    { label: "Packages", href: "/packages" },
    { label: "Gallery", href: "/gallery" },
    { label: "Booking", href: "/booking" },
    { label: "My Enquiries", href: "/my-enquiries" },
  ];

  const isLinkActive = (href: string, label: string) => {
    if (activePage) return activePage.toLowerCase() === label.toLowerCase();
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav
        id="top-nav"
        className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-7xl rounded-full bg-surface/85 backdrop-blur-md border border-secondary/10 shadow-xl shadow-secondary/5 flex justify-between items-center px-6 md:px-8 py-3 md:py-4 z-50 transition-all duration-300 ${
          isScrolled ? "top-4 shadow-2xl scale-[0.98]" : "top-6"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-display text-[15px] sm:text-lg md:text-xl font-bold text-primary tracking-tighter hover:opacity-80 transition-opacity"
        >
          The Grand Lounge
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.label);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-label-caps text-xs tracking-wider transition-colors py-1 ${
                  active
                    ? "text-primary font-bold border-b-2 border-secondary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section: CTA + Auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="hidden sm:inline-block bg-primary text-on-primary font-label-caps text-xs px-5 py-2.5 rounded-full hover:bg-secondary transition-all duration-300 active:scale-95"
          >
            Book a Tour
          </Link>

          {/* Auth Section */}
          {user ? (
            /* Logged in: Avatar with dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A880] to-[#A88B60] flex items-center justify-center text-white font-bold text-xs hover:shadow-lg hover:shadow-[#C5A880]/30 transition-all border-2 border-white/80"
                title={user.name || "Profile"}
              >
                {getInitials(user.name)}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-[#E8E2D9] rounded-[20px] shadow-xl shadow-[#C5A880]/10 z-50 p-2 animate-fade-in">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-[#E8E2D9] mb-1">
                    <p className="text-xs font-bold text-[#1F1F1F] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6B6B6B] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[10px] transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-sm text-[#C5A880]">person</span>
                    My Profile
                  </Link>
                  <Link
                    href="/my-enquiries"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[10px] transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-sm text-[#C5A880]">receipt_long</span>
                    My Enquiries
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[10px] transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-sm text-[#C5A880]">add_circle</span>
                    New Booking
                  </Link>

                  <div className="h-[1px] bg-[#E8E2D9] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 rounded-[10px] transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in: Login link */
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-label-caps text-on-surface-variant hover:text-primary transition-colors font-bold tracking-wider"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:bg-secondary/10 rounded-full transition-all"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Floating Dropdown Menu Card */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 backdrop-blur-md border border-[#E8DCC4]/60 rounded-[24px] shadow-2xl p-5 z-[60] md:hidden transition-all duration-300 animate-fade-in ${
            isScrolled ? "top-[76px]" : "top-[92px]"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-widest text-[#8C6D3E] font-label-caps font-bold border-b border-[#E8DCC4]/30 pb-2 text-center">
              Quick Navigation
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href, link.label);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-caps text-[10px] tracking-wider px-4 py-2.5 rounded-full border transition-all ${
                      active
                        ? "bg-[#755a28] text-white border-[#755a28] shadow-md shadow-[#755a28]/25 font-bold"
                        : "bg-[#F8F5F0] text-[#5A5245] border-[#E8DCC4]/30 hover:bg-[#C5A880]/15 hover:text-[#755a28]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-label-caps text-[10px] tracking-wider px-4 py-2.5 rounded-full border bg-[#F8F5F0] text-[#5A5245] border-[#E8DCC4]/30 hover:bg-[#C5A880]/15 hover:text-[#755a28] transition-all"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="font-label-caps text-[10px] tracking-wider px-4 py-2.5 rounded-full border bg-red-50 text-red-600 border-red-200/50 hover:bg-red-100 transition-all font-bold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-label-caps text-[10px] tracking-wider px-4 py-2.5 rounded-full border bg-[#F8F5F0] text-[#5A5245] border-[#E8DCC4]/30 hover:bg-[#C5A880]/15 hover:text-[#755a28] transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-label-caps text-[10px] tracking-wider px-4 py-2.5 rounded-full border bg-[#F8F5F0] text-[#5A5245] border-[#E8DCC4]/30 hover:bg-[#C5A880]/15 hover:text-[#755a28] transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="h-[1px] bg-[#E8DCC4]/30 my-1" />

            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-black text-white font-label-caps text-[10px] tracking-widest py-3 rounded-full hover:bg-[#755a28] transition-all font-bold"
            >
              Book a Tour
            </Link>
          </div>
        </div>
      )}
    </>
  );
}