"use client";

import { Booking } from "../types";

interface BookingsTabProps {
  bookings: Booking[];
  searchQuery: string;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  spaceFilter: string;
  setSpaceFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  setIsNewBookingModalOpen: (open: boolean) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  handleUpdateBookingStatus: (id: string, status: Booking["status"]) => void;
  handleDeleteBooking: (id: string) => void;
}

export default function BookingsTab({
  bookings,
  searchQuery,
  statusFilter,
  setStatusFilter,
  spaceFilter,
  setSpaceFilter,
  sortBy,
  setSortBy,
  setIsNewBookingModalOpen,
  setSelectedBooking,
  setIsDetailsDrawerOpen,
  handleUpdateBookingStatus,
  handleDeleteBooking
}: BookingsTabProps) {

  // Filter and Search Bookings list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.space.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.occasion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesSpace = spaceFilter === "All" || b.space === spaceFilter;
    return matchesSearch && matchesStatus && matchesSpace;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    if (sortBy === "guests-desc") return parseInt(b.guests) - parseInt(a.guests);
    return 0;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Bookings & Reservations</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Review inquiries, configure status pipelines, and coordinate client details.</p>
        </div>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="bg-[#C5A880] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#Bfa372] transition-colors self-start sm:self-auto"
        >
          Create Booking
        </button>
      </section>

      {/* Filters panel */}
      <div className="bg-[#FFFFFF] p-6 rounded-[24px] border border-[#E8E2D9] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          
          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F5F0] border border-[#E8E2D9] text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Space Filter */}
          <select 
            value={spaceFilter}
            onChange={(e) => setSpaceFilter(e.target.value)}
            className="bg-[#F8F5F0] border border-[#E8E2D9] text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          >
            <option value="All">All Settings</option>
            <option value="The Crystal Ballroom">Crystal Ballroom</option>
            <option value="The Terrace Gardens">Terrace Gardens</option>
            <option value="Private Lounges">Private Lounges</option>
          </select>

          {/* Sort Filter */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F8F5F0] border border-[#E8E2D9] text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="guests-desc">Largest Guest Count</option>
          </select>

        </div>

        <div className="text-xs text-[#6B6B6B] shrink-0 font-semibold uppercase tracking-wider font-poppins">
          FOUND {filteredBookings.length} EVENT REQUESTS
        </div>
      </div>

      {/* Bookings Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.map((book) => (
          <div 
            key={book.id}
            className="bg-white rounded-[24px] border border-[#E8E2D9] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                  book.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                  book.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  book.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-gray-50 text-gray-700 border-gray-200"
                }`}>
                  {book.status}
                </span>
                <h3 className="font-display font-semibold text-lg text-[#1F1F1F] mt-3">
                  {book.name}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{book.email}</p>
              </div>
              <span className="font-poppins font-bold text-sm text-[#C5A880] bg-[#F8F5F0] border border-[#E8E2D9]/60 px-3 py-1 rounded-full shrink-0">
                {book.interest || "New"} Interest
              </span>
            </div>

            <div className="border-t border-b border-[#E8E2D9]/60 py-4 my-4 space-y-2.5 text-xs text-[#6B6B6B]">
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Event Setting</span>
                <span className="text-[#1F1F1F] font-bold text-right truncate max-w-[180px]">{book.space}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Occasion</span>
                <span className="text-[#1F1F1F] font-bold text-right truncate max-w-[180px]">{book.occasion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Selected Date</span>
                <span className="text-[#1F1F1F] font-bold text-right">{book.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Time / Guests</span>
                <span className="text-[#1F1F1F] font-bold text-right">{book.slot || "Morning Slot"} • {book.guests} Guests</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-2">
              <button 
                onClick={() => { setSelectedBooking(book); setIsDetailsDrawerOpen(true); }}
                className="text-xs text-[#6B6B6B] font-bold hover:text-[#1F1F1F] transition-colors border border-[#E8E2D9] px-4 py-2.5 rounded-full"
              >
                View Info Details
              </button>
              <div className="flex gap-2">
                {book.status === "Pending" && (
                  <>
                    <button 
                      onClick={() => handleUpdateBookingStatus(book.id, "Approved")}
                      className="w-9 h-9 rounded-full bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center justify-center transition-colors"
                      title="Approve Booking"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                    <button 
                      onClick={() => handleUpdateBookingStatus(book.id, "Rejected")}
                      className="w-9 h-9 rounded-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors"
                      title="Reject Booking"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleDeleteBooking(book.id)}
                  className="w-9 h-9 rounded-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors"
                  title="Delete Booking"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
