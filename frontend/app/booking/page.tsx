"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── SVG Icons ─────────────────────────────────────────────────────
const TierIcons: Record<string, React.ReactNode> = {
  basic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
    </svg>
  ),
  standard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
  premium: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M10 9l2-6 2 6"/>
    </svg>
  ),
  "royal-elite": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20"/><path d="M4 20l2-12 4 5 2-9 2 9 4-5 2 12"/><circle cx="6" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="4" r="1" fill="currentColor"/><circle cx="18" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
};

const TIER_ICON_MAP: Record<string, React.ReactNode> = {
  basic: TierIcons.basic,
  standard: TierIcons.standard,
  premium: TierIcons.premium,
  "royal-elite": TierIcons["royal-elite"],
};

const TIER_ICON_LG_MAP: Record<string, React.ReactNode> = {
  basic: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
    </svg>
  ),
  standard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
  premium: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M10 9l2-6 2 6"/>
    </svg>
  ),
  "royal-elite": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20"/><path d="M4 20l2-12 4 5 2-9 2 9 4-5 2 12"/><circle cx="6" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="4" r="1" fill="currentColor"/><circle cx="18" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
};

const CheckSvg = () => (
  <svg className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ─── Package Data ──────────────────────────────────────────────────
const PACKAGES = [
  {
    id: "basic",
    tier: "Basic",
    name: "Basic Package",
    pricePerPerson: 3999,
    priceLabel: "₹3,999",
    duration: "8 Hours Access",
    minGuests: 20,
    desc: "Perfect for intimate gatherings with all essentials covered — great food, fun activities, and a refreshing pool experience.",
    topFeatures: [
      "Welcome Drink",
      "Unlimited Veg + Non-Veg Buffet Lunch/Dinner",
      "Swimming Pool Access",
      "Rain Dance Access",
      "Indoor & Outdoor Games",
      "Kids Play Area & Parking",
    ],
  },
  {
    id: "standard",
    tier: "Standard",
    name: "Standard Package",
    pricePerPerson: 7499,
    priceLabel: "₹7,499",
    duration: "Full Day (12 Hours)",
    minGuests: 20,
    desc: "A full-day experience with premium amenities, adventure activities, entertainment, and a dedicated event coordinator.",
    topFeatures: [
      "Everything in Basic +",
      "Premium Welcome Mocktails",
      "Breakfast + Lunch + Evening Snacks + Dinner",
      "Gaming Zone (PS5, VR)",
      "DJ & Dedicated Coordinator",
    ],
  },
  {
    id: "premium",
    tier: "Premium",
    name: "Premium Package",
    pricePerPerson: 14999,
    priceLabel: "₹14,999",
    duration: "Full Day + Late Evening",
    minGuests: 20,
    popular: true,
    desc: "The ultimate luxury experience with private pools, live entertainment, professional photography, and celebrity-style entry.",
    topFeatures: [
      "Everything in Standard +",
      "Luxury Suite & Cabana Seating",
      "Live Food Counters & Water Sports",
      "Celebrity Entry & Live DJ Setup",
      "Pro Photographer & Drone Coverage",
    ],
  },
  {
    id: "royal-elite",
    tier: "Royal Elite",
    name: "Royal Elite Package",
    pricePerPerson: 24999,
    priceLabel: "₹24,999",
    duration: "Full Day / Event-Based",
    minGuests: 50,
    desc: "The most exclusive, all-inclusive experience — your own private resort zone with butler service, luxury suites, spa, and fireworks.",
    topFeatures: [
      "Everything in Premium +",
      "Private Resort Zone Booking",
      "Butler Service & Imported Beverages*",
      "Jacuzzi, Spa & Private Bar",
      "Live Band & Luxury Dinner",
    ],
  },
];

// ─── Discount ──────────────────────────────────────────────────────
function getDiscountPercent(guestCount: number): number {
  if (guestCount >= 350) return 20;
  if (guestCount >= 200) return 15;
  if (guestCount >= 100) return 10;
  if (guestCount >= 50) return 5;
  return 0;
}

function getDiscountLabel(guestCount: number): string {
  const pct = getDiscountPercent(guestCount);
  if (pct === 0) return "";
  return `${pct}% Group Discount`;
}

// ─── Booking Form ─────────────────────────────────────────────────
function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [authChecking, setAuthChecking] = useState(true);
  const [sessionUser, setSessionUser] = useState<{ name?: string; email?: string; id?: string } | null>(null);

  // Form States
  const [selectedPackageId, setSelectedPackageId] = useState("basic");
  const [occasion, setOccasion] = useState("Wedding Celebration");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [, setIsSubmitted] = useState(false);
  const [confirmedBookings, setConfirmedBookings] = useState<{ preferredDate: string; eventType: string; addOns?: string[] }[]>([]);
  const [exactGuestCount, setExactGuestCount] = useState("20");
  const [guestCountError, setGuestCountError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[0];

  useEffect(() => {
    async function fetchConfirmedBookings() {
      try {
        const res = await fetch("/api/enquiries/confirmed");
        const json = await res.json();
        if (json.success) setConfirmedBookings(json.data);
      } catch (err) {
        console.error("Error fetching confirmed slots:", err);
      }
    }
    fetchConfirmedBookings();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (!session?.user) {
          const currentUrl = window.location.pathname + window.location.search;
          router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
          return;
        }
        setSessionUser(session.user);
        const profileRes = await fetch("/api/auth/profile");
        const profileJson = await profileRes.json();
        if (profileJson.success) {
          setFullName(profileJson.data.name || "");
          setEmail(profileJson.data.email || "");
          setPhone(profileJson.data.phone || "");
        } else {
          setFullName(session.user.name || "");
          setEmail(session.user.email || "");
        }
      } catch {
        router.push("/login?callbackUrl=/booking");
        return;
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    const qOccasion = searchParams.get("occasion");
    const qDate = searchParams.get("date");
    const qSlot = searchParams.get("slot");
    const qPackage = searchParams.get("package");
    if (qOccasion) setOccasion(qOccasion);
    if (qSlot) setSelectedTimeSlot(qSlot);
    if (qDate) {
      const d = new Date(qDate);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
        setCurrentMonth(d.getMonth());
        setCurrentYear(d.getFullYear());
      }
    }
    if (qPackage) {
      const found = PACKAGES.find((p) => p.id === qPackage);
      if (found) {
        setSelectedPackageId(found.id);
        setExactGuestCount(String(found.minGuests));
        setStep(2);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (step > 1) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ─── Data ──────────────────────────────────────────────────────
  const occasionsExtended = [
    { name: "Wedding Celebration", desc: "Grand matrimonial events" },
    { name: "Corporate Gala", desc: "Executive business banquets" },
    { name: "Reception & Cocktails", desc: "Elegant evening soirées" },
    { name: "Birthday & Anniversary", desc: "Intimate landmark milestones" },
    { name: "Conference & Summit", desc: "Distinguished assemblies" },
    { name: "Private Soirée", desc: "Bespoke VIP gatherings" },
  ];

  const timeSlotsExtended = [
    { name: "Morning Slot", desc: "09:00 AM - 03:00 PM" },
    { name: "Evening Slot", desc: "05:00 PM - 11:00 PM" },
    { name: "Full Day", desc: "09:00 AM - 11:00 PM" },
  ];

  // ─── Calendar ──────────────────────────────────────────────────
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPastDate = (day: number) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(currentYear, currentMonth, day) < today;
  };



  const isDateFullyBooked = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const dayBookings = confirmedBookings.filter((b) => {
      const bd = new Date(b.preferredDate);
      return bd.getFullYear() === checkDate.getFullYear() && bd.getMonth() === checkDate.getMonth() && bd.getDate() === checkDate.getDate();
    });
    if (dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Full Day")) return true;
    return dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Morning Slot") &&
           dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Evening Slot");
  };

  const isDateDisabled = (day: number) => isPastDate(day) || isDateFullyBooked(day);

  const isSlotBookedOnSelectedDate = (slotName: string) => {
    if (!selectedDate) return false;
    const parsedDate = new Date(selectedDate);
    const dayBookings = confirmedBookings.filter((b) => {
      const bd = new Date(b.preferredDate);
      return bd.getFullYear() === parsedDate.getFullYear() && bd.getMonth() === parsedDate.getMonth() && bd.getDate() === parsedDate.getDate();
    });
    if (dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Full Day")) return true;
    if (slotName === "Full Day") return dayBookings.length > 0;
    return dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === slotName);
  };

  const isPrevMonthDisabled = () => {
    const today = new Date();
    return currentYear <= today.getFullYear() && currentMonth <= today.getMonth();
  };
  const handlePrevMonth = () => {
    if (isPrevMonthDisabled()) return;
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const handleSelectDate = (day: number) => {
    if (isDateDisabled(day)) return;
    const newDateStr = `${monthNames[currentMonth]} ${day}, ${currentYear}`;
    setSelectedDate(newDateStr);
    const testDate = new Date(currentYear, currentMonth, day);
    const dayBookings = confirmedBookings.filter((b) => {
      const bd = new Date(b.preferredDate);
      return bd.getFullYear() === testDate.getFullYear() && bd.getMonth() === testDate.getMonth() && bd.getDate() === testDate.getDate();
    });
    const hasFullDay = dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Full Day");
    const hasMorning = dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Morning Slot");
    const hasEvening = dayBookings.some(b => (b.addOns?.[0] || "Morning Slot") === "Evening Slot");
    if (selectedTimeSlot === "Morning Slot" && (hasFullDay || hasMorning)) setSelectedTimeSlot("");
    else if (selectedTimeSlot === "Evening Slot" && (hasFullDay || hasEvening)) setSelectedTimeSlot("");
    else if (selectedTimeSlot === "Full Day" && dayBookings.length > 0) setSelectedTimeSlot("");
  };

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const pkg = PACKAGES.find((p) => p.id === pkgId)!;
    const currentGuests = parseInt(exactGuestCount, 10) || 0;
    if (currentGuests < pkg.minGuests) setExactGuestCount(String(pkg.minGuests));
    setStep(2);
  };

  const handleGuestCountChange = (val: string) => {
    setExactGuestCount(val);
    const count = parseInt(val, 10);
    if (isNaN(count) || count < selectedPackage.minGuests) {
      setGuestCountError(`Minimum ${selectedPackage.minGuests} guests required for ${selectedPackage.name}`);
    } else if (count > 500) {
      setGuestCountError("Maximum 500 guests allowed");
    } else {
      setGuestCountError("");
    }
  };

  // ─── Price Calculation ────────────────────────────────────────
  const guestCount = Math.max(parseInt(exactGuestCount, 10) || 0, 0);
  const isFullDay = selectedTimeSlot === "Full Day";
  const baseSubtotal = selectedPackage.pricePerPerson * guestCount;
  const fullDayUpgradeCost = isFullDay ? 699 * guestCount : 0;
  const subtotal = baseSubtotal + fullDayUpgradeCost;
  const discountPct = getDiscountPercent(guestCount);
  const discountAmount = Math.round(subtotal * (discountPct / 100));
  const totalAmount = subtotal - discountAmount;

  const handleSubmitDetailsForm = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(exactGuestCount, 10);
    if (isNaN(count) || count < selectedPackage.minGuests || count > 500) return;
    setStep(4);
  };

  const handleConfirmBookingAndSubmit = async () => {
    let mappedEventType = "Custom";
    if (occasion === "Wedding Celebration") mappedEventType = "Wedding";
    else if (occasion === "Corporate Gala" || occasion === "Conference & Summit") mappedEventType = "Corporate";
    else if (occasion === "Birthday & Anniversary") mappedEventType = "Birthday";
    else if (occasion === "Reception & Cocktails" || occasion === "Private Soirée") mappedEventType = "Social";

    const mappedGuests = parseInt(exactGuestCount, 10) || 20;
    const parsedDate = new Date(selectedDate);
    const dateStr = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

    const payload = {
      eventType: mappedEventType,
      packageSelected: selectedPackageId,
      expectedGuests: mappedGuests,
      preferredDate: dateStr,
      message: specialRequests,
      addOns: [selectedTimeSlot, selectedPackage.name],
      guestName: fullName,
      guestEmail: email,
      guestPhone: phone,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to submit enquiry."); return; }
      setIsSubmitted(true);
      setStep(5);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please check your connection and try again.");
    }
  };

  const handleReset = () => {
    setIsSubmitted(false); setStep(1);
    setSelectedPackageId("basic"); setOccasion("Wedding Celebration");
    setSelectedTimeSlot(""); setSelectedDate(""); setSpecialRequests("");
    setExactGuestCount("20"); setGuestCountError("");
    setCurrentMonth(new Date().getMonth()); setCurrentYear(new Date().getFullYear());
  };

  if (authChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
        <span className="font-label-caps text-[#C5A880] text-xs tracking-widest font-extrabold animate-pulse">VERIFYING YOUR IDENTITY...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 w-full relative">
      <div id="booking-wizard-container" className="w-full bg-surface-container-low rounded-[40px] p-8 md:p-14 border border-secondary/10 shadow-xl shadow-secondary/5">
        {/* Step dots */}
        {step < 5 && (
          <nav className="flex flex-wrap items-center gap-4 mb-12">
            <button onClick={() => setStep(1)} className={`w-3.5 h-3.5 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-outline-variant"}`} />
            <div className="h-[1px] w-8 bg-outline-variant"></div>
            <button onClick={() => { if (selectedPackageId) setStep(2); }} className={`w-3.5 h-3.5 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-outline-variant"}`} />
            <div className="h-[1px] w-8 bg-outline-variant"></div>
            <button onClick={() => { if (selectedPackageId && selectedDate) setStep(3); }} className={`w-3.5 h-3.5 rounded-full transition-all ${step >= 3 ? "bg-primary" : "bg-outline-variant"}`} />
            <div className="h-[1px] w-8 bg-outline-variant"></div>
            <button onClick={() => { if (selectedPackageId && selectedDate && fullName && email && phone) setStep(4); }} className={`w-3.5 h-3.5 rounded-full transition-all ${step >= 4 ? "bg-primary" : "bg-outline-variant"}`} />
            <span className="ml-4 font-label-caps text-xs text-on-surface-variant font-bold">
              {step === 1 && "Step 1: Choose Package"}
              {step === 2 && "Step 2: Date & Options"}
              {step === 3 && "Step 3: Enter Details"}
              {step === 4 && "Step 4: Review & Send"}
            </span>
          </nav>
        )}

        {/* ═══ STEP 1: SELECT PACKAGE (Horizontal Scroll) ═══ */}
        {step === 1 && (
          <section className="animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-3 font-semibold">
              Choose your package.
            </h1>
            <p className="font-body-md text-on-surface-variant mb-8">
              Select a per-person package that best fits your celebration. Group discounts apply automatically.
            </p>

            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pt-6 pb-6 scrollbar-hide snap-x snap-mandatory"
            >
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`shrink-0 w-[340px] md:w-[370px] snap-start group cursor-pointer bg-white rounded-[20px] p-7 transition-all duration-400 hover:shadow-lg border flex flex-col relative ${
                    selectedPackageId === pkg.id
                      ? "border-[#C5A880] ring-1 ring-[#C5A880] shadow-md"
                      : "border-[#E8E2D9] hover:border-[#C5A880]/50"
                  }`}
                >
                  {/* Popular tag */}
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-[#1F1F1F] text-white font-label-caps text-[8px] tracking-[0.15em] px-4 py-1.5 rounded-full font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-1 flex flex-col flex-1">
                    {/* Tier label */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[#C5A880]">{TIER_ICON_MAP[pkg.id]}</span>
                      <span className="font-label-caps text-[10px] text-[#C5A880] tracking-[0.15em] font-bold">
                        {pkg.tier.toUpperCase()}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-[38px] text-[#1F1F1F] font-bold leading-none tracking-tight">
                        {pkg.priceLabel}
                      </span>
                      <span className="text-[11px] text-[#8A8A8A] font-medium">
                        / person
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-[#6B6B6B] leading-relaxed mb-6">
                      {pkg.desc}
                    </p>

                    {/* Duration & Guests — subtle pills */}
                    <div className="flex gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-[#6B6B6B] font-medium bg-[#F6F3EE] px-3 py-1.5 rounded-lg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {pkg.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-[#6B6B6B] font-medium bg-[#F6F3EE] px-3 py-1.5 rounded-lg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        Min {pkg.minGuests}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#EDEBE8] mb-5"></div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {pkg.topFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckSvg />
                          <span className="text-[13px] text-[#3D3D3D] leading-snug">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className={`w-full text-center text-[11px] font-bold tracking-[0.12em] uppercase px-6 py-4 rounded-xl transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 ${
                      selectedPackageId === pkg.id
                        ? "bg-[#1F1F1F] text-white"
                        : "bg-[#F6F3EE] text-[#1F1F1F] group-hover:bg-[#1F1F1F] group-hover:text-white"
                    }`}>
                      {selectedPackageId === pkg.id ? "SELECTED PLAN" : "SELECT PLAN"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Group Discount Note */}
            <div className="mt-6 p-4 bg-[#F0FFF4] rounded-2xl border border-green-200/50 flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">local_offer</span>
              <div>
                <p className="text-sm font-bold text-green-800 mb-0.5">Group Booking Discounts Available!</p>
                <p className="text-xs text-green-700">
                  50-99 guests: <strong>5% off</strong> · 100-199: <strong>10% off</strong> · 200-349: <strong>15% off</strong> · 350-500: <strong>20% off</strong>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ═══ STEP 2: DATE & OPTIONS ═══ */}
        {step === 2 && (
          <section className="animate-fade-in space-y-8">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-2 transition-colors font-label-caps text-xs font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO PACKAGES
            </button>

            {/* Selected Package Bar */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#EDEBE8]">
              <div className="inline-flex items-center gap-1.5 text-[#C5A880] bg-[#C5A880]/10 px-3 py-1.5 rounded-full text-[9px] font-label-caps tracking-wider font-bold border border-[#C5A880]/20">
                {TIER_ICON_MAP[selectedPackage.id]}
                {selectedPackage.tier.toUpperCase()}
              </div>
              <span className="font-display text-xl text-[#1F1F1F] font-bold">{selectedPackage.priceLabel}</span>
              <span className="text-[10px] text-[#8A8A8A] font-semibold">/ Person</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-6 font-semibold">Select date & options.</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Occasion + Guest Count + Time Slots */}
              <div className="lg:col-span-5 space-y-8">
                {/* Occasion */}
                <div className="space-y-4">
                  <span className="font-label-caps text-secondary text-xs block font-bold tracking-widest border-b border-secondary/15 pb-2">SELECT OCCASION</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {occasionsExtended.map((occ) => (
                      <button key={occ.name} type="button" onClick={() => setOccasion(occ.name)}
                        className={`p-4 rounded-2xl transition-all border text-left flex flex-col gap-1 ${
                          occasion === occ.name ? "bg-primary text-on-primary border-primary font-bold shadow-md shadow-primary/10" : "bg-surface text-on-surface border-secondary/15 hover:bg-surface-container hover:border-secondary/25"
                        }`}>
                        <span className="font-label-caps text-xs tracking-wider">{occ.name}</span>
                        <span className={`text-[10px] ${occasion === occ.name ? "text-on-primary/75" : "text-on-surface-variant/65"}`}>{occ.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="space-y-4">
                  <span className="font-label-caps text-secondary text-xs block font-bold tracking-widest border-b border-secondary/15 pb-2">
                    NUMBER OF GUESTS
                    <span className="text-on-surface-variant font-medium ml-2 normal-case text-[10px]">(Min {selectedPackage.minGuests} — Max 500)</span>
                  </span>
                  <input
                    className={`w-full bg-surface border-none ring-1 ${guestCountError ? "ring-red-400 focus:ring-red-500" : "ring-outline-variant focus:ring-2 focus:ring-primary"} rounded-2xl px-6 py-4 font-body-lg text-on-surface placeholder:text-on-surface-variant/40 transition-all`}
                    placeholder={`e.g. ${selectedPackage.minGuests}`}
                    type="number"
                    min={selectedPackage.minGuests}
                    max={500}
                    value={exactGuestCount}
                    onChange={(e) => handleGuestCountChange(e.target.value)}
                  />
                  {guestCountError && (
                    <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>{guestCountError}
                    </p>
                  )}
                  {!guestCountError && guestCount >= 50 && (
                    <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">local_offer</span>
                      {getDiscountLabel(guestCount)} will be applied!
                    </p>
                  )}
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                  <span className="font-label-caps text-secondary text-xs block font-bold tracking-widest border-b border-secondary/15 pb-2">SELECT TIME SLOT</span>
                  {!selectedDate ? (
                    <div className="p-4 bg-[#FAF7F3] border border-secondary/20 rounded-2xl text-center">
                      <p className="text-xs text-on-surface-variant font-semibold">Please select an event date first to see available slots.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 animate-fade-in">
                      {timeSlotsExtended.map((slot) => {
                        const isBooked = isSlotBookedOnSelectedDate(slot.name);
                        const isSelected = selectedTimeSlot === slot.name;
                        return (
                          <button key={slot.name} type="button" disabled={isBooked} onClick={() => setSelectedTimeSlot(slot.name)}
                            className={`p-4 rounded-2xl transition-all border text-left flex flex-col gap-1 relative ${
                              isBooked ? "bg-surface-container-highest/40 text-on-surface-variant/40 border-secondary/5 cursor-not-allowed opacity-50"
                                : isSelected ? "bg-primary text-on-primary border-primary font-bold shadow-md shadow-primary/10"
                                : "bg-surface text-on-surface border-secondary/15 hover:bg-surface-container hover:border-secondary/25"
                            }`}>
                            <div className="flex justify-between items-center w-full">
                              <span className="font-label-caps text-xs tracking-wider">{slot.name}</span>
                              {isBooked && <span className="font-label-caps text-[8px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 font-extrabold tracking-widest">BOOKED</span>}
                            </div>
                            <span className={`text-[10px] ${isBooked ? "text-on-surface-variant/30" : isSelected ? "text-on-primary/75" : "text-on-surface-variant/65"}`}>{slot.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Calendar */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="font-label-caps text-secondary text-xs block font-bold tracking-widest border-b border-secondary/15 pb-2">CHOOSE EVENT DATE</span>
                  <div className="bg-surface rounded-3xl p-6 md:p-8 border border-secondary/15 shadow-[0_16px_32px_rgba(117,90,40,0.04)]">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="font-display text-2xl text-on-surface font-semibold">{monthNames[currentMonth]} {currentYear}</h4>
                      <div className="flex gap-3">
                        <button type="button" disabled={isPrevMonthDisabled()} onClick={handlePrevMonth} className="w-10 h-10 rounded-full border border-secondary/25 flex items-center justify-center hover:bg-secondary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                        </button>
                        <button type="button" onClick={handleNextMonth} className="w-10 h-10 rounded-full border border-secondary/25 flex items-center justify-center hover:bg-secondary/10 transition-all">
                          <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                        <div key={d} className="font-label-caps text-[10px] text-on-surface-variant opacity-60 pb-2 font-bold">{d}</div>
                      ))}
                      {Array.from({ length: startOffset }).map((_, idx) => <div key={`e-${idx}`} className="h-12 md:h-14" />)}
                      {calendarDays.map((day) => {
                        const isBooked = isDateFullyBooked(day);
                        const isPast = isPastDate(day);
                        const isSelected = selectedDate === `${monthNames[currentMonth]} ${day}, ${currentYear}`;
                        const dNum = new Date(currentYear, currentMonth, day).getDay();
                        const isPeak = dNum === 0 || dNum === 6;
                        let cellStyle = "h-12 md:h-14 flex items-center justify-center rounded-full font-sans text-sm font-semibold cursor-pointer transition-all mx-auto w-12 md:w-14 ";
                        if (isPast || isBooked) cellStyle += "bg-surface-container-highest text-on-surface-variant opacity-25 cursor-not-allowed line-through";
                        else if (isSelected) cellStyle += "bg-primary text-on-primary font-bold shadow-lg shadow-primary/30 scale-105";
                        else if (isPeak) cellStyle += "bg-secondary/15 border border-secondary/35 text-secondary hover:bg-secondary/30 hover:scale-105";
                        else cellStyle += "hover:bg-secondary/10 hover:text-secondary text-on-surface";
                        return <button key={day} type="button" disabled={isPast || isBooked} onClick={() => handleSelectDate(day)} className={cellStyle}>{day}</button>;
                      })}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-secondary/15">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-secondary/30"></div><span className="font-label-caps text-[10px] text-on-surface-variant font-bold">AVAILABLE</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary/15 border border-secondary/35"></div><span className="font-label-caps text-[10px] text-on-surface-variant font-bold">PEAK DATE (WEEKEND)</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-surface-container-highest opacity-55"></div><span className="font-label-caps text-[10px] text-on-surface-variant font-bold">FULLY BOOKED</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-secondary/10 flex justify-end">
              <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTimeSlot || !!guestCountError}
                className="w-full md:w-auto px-12 py-5 bg-primary text-on-primary rounded-full font-label-caps text-xs hover:bg-secondary transition-all transform active:scale-95 shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed font-bold">
                CONTINUE TO DETAILS
              </button>
            </div>
          </section>
        )}

        {/* ═══ STEP 3: PERSONAL DETAILS ═══ */}
        {step === 3 && (
          <section className="animate-fade-in">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 transition-colors font-label-caps text-xs font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO SELECTION
            </button>
            <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-8 font-semibold">Personalize your event.</h1>

            {sessionUser && (
              <div className="flex items-center gap-4 mb-8 p-5 bg-[#F3EEE7] rounded-[20px] border border-[#C5A880]/20">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C5A880] to-[#A88B60] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1F1F1F]">Booking as {fullName || sessionUser.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">Details auto-filled from your profile.</p>
                </div>
                <Link href="/profile" className="shrink-0 text-[10px] font-bold text-[#C5A880] uppercase tracking-wider hover:underline">Edit Profile</Link>
              </div>
            )}

            <form id="booking-details-form" onSubmit={handleSubmitDetailsForm} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-label-caps text-secondary text-xs ml-4 font-bold">FULL NAME</label>
                  <input className="w-full bg-surface border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary rounded-full px-8 py-5 font-body-lg text-on-surface placeholder:text-on-surface-variant/40 transition-all" placeholder="e.g. Vanshaj Sharma" required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-secondary text-xs ml-4 font-bold">EMAIL ADDRESS</label>
                  <input className="w-full bg-surface border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary rounded-full px-8 py-5 font-body-lg text-on-surface placeholder:text-on-surface-variant/40 transition-all" placeholder="email@example.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-secondary text-xs ml-4 font-bold">PHONE NUMBER</label>
                  <input className="w-full bg-surface border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary rounded-full px-8 py-5 font-body-lg text-on-surface placeholder:text-on-surface-variant/40 transition-all" placeholder="+91 99999 99999" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-secondary text-xs ml-4 font-bold">ADDITIONAL NOTES</label>
                  <input className="w-full bg-surface border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary rounded-full px-8 py-5 font-body-lg text-on-surface placeholder:text-on-surface-variant/40 transition-all" placeholder="Tell us about your vision..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-5 bg-[#1F1F1F] text-white rounded-full font-label-caps text-xs tracking-widest hover:bg-secondary hover:scale-[1.01] transition-all transform active:scale-95 shadow-xl shadow-secondary/10 font-bold">
                  SAVE & VIEW SUMMARY
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ═══ STEP 4: REVIEW & SEND INQUIRY ═══ */}
        {step === 4 && (
          <section className="animate-fade-in space-y-8">
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4 transition-colors font-label-caps text-xs font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO EDIT DETAILS
            </button>

            <header className="mb-8">
              <span className="font-label-caps text-secondary text-xs font-bold tracking-widest uppercase">Step 4: Review & Send</span>
              <h1 className="font-display text-3xl md:text-4xl text-on-surface font-semibold mt-2">Verify Your Booking</h1>
              <p className="font-body-md text-on-surface-variant mt-2">Please check your package, event details, and pricing before sending your inquiry.</p>
            </header>

            <div className="bg-[#FCFAF7] rounded-[32px] border-2 border-[#C5A880]/30 shadow-2xl relative overflow-hidden p-6 md:p-10">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A880]/40 via-[#C5A880] to-[#C5A880]/40"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-[#E8E2D9] gap-4">
                <div>
                  <span className="font-label-caps text-[9px] text-secondary tracking-widest font-extrabold uppercase">BOOKING SUMMARY</span>
                  <div className="flex items-center gap-3 mt-1">
                    {TIER_ICON_LG_MAP[selectedPackage.id]}
                    <h2 className="font-display text-2xl text-primary font-black">{selectedPackage.name}</h2>
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-secondary tracking-widest font-extrabold bg-[#C5A880]/15 px-4 py-2 rounded-full border border-[#C5A880]/30">
                  {selectedPackage.priceLabel} / PERSON
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <h3 className="font-display text-lg text-primary font-bold border-b border-[#E8E2D9] pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-xl">event</span> Event Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-xs">
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Selected Package</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1 flex items-center gap-1.5">{TIER_ICON_MAP[selectedPackage.id]} {selectedPackage.name}</p></div>
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Event Occasion</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{occasion}</p></div>
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Preferred Date</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{selectedDate}</p></div>
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Timing Slot</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{selectedTimeSlot}</p></div>
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Duration</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{selectedPackage.duration}</p></div>
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Number of Guests</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{guestCount} Persons</p></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="font-display text-lg text-primary font-bold border-b border-[#E8E2D9] pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-xl">person</span> Client Details
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div><p className="font-label-caps text-[10px] text-secondary font-bold">Full Name</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{fullName}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="font-label-caps text-[10px] text-secondary font-bold">Email</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1 truncate">{email}</p></div>
                      <div><p className="font-label-caps text-[10px] text-secondary font-bold">Phone</p><p className="font-body-md text-[#1F1F1F] font-extrabold mt-1">{phone}</p></div>
                    </div>
                  </div>
                </div>
              </div>

              {specialRequests && (
                <div className="mt-8 pt-6 border-t border-[#E8E2D9] text-xs">
                  <p className="font-label-caps text-[10px] text-secondary font-bold mb-2">Additional Notes</p>
                  <p className="italic text-[#1F1F1F] font-medium leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9]">&ldquo;{specialRequests}&rdquo;</p>
                </div>
              )}

              {/* ═══ PRICING BREAKDOWN ═══ */}
              <div className="mt-8 pt-8 border-t-2 border-[#E8E2D9]">
                <h3 className="font-display text-lg text-primary font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">receipt_long</span> Estimated Pricing
                </h3>
                <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2D9]">
                    <div><p className="text-sm font-semibold text-[#1F1F1F]">Base Per Person Price</p><p className="text-[10px] text-on-surface-variant">{selectedPackage.name}</p></div>
                    <span className="font-body-md text-[#1F1F1F] font-bold">₹{selectedPackage.pricePerPerson.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2D9]">
                    <p className="text-sm font-semibold text-[#1F1F1F]">Number of Guests</p>
                    <span className="font-body-md text-[#1F1F1F] font-bold">× {guestCount}</span>
                  </div>
                  {isFullDay && (
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2D9] bg-amber-50/20">
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F] text-amber-900">Full Day Slot Upgrade</p>
                        <p className="text-[10px] text-amber-700 font-medium">Additional ₹699 / Person surcharge</p>
                      </div>
                      <span className="font-body-md text-amber-900 font-bold">+₹{fullDayUpgradeCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2D9] bg-[#FAFAF8]">
                    <p className="text-sm font-semibold text-[#1F1F1F]">Subtotal</p>
                    <span className="font-body-md text-[#1F1F1F] font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2D9] bg-green-50/80">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 font-label-caps text-[9px] font-extrabold px-3 py-1 rounded-full border border-green-200">
                          <span className="material-symbols-outlined text-xs">local_offer</span>{discountPct}% OFF
                        </span>
                        <div><p className="text-sm font-semibold text-green-800">Group Discount</p><p className="text-[10px] text-green-600">Offer Applied for {guestCount} guests!</p></div>
                      </div>
                      <span className="font-body-md text-green-700 font-bold">−₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-6 py-5 bg-[#1F1F1F]">
                    <div><p className="text-sm font-bold text-white">Estimated Total</p><p className="text-[10px] text-white/60">Payment after approval</p></div>
                    <span className="font-display text-2xl md:text-3xl font-black text-white">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={() => setStep(3)} className="flex-1 sm:flex-initial px-6 py-3.5 bg-white border border-[#E8E2D9] text-[#1F1F1F] rounded-full font-label-caps text-[10px] font-bold hover:bg-[#FAF8F5] transition-all text-center tracking-wider">
                  EDIT DETAILS
                </button>
                <button onClick={handleConfirmBookingAndSubmit}
                  className="flex-1 sm:flex-initial px-8 py-3.5 bg-secondary text-on-secondary rounded-full font-label-caps text-[10px] font-bold hover:bg-primary hover:text-on-primary transition-all text-center tracking-widest shadow-lg shadow-secondary/10 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm font-bold">send</span>
                  SEND INQUIRY
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ STEP 5: SUCCESS ═══ */}
        {step === 5 && (
          <section className="text-center py-20 px-8 relative overflow-hidden bg-surface rounded-[40px] border border-secondary-fixed">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-[#1F1F1F] text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-6 font-semibold">Inquiry Sent Successfully!</h1>
              <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto mb-4">
                Your inquiry for <span className="text-primary font-bold inline-flex items-center gap-1">{TIER_ICON_MAP[selectedPackage.id]} {selectedPackage.name}</span> for{" "}
                <span className="text-primary font-bold">{guestCount} guests</span> has been received.
              </p>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-4">
                Estimated amount: <span className="font-bold text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
              </p>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-12 text-sm">
                Our team will review your inquiry and get back to you shortly. Payment will be processed after approval.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={handleReset} className="px-10 py-5 bg-[#1F1F1F] text-white rounded-full font-label-caps text-xs hover:opacity-90 transition-all font-bold">RETURN TO BOOKING</button>
                <Link href="/my-enquiries" className="px-10 py-5 bg-secondary text-on-secondary rounded-full font-label-caps text-xs hover:bg-primary hover:text-on-primary transition-all font-bold">TRACK ENQUIRY STATUS</Link>
                <Link href="/admin" className="px-10 py-5 border border-primary text-primary rounded-full font-label-caps text-xs hover:bg-primary hover:text-on-primary transition-all font-bold">VIEW DASHBOARD</Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar activePage="Booking" />
      <main className="pt-32 pb-24 px-6 md:px-12 w-full max-w-[1500px] mx-auto min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <span className="font-label-caps text-secondary text-sm animate-pulse">LOADING BOOKING ENGINE...</span>
          </div>
        }>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}