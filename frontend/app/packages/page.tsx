"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

// ─── Tier SVG Icons (monochrome, elegant) ─────────────────────────
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

const packagesList = [
  {
    id: "basic",
    tier: "Basic",
    name: "Basic Package",
    pricePerPerson: 3999,
    priceLabel: "₹3,999",
    duration: "8 Hours Access",
    minGuests: 20,
    desc: "Perfect for intimate gatherings with all essentials covered — great food, fun activities, and a refreshing pool experience.",
    features: [
      "Welcome Drink",
      "Unlimited Veg + Non-Veg Buffet Lunch/Dinner",
      "Swimming Pool Access",
      "Rain Dance Access",
      "Indoor Games (Carrom, Chess, Table Tennis)",
      "Outdoor Games (Cricket, Badminton, Volleyball)",
      "Music System Access",
      "Kids Play Area",
      "Changing Rooms & Lockers",
      "Parking",
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
    previousTier: "Everything in Basic +",
    features: [
      "Premium Welcome Mocktails",
      "Breakfast + Lunch + Evening Snacks + Dinner",
      "Luxury Pool Access",
      "Gaming Zone (PS5, VR, Racing Simulators)",
      "DJ & Dance Floor",
      "Bonfire (Evening Events)",
      "Adventure Activities — Zip Line, Rope Course, Wall Climbing",
      "Photography Spots Access",
      "Dedicated Event Coordinator",
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
    desc: "The ultimate luxury experience with private pools, live entertainment, professional photography, and celebrity-style entry.",
    previousTier: "Everything in Standard +",
    popular: true,
    features: [
      "Luxury Suite Day Access",
      "Unlimited Premium Mocktails",
      "Live Food Counters — Pasta, Pizza, BBQ, Chaat",
      "Water Sports Activities",
      "Private Pool Section",
      "Luxury Cabana Seating",
      "Live DJ Setup",
      "Celebrity-style Entry Setup",
      "Professional Photographer & Drone Coverage",
      "Live Music Performance",
      "Premium Gift Hamper",
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
    previousTier: "Everything in Premium +",
    features: [
      "Private Resort Zone Booking",
      "Butler Service",
      "Unlimited Premium Imported Beverages*",
      "Luxury Suites Access",
      "Jacuzzi & Spa Access",
      "Private Bar Setup",
      "Luxury Yacht-style Pool Experience (if available)",
      "Fireworks Show",
      "LED Wall & Stage Setup",
      "Live Band Performance",
      "Luxury Dinner Experience",
      "VIP Parking",
    ],
  },
];

const discountTiers = [
  { range: "20 – 49", discount: "Standard Price", badge: "" },
  { range: "50 – 99", discount: "5% Off", badge: "5%" },
  { range: "100 – 199", discount: "10% Off", badge: "10%" },
  { range: "200 – 349", discount: "15% Off", badge: "15%" },
  { range: "350 – 500", discount: "20% Off", badge: "20%" },
];

export default function PackagesPage() {
  return (
    <>
      <Navbar activePage="Packages" />

      <main className="bg-background min-h-screen pt-24">
        {/* Hero */}
        <section className="pt-24 pb-16 px-6 md:px-20 text-center max-w-5xl mx-auto">
          <FadeIn>
            <span className="font-label-caps text-secondary mb-6 block uppercase tracking-widest text-xs">
              Pricing & Packages
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-primary mb-8 leading-[1.1] tracking-[-0.02em]">
              Choose the Perfect Package for Your Celebration
            </h1>
            <p className="font-body-lg text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
              From intimate gatherings to grand royal celebrations — select a per-person package that fits your vision. Group discounts available for larger parties.
            </p>
          </FadeIn>
        </section>

        {/* Packages — Horizontal scrollable, no arrows */}
        <section className="pb-16 px-6 md:px-10 max-w-[1600px] mx-auto">
          <div
            className="flex gap-5 overflow-x-auto pt-6 pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {packagesList.map((pkg) => (
              <FadeIn key={pkg.id} className="shrink-0 w-[340px] md:w-[370px] snap-start">
                <div className={`relative bg-white rounded-[20px] border transition-all duration-400 hover:shadow-lg group flex flex-col h-full ${
                  pkg.popular ? "border-[#C5A880] shadow-md" : "border-[#E8E2D9] hover:border-[#C5A880]/50"
                }`}>
                  
                  {/* Popular tag */}
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-[#1F1F1F] text-white font-label-caps text-[8px] tracking-[0.15em] px-4 py-1.5 rounded-full font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Tier label */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[#C5A880]">{TierIcons[pkg.id]}</span>
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

                    {/* Previous tier note */}
                    {pkg.previousTier && (
                      <p className="text-[10px] text-[#C5A880] font-bold tracking-wider uppercase mb-3">
                        {pkg.previousTier}
                      </p>
                    )}

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-[#C5A880] shrink-0 mt-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                          <span className="text-[13px] text-[#3D3D3D] leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={`/booking?package=${pkg.id}`}
                      className={`block w-full text-center text-[11px] font-bold tracking-[0.12em] uppercase px-6 py-4 rounded-xl transition-all duration-300 active:scale-[0.97] ${
                        pkg.popular
                          ? "bg-[#1F1F1F] text-white hover:bg-[#C5A880]"
                          : "bg-[#F6F3EE] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white"
                      }`}
                    >
                      Select this plan
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Group Discount Table */}
        <section className="pb-24 px-6 md:px-20 max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-white rounded-[24px] border border-[#E8E2D9] shadow-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"></div>

              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-3">
                  Group Booking Discounts
                </h2>
                <p className="text-[14px] text-[#6B6B6B]">
                  Enjoy automatic discounts for larger groups. The more, the merrier.
                </p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EDEBE8]">
                    <th className="text-left py-3 px-4 text-[10px] text-[#999] font-bold tracking-[0.12em] uppercase">Guests</th>
                    <th className="text-left py-3 px-4 text-[10px] text-[#999] font-bold tracking-[0.12em] uppercase">Discount</th>
                    <th className="text-right py-3 px-4 text-[10px] text-[#999] font-bold tracking-[0.12em] uppercase">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {discountTiers.map((tier, idx) => (
                    <tr key={idx} className="border-b border-[#F5F3F0] last:border-b-0 hover:bg-[#FDFCFA] transition-colors">
                      <td className="py-3.5 px-4 text-[14px] text-[#1F1F1F] font-semibold">{tier.range} <span className="text-[#999] font-normal">guests</span></td>
                      <td className="py-3.5 px-4 text-[14px] text-[#3D3D3D]">{tier.discount}</td>
                      <td className="py-3.5 px-4 text-right">
                        {tier.badge ? (
                          <span className="text-[10px] text-[#C5A880] font-bold tracking-wider border border-[#C5A880]/30 px-3 py-1 rounded-full">
                            SAVE {tier.badge}
                          </span>
                        ) : (
                          <span className="text-[#CCC]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 p-4 bg-[#FDFCFA] rounded-xl border border-[#EDEBE8] text-center">
                <p className="text-[12px] text-[#8A8A8A]">
                  Discounts are automatically applied based on your guest count. Maximum capacity: <strong className="text-[#1F1F1F]">500 guests</strong>.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Bespoke */}
        <section className="bg-surface-container-low py-24 px-6 md:px-20 text-center">
          <FadeIn className="max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-8 italic">
              &ldquo;True luxury is found in the details that only you can imagine.&rdquo;
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-12">
              For events that defy categorization, our design team is at your disposal to create a completely bespoke experience from the ground up.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 font-label-caps text-xs text-secondary border-b border-secondary pb-1 group hover:gap-6 transition-all duration-300 font-bold"
            >
              Custom Planning Session
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </>
  );
}