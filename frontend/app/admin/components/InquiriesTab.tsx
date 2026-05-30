"use client";

import { useState } from "react";
import { Booking } from "../types";

interface InquiriesTabProps {
  bookings: Booking[];
  selectedInquiryId: string;
  setSelectedInquiryId: (id: string) => void;
  handleUpdateBookingStatus: (id: string, status: Booking["status"]) => void;
  handleDeleteBooking: (id: string) => void;
}

export default function InquiriesTab({
  bookings,
  selectedInquiryId,
  setSelectedInquiryId,
  handleUpdateBookingStatus,
  handleDeleteBooking,
}: InquiriesTabProps) {
  const [inquirySearch, setInquirySearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "paid" | "confirmed">("all");

  const filteredInquiries = bookings.filter((inq) => {
    // 1. Search filter
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.id.toLowerCase().includes(inquirySearch.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Tab filter
    if (activeFilter === "pending") return inq.status === "Pending";
    if (activeFilter === "approved") return inq.status === "Approved" && inq.paymentStatus !== "paid";
    if (activeFilter === "paid") return inq.status === "Approved" && inq.paymentStatus === "paid";
    if (activeFilter === "confirmed") return inq.status === "Confirmed";
    return true; // "all"
  });

  // Calculate statistics
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const approvedUnpaidCount = bookings.filter((b) => b.status === "Approved" && b.paymentStatus !== "paid").length;
  const approvedPaidCount = bookings.filter((b) => b.status === "Approved" && b.paymentStatus === "paid").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;

  return (
    <div className="space-y-8 animate-fade-in font-poppins">
      {/* Header section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Client Inquiries Manager</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Review curation requests, track client deposits, and confirm celebration reservations.
          </p>
        </div>
      </section>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "All Enquiries", count: totalCount, filter: "all" as const, color: "text-[#1F1F1F] bg-white border-[#E8E2D9]" },
          { label: "Pending Curation", count: pendingCount, filter: "pending" as const, color: "text-yellow-700 bg-yellow-50/50 border-yellow-200" },
          { label: "Awaiting Payment", count: approvedUnpaidCount, filter: "approved" as const, color: "text-amber-700 bg-amber-50/50 border-amber-200" },
          { label: "Paid (Verify)", count: approvedPaidCount, filter: "paid" as const, color: "text-emerald-700 bg-emerald-50/50 border-emerald-200" },
          { label: "Confirmed Slots", count: confirmedCount, filter: "confirmed" as const, color: "text-primary bg-[#FBF9F6] border-secondary/30" },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setActiveFilter(stat.filter)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeFilter === stat.filter
                ? "ring-2 ring-secondary/30 shadow-md scale-[1.02]"
                : "hover:bg-[#F8F5F0]/50"
            } ${stat.color}`}
          >
            <p className="text-[10px] font-label-caps font-bold tracking-wider opacity-85">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-2">{stat.count}</p>
          </button>
        ))}
      </div>

      {/* Search & Tabs Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by client name, email, or ID..."
            value={inquirySearch}
            onChange={(e) => setInquirySearch(e.target.value)}
            className="w-full bg-[#F8F5F0] border border-[#E8E2D9] pl-10 pr-4 py-2.5 rounded-full text-xs outline-none focus:ring-1 focus:ring-[#C5A880]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#6B6B6B]">
            search
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {[
            { label: "Show All", value: "all" as const },
            { label: "Pending Only", value: "pending" as const },
            { label: "Awaiting Pay", value: "approved" as const },
            { label: "Paid (Awaiting Booking)", value: "paid" as const },
            { label: "Booked Slots", value: "confirmed" as const },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full border transition-all ${
                activeFilter === tab.value
                  ? "bg-[#1F1F1F] text-white border-[#1F1F1F]"
                  : "bg-white text-[#6B6B6B] border-[#E8E2D9] hover:bg-[#F8F5F0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid (Horizontal Cards) */}
      <div className="space-y-4">
        {filteredInquiries.map((inq) => {
          const isPending = inq.status === "Pending";
          const isApproved = inq.status === "Approved";
          const isConfirmed = inq.status === "Confirmed" || inq.status === "Completed";
          const isPaid = inq.paymentStatus === "paid";

          // Border color indicators
          let sideBorderColor = "border-l-yellow-400";
          if (isConfirmed) sideBorderColor = "border-l-[#1F1F1F]";
          else if (isApproved && isPaid) sideBorderColor = "border-l-emerald-500";
          else if (isApproved) sideBorderColor = "border-l-amber-400";
          else if (inq.status === "Rejected") sideBorderColor = "border-l-red-500";

          return (
            <div
              key={inq.id}
              className={`bg-white border border-[#E8E2D9] border-l-4 ${sideBorderColor} rounded-[24px] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6`}
            >
              {/* Left Column: Client Core Info */}
              <div className="flex items-start gap-4 max-w-sm w-full shrink-0">
                {/* Avatar with Initials */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A880] to-[#A88B60] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  {inq.name ? inq.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      isConfirmed ? "bg-[#1F1F1F] text-white border-[#1F1F1F]" :
                      isApproved ? "bg-green-50 text-green-700 border-green-200" :
                      isPending ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {inq.status === "Confirmed" ? "BOOKED" : inq.status.toUpperCase()}
                    </span>
                    
                    <span className={`text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                      {isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#1F1F1F] leading-tight truncate">{inq.name}</h4>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 truncate">{inq.email}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{inq.phone}</p>
                    <p className="text-[9px] text-[#A0988E] font-mono mt-1">ID: {inq.id}</p>
                  </div>
                </div>
              </div>

              {/* Middle Column: Event Spec */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-[#6B6B6B] flex-1">
                <div>
                  <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-1.5 tracking-wider">PACKAGE & OCCASION</p>
                  <p className="font-semibold text-[#1F1F1F] text-sm">{inq.space}</p>
                  <p className="text-[11px] italic text-[#8A8A8A] mt-0.5">{inq.occasion}</p>
                </div>

                <div>
                  <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-1.5 tracking-wider">DATE & TIMING</p>
                  <p className="font-semibold text-[#1F1F1F] text-sm">{inq.date}</p>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">{inq.slot || "Morning Slot"}</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-1.5 tracking-wider">GUESTS & BILL</p>
                  <p className="font-semibold text-[#1F1F1F] text-sm">{inq.guests} Guests</p>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">{inq.rate}</p>
                  <p className="text-[12px] font-bold mt-1 text-[#C5A880]">
                    Total: ₹{(inq.paymentAmount || inq.estimatedBill || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                
                {inq.notes && (
                  <div className="col-span-2 sm:col-span-3 border-t border-[#EDEBE8] pt-3 mt-1">
                    <p className="font-label-caps text-[8px] text-[#C5A880] font-bold uppercase mb-1 tracking-wider">CLIENT REMARK</p>
                    <p className="italic text-[#1F1F1F] text-[11px] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#EDEBE8]">“{inq.notes}”</p>
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex lg:flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 justify-end">
                {isPending && (
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => handleUpdateBookingStatus(inq.id, "Approved")}
                      className="px-5 py-2.5 bg-[#C5A880] text-white text-[10px] font-label-caps font-bold rounded-full hover:bg-[#Bfa372] transition-all tracking-wider shadow-sm"
                    >
                      APPROVE REQUEST
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(inq.id, "Rejected")}
                      className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-label-caps font-bold rounded-full hover:bg-red-100 transition-all tracking-wider"
                    >
                      REJECT
                    </button>
                  </div>
                )}

                {isApproved && isPaid && (
                  <button
                    onClick={() => handleUpdateBookingStatus(inq.id, "Confirmed")}
                    className="w-full lg:w-auto px-6 py-2.5 bg-green-600 text-white text-[10px] font-label-caps font-bold rounded-full hover:bg-green-700 transition-all tracking-wider shadow-md animate-pulse"
                  >
                    GET BOOKED
                  </button>
                )}

                {isApproved && !isPaid && (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-label-caps font-extrabold rounded-full">
                    <span className="material-symbols-outlined text-xs">hourglass_empty</span>
                    AWAITING PAYMENT
                  </div>
                )}

                {isConfirmed && (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-label-caps font-extrabold rounded-full shadow-inner">
                    <span className="material-symbols-outlined text-xs font-bold">check_circle</span>
                    SLOT SECURED ✓
                  </div>
                )}

                {inq.status === "Rejected" && (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-label-caps font-extrabold rounded-full">
                    <span className="material-symbols-outlined text-xs">cancel</span>
                    REJECTED
                  </div>
                )}

                <button
                  onClick={() => handleDeleteBooking(inq.id)}
                  className="w-9 h-9 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors ml-auto sm:ml-0"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredInquiries.length === 0 && (
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-12 text-center text-[#6B6B6B]">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">drafts</span>
            <p className="text-sm font-semibold">No inquiries match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
