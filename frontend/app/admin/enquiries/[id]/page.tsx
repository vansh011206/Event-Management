"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

interface Enquiry {
  _id: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  userId?: {
    name: string;
    email: string;
    phone: string;
  };
  eventType: string;
  packageSelected: string;
  expectedGuests: number;
  preferredDate: string;
  message?: string;
  addOns?: string[];
  status: "pending" | "approved" | "rejected" | "confirmed";
  paymentStatus: "unpaid" | "paid";
  paymentOrderId?: string;
  paymentAmount?: number;
  adminNote?: string;
  createdAt: string;
}

export default function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();

  const fetchEnquiryDetails = async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setEnquiry(json.data);
        setAdminNote(json.data.adminNote || "");
      } else {
        alert(json.error || "Enquiry not found.");
        router.push("/admin/enquiries");
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryDetails();
  }, [params.id]);

  const handleUpdateStatus = async (newStatus: "approved" | "rejected" | "confirmed") => {
    if (!confirm(`Are you sure you want to mark this enquiry as ${newStatus === "confirmed" ? "BOOKED" : newStatus}?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNote }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Booking request successfully ${newStatus === "approved" ? "approved" : newStatus === "confirmed" ? "confirmed & booked" : "rejected"}.`);
        fetchEnquiryDetails();
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Admin internal note saved successfully.");
        fetchEnquiryDetails();
      } else {
        alert(data.error || "Failed to save note.");
      }
    } catch (err) {
      alert("Error saving note.");
    } finally {
      setSavingNote(false);
    }
  };

  const getEnquiryName = (enq: Enquiry) => {
    return enq.userId ? enq.userId.name : enq.guestName || "Guest User";
  };

  const getEnquiryEmail = (enq: Enquiry) => {
    return enq.userId ? enq.userId.email : enq.guestEmail || "";
  };

  const getEnquiryPhone = (enq: Enquiry) => {
    return enq.userId ? enq.userId.phone : enq.guestPhone || "";
  };

  const getSpaceLabel = (eventType: string, addOns?: string[]) => {
    if (addOns && addOns.includes("The Crystal Ballroom")) return "The Crystal Ballroom";
    if (addOns && addOns.includes("The Terrace Gardens")) return "The Terrace Gardens";
    if (addOns && addOns.includes("Private Lounges")) return "Private Lounges";

    if (eventType === "Wedding" || eventType === "Corporate") return "The Crystal Ballroom";
    if (eventType === "Social") return "The Terrace Gardens";
    return "Private Lounges";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold animate-pulse">LOADING DETAILS...</span>
      </div>
    );
  }

  if (!enquiry) return null;

  return (
    <div className="flex h-screen bg-[#F8F5F0] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header bar */}
        <header className="bg-white border-b border-[#E8E2D9] py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-primary"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-display font-semibold text-xl text-[#1F1F1F]">Enquiry Details</h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-label-caps font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to List
          </Link>
        </header>

        <main className="p-6 md:p-12 max-w-5xl w-full mx-auto space-y-8">
          {/* Card info header */}
          <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex gap-2">
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  enquiry.status === "confirmed" ? "bg-primary text-white border-primary" :
                  enquiry.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                  enquiry.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {enquiry.status}
                </span>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  enquiry.paymentStatus === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}>
                  {enquiry.paymentStatus}
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold text-primary mt-3 font-medium">{getSpaceLabel(enquiry.eventType, enquiry.addOns)}</h1>
              <p className="text-xs text-[#6B6B6B] mt-1">Enquiry ID: <span className="font-mono text-primary">{enquiry._id}</span></p>
            </div>

            {enquiry.status === "pending" && (
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("approved")}
                  className="flex-1 md:flex-initial px-6 py-3 bg-[#C5A880] text-white rounded-full font-label-caps text-xs font-semibold hover:bg-[#Bfa372] transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "PROCESSING..." : "APPROVE REQUEST"}
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("rejected")}
                  className="flex-1 md:flex-initial px-6 py-3 bg-red-50 border border-red-200 text-red-700 rounded-full font-label-caps text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  REJECT
                </button>
              </div>
            )}

            {enquiry.status === "approved" && enquiry.paymentStatus === "paid" && (
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("confirmed")}
                  className="flex-1 md:flex-initial px-6 py-3 bg-green-600 text-white rounded-full font-label-caps text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 animate-pulse shadow-md"
                >
                  {actionLoading ? "PROCESSING..." : "GET BOOKED"}
                </button>
              </div>
            )}

            {enquiry.status === "approved" && enquiry.paymentStatus === "unpaid" && (
              <div className="flex items-center gap-2 px-4 py-2 border border-yellow-200 bg-yellow-50 text-yellow-800 text-[10px] font-label-caps font-bold rounded-full">
                <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                Awaiting client payment
              </div>
            )}

            {enquiry.status === "confirmed" && (
              <div className="flex items-center gap-2 px-4 py-2 border border-green-200 bg-green-50 text-green-800 text-[10px] font-label-caps font-bold rounded-full shadow-sm">
                <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                FULLY BOOKED & CONFIRMED
              </div>
            )}
          </section>

          {/* Details sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary font-semibold border-b border-[#E8E2D9] pb-3">Event Specification</h3>
                <div className="grid grid-cols-2 gap-6 text-xs text-[#6B6B6B]">
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-1">Occasion</p>
                    <p className="font-semibold text-primary text-sm">{enquiry.eventType}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-1">Preferred Date</p>
                    <p className="font-semibold text-primary text-sm">{new Date(enquiry.preferredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-1">Expected Guests</p>
                    <p className="font-semibold text-primary text-sm">{enquiry.expectedGuests} Guests</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-1">Selected Package</p>
                    <p className="font-semibold text-primary text-sm text-capitalize">{enquiry.packageSelected}</p>
                  </div>
                </div>

                {enquiry.addOns && enquiry.addOns.length > 0 && (
                  <div className="border-t border-[#E8E2D9]/40 pt-4 text-xs text-[#6B6B6B]">
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-2">Options & Add-ons</p>
                    <div className="flex flex-wrap gap-2">
                      {enquiry.addOns.map((add, idx) => (
                        <span key={idx} className="bg-[#F8F5F0] border border-[#E8E2D9] text-[#1F1F1F] font-semibold px-3 py-1 rounded-full">
                          {add}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {enquiry.message && (
                  <div className="border-t border-[#E8E2D9]/40 pt-4 text-xs text-[#6B6B6B]">
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-2">Special Remarks</p>
                    <p className="italic bg-[#F8F5F0] border border-[#E8E2D9] p-4 rounded-2xl text-[#1F1F1F] leading-relaxed">
                      “{enquiry.message}”
                    </p>
                  </div>
                )}
              </section>

              <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm space-y-4">
                <h3 className="font-display text-lg text-primary font-semibold border-b border-[#E8E2D9] pb-3">Internal Curator Remarks</h3>
                <form onSubmit={handleSaveNote} className="space-y-4">
                  <textarea
                    rows={4}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Write private notes about this reservation request, or add rejection feedback reasoning..."
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] p-4 rounded-2xl text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-6 py-2.5 bg-[#1F1F1F] text-white rounded-full font-label-caps text-[10px] font-bold hover:bg-secondary transition-all tracking-wider disabled:opacity-50"
                  >
                    {savingNote ? "SAVING..." : "SAVE CURATOR NOTE"}
                  </button>
                </form>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary font-semibold border-b border-[#E8E2D9] pb-3">Client Specification</h3>
                <div className="space-y-4 text-xs text-[#6B6B6B]">
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">Name</p>
                    <p className="font-semibold text-primary">{getEnquiryName(enquiry)}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">Email Address</p>
                    <p className="font-semibold text-primary truncate">{getEnquiryEmail(enquiry)}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">Phone Number</p>
                    <p className="font-semibold text-primary">{getEnquiryPhone(enquiry)}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">User Account Type</p>
                    <p className="font-semibold text-primary">
                      {enquiry.userId ? (
                        <span className="text-secondary font-bold">Registered Member</span>
                      ) : (
                        <span>Guest Submitter</span>
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {enquiry.status === "approved" && (
                <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm space-y-6">
                  <h3 className="font-display text-lg text-primary font-semibold border-b border-[#E8E2D9] pb-3">Deposit Transaction</h3>
                  <div className="space-y-4 text-xs text-[#6B6B6B]">
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">Deposit Amount</p>
                      <p className="font-semibold text-primary font-display text-base">₹{enquiry.paymentAmount?.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold mb-0.5">Razorpay Order ID</p>
                      <p className="font-mono text-primary font-semibold text-[10px] break-all">{enquiry.paymentOrderId}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
