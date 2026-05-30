"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

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
  status: "pending" | "approved" | "rejected" | "confirmed";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [eventType, setEventType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        eventType,
        startDate,
        endDate,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/admin/enquiries?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data.enquiries);
        setTotalPages(json.data.pagination.pages);
        setPage(json.data.pagination.currentPage);

        // Calculate pending bookings count
        const pending = json.data.enquiries.filter((e: any) => e.status === "pending").length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, status, eventType, startDate, endDate, page]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected" | "confirmed") => {
    if (!confirm(`Are you sure you want to mark this enquiry as ${newStatus === "confirmed" ? "BOOKED" : newStatus}?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchEnquiries();
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
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

  return (
    <div className="flex h-screen bg-[#F8F5F0] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        bookingsCount={pendingCount}
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
            <h2 className="font-display font-semibold text-xl text-[#1F1F1F]">Enquiries</h2>
          </div>
          <span className="font-label-caps text-[10px] text-secondary font-bold tracking-widest bg-secondary/15 px-3 py-1 rounded-full">
            GM PORTAL ACTIVE
          </span>
        </header>

        <main className="p-6 md:p-12 max-w-7xl w-full mx-auto space-y-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-primary font-medium">Curation Enquiries List</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">Review guest configurations, approve slot dates, and process transaction order IDs.</p>
          </div>

          {/* Filters & Search panel */}
          <section className="bg-white p-6 rounded-[24px] border border-[#E8E2D9] shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-label-caps text-secondary font-bold uppercase mb-1.5">Search Client</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-label-caps text-secondary font-bold uppercase mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-label-caps text-secondary font-bold uppercase mb-1.5">Event Occasion</label>
                <select
                  value={eventType}
                  onChange={(e) => { setEventType(e.target.value); setPage(1); }}
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880]"
                >
                  <option value="All">All Occasions</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Social">Social</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 flex gap-2">
                <div className="flex-1">
                  <label className="block text-[9px] font-label-caps text-secondary font-bold uppercase mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-3 py-2 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] font-label-caps text-secondary font-bold uppercase mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-3 py-2 rounded-full text-xs text-primary focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Table list */}
          <section className="bg-white border border-[#E8E2D9] rounded-[32px] p-8 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D9] text-[#C5A880] font-label-caps font-bold text-[10px]">
                    <th className="pb-3 pr-4">Client Name</th>
                    <th className="pb-3 pr-4">Contact Info</th>
                    <th className="pb-3 pr-4">Occasion</th>
                    <th className="pb-3 pr-4">Package</th>
                    <th className="pb-3 pr-4">Guests</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]/40 text-[#1F1F1F]">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#6B6B6B] font-semibold animate-pulse">
                        Refreshing results...
                      </td>
                    </tr>
                  ) : enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#6B6B6B]">
                        No matching curation enquiries found.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-[#F8F5F0]/30 transition-colors">
                        <td className="py-4 font-semibold pr-4">{getEnquiryName(enq)}</td>
                        <td className="py-4 pr-4">
                          <p>{getEnquiryEmail(enq)}</p>
                          <p className="text-[10px] text-[#6B6B6B] mt-0.5">{getEnquiryPhone(enq)}</p>
                        </td>
                        <td className="py-4 font-medium pr-4">{enq.eventType}</td>
                        <td className="py-4 text-capitalize pr-4">{enq.packageSelected}</td>
                        <td className="py-4 pr-4">{enq.expectedGuests} Guests</td>
                        <td className="py-4 pr-4">{new Date(enq.preferredDate).toLocaleDateString()}</td>
                        <td className="py-4 pr-4">
                          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                            enq.status === "confirmed" ? "bg-primary text-white border-primary" :
                            enq.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                            enq.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                            enq.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}>
                            {enq.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-3 font-semibold whitespace-nowrap">
                          <Link
                            href={`/admin/enquiries/${enq._id}`}
                            className="text-[#C5A880] hover:underline"
                          >
                            Details
                          </Link>
                          {enq.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(enq._id, "approved")}
                                className="text-green-600 hover:text-green-800 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(enq._id, "rejected")}
                                className="text-red-500 hover:text-red-750 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {enq.status === "approved" && enq.paymentStatus === "paid" && (
                            <button
                              onClick={() => handleUpdateStatus(enq._id, "confirmed")}
                              className="text-green-600 hover:text-green-800 font-bold transition-colors animate-pulse"
                            >
                              Get Booked
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#E8E2D9]/60 pt-6 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-full text-xs font-semibold text-primary disabled:opacity-50 hover:bg-[#F8F5F0] transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-[#6B6B6B] font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-full text-xs font-semibold text-primary disabled:opacity-50 hover:bg-[#F8F5F0] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
