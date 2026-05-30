"use client";

import { Booking, Package } from "../types";

interface OverviewTabProps {
  adminName: string;
  bookings: Booking[];
  totalBookingsCount: number;
  pendingRequestsCount: number;
  approvedEventsCount: number;
  blockedDatesCount: number;
  setActiveTab: (tab: string) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  setIsNewBookingModalOpen: (open: boolean) => void;
  setIsPackageModalOpen: (open: boolean) => void;
  setEditingPackage: (pkg: Package | null) => void;
  onAddGalleryItem: () => void;
}

export default function OverviewTab({
  adminName,
  bookings,
  setActiveTab,
  setSelectedBooking,
  setIsDetailsDrawerOpen,
  setIsNewBookingModalOpen,
  setIsPackageModalOpen,
  setEditingPackage,
  onAddGalleryItem
}: OverviewTabProps) {
  const firstName = adminName ? adminName.split(" ")[0] : "Admin";

  // DYNAMIC CALCULATIONS FOR KPIs
  
  // 1. Total Bookings (all enquiries)
  const totalBookings = bookings.length;

  // 2. Pending Requests
  const pendingRequests = bookings.filter(b => b.status === "Pending").length;

  // 3. Approved Events
  const approvedEvents = bookings.filter(b => b.status === "Approved" || b.status === "Confirmed").length;

  // 4. Blocked Dates (unique dates of approved or confirmed bookings)
  const approvedOrConfirmedBookings = bookings.filter(b => b.status === "Approved" || b.status === "Confirmed");
  const uniqueBlockedDates = new Set(approvedOrConfirmedBookings.map(b => b.date));
  const blockedDatesCount = uniqueBlockedDates.size;

  // 5. Monthly Revenue (sum of paymentAmount for bookings marked paid in current month/year)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = bookings
    .filter(b => {
      const bDate = new Date(b.timestamp || b.date);
      return b.paymentStatus === "paid" && bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
    })
    .reduce((acc, b) => acc + (b.paymentAmount || 0), 0);

  // Formatting revenue beautifully
  const formattedRevenue = monthlyRevenue >= 100000
    ? `₹${(monthlyRevenue / 100000).toFixed(1)}L`
    : `₹${monthlyRevenue.toLocaleString("en-IN")}`;

  // 6. Occupancy Rate (percentage of days booked in current month)
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const bookedDaysInCurrentMonth = new Set(
    bookings
      .filter(b => {
        const bDate = new Date(b.date);
        return (b.status === "Approved" || b.status === "Confirmed") && 
               bDate.getMonth() === currentMonth && 
               bDate.getFullYear() === currentYear;
      })
      .map(b => new Date(b.date).getDate())
  );
  
  const occupancyRate = daysInCurrentMonth > 0
    ? Math.round((bookedDaysInCurrentMonth.size / daysInCurrentMonth) * 100)
    : 0;

  const handleQuickCreatePackage = () => {
    setEditingPackage({
      id: "pkg_" + Date.now(),
      name: "",
      tier: "",
      price: "",
      desc: "",
      capacity: "",
      services: [],
      image: "",
      featured: false
    });
    setIsPackageModalOpen(true);
  };

  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      <section className="mb-4">
        <h1 className="font-display text-4xl text-[#1F1F1F] font-semibold tracking-tight">Welcome Back, {firstName}</h1>
        <p className="text-sm text-[#6B6B6B] mt-1 font-medium">Manage bookings, event dates, custom packages and venue operations.</p>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        {/* Total Bookings */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A880]/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F8F5F0] flex items-center justify-center text-[#C5A880]">
              <span className="material-symbols-outlined text-xl">assignment</span>
            </div>
            <span className="text-[9px] text-[#C5A880] font-extrabold bg-[#F8F5F0] px-2.5 py-1 rounded-full uppercase tracking-wider">LIVE</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{totalBookings}</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Total Bookings</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <span className="material-symbols-outlined text-xl">pending_actions</span>
            </div>
            <span className="text-[9px] text-yellow-600 font-extrabold bg-yellow-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{pendingRequests}</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Pending Requests</p>
          </div>
        </div>

        {/* Approved Events */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <span className="text-[9px] text-green-600 font-extrabold bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Secure</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{approvedEvents}</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Approved Events</p>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <span className="material-symbols-outlined text-xl">lock</span>
            </div>
            <span className="text-[9px] text-red-600 font-extrabold bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Reserved</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{blockedDatesCount}</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Blocked Dates</p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Revenue</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{formattedRevenue}</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Monthly Revenue</p>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-[#FFFFFF] p-6 rounded-[28px] border border-[#E8E2D9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-xl">hotel_class</span>
            </div>
            <span className="text-[9px] text-blue-600 font-extrabold bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Occupancy</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1F1F1F] tracking-tight font-poppins">{occupancyRate}%</h3>
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mt-1">Occupancy Rate</p>
          </div>
        </div>

      </div>

      {/* Quick Actions Panel */}
      <div className="bg-[#FFFFFF] p-8 rounded-[28px] border border-[#E8E2D9] shadow-sm">
        <h4 className="font-display font-semibold text-lg text-[#1F1F1F] mb-6">Venue Administrator Shortcuts</h4>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setIsNewBookingModalOpen(true)} className="flex items-center gap-3 bg-[#1F1F1F] text-white px-6 py-3.5 rounded-full text-xs font-semibold hover:bg-black transition-all shadow-md shadow-black/10 hover:shadow-lg">
            <span className="material-symbols-outlined text-sm">add</span> Add New Booking
          </button>
          <button onClick={() => setActiveTab("calendar")} className="flex items-center gap-3 bg-[#F3EEE7] text-[#1F1F1F] border border-[#E8E2D9] px-6 py-3.5 rounded-full text-xs font-semibold hover:bg-[#E8E2D9] transition-all">
            <span className="material-symbols-outlined text-sm">block</span> Configure Blackout Dates
          </button>
          <button onClick={handleQuickCreatePackage} className="flex items-center gap-3 bg-[#F3EEE7] text-[#1F1F1F] border border-[#E8E2D9] px-6 py-3.5 rounded-full text-xs font-semibold hover:bg-[#E8E2D9] transition-all">
            <span className="material-symbols-outlined text-sm">category</span> Create Luxury Package
          </button>
          <button onClick={onAddGalleryItem} className="flex items-center gap-3 bg-[#F3EEE7] text-[#1F1F1F] border border-[#E8E2D9] px-6 py-3.5 rounded-full text-xs font-semibold hover:bg-[#E8E2D9] transition-all">
            <span className="material-symbols-outlined text-sm">collections</span> Manage Gallery Media
          </button>
          <button onClick={() => setActiveTab("cms")} className="flex items-center gap-3 bg-[#F3EEE7] text-[#1F1F1F] border border-[#E8E2D9] px-6 py-3.5 rounded-full text-xs font-semibold hover:bg-[#E8E2D9] transition-all">
            <span className="material-symbols-outlined text-sm">web</span> Update CMS Contents
          </button>
        </div>
      </div>

      {/* Main Insights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Events list */}
        <div className="bg-[#FFFFFF] p-8 rounded-[28px] border border-[#E8E2D9] shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-semibold text-lg text-[#1F1F1F]">Upcoming Curations</h4>
            <button onClick={() => setActiveTab("bookings")} className="text-xs text-[#C5A880] font-bold hover:underline">
              VIEW ALL BOOKINGS
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {bookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <span className="material-symbols-outlined text-4xl text-[#C5A880]/40 mb-3">calendar_today</span>
                <p className="text-xs text-[#6B6B6B] font-medium">No bookings in the system yet.</p>
              </div>
            ) : (
              bookings.slice(0, 4).map((book) => (
                <div key={book.id} className="p-4 rounded-[20px] bg-[#F8F5F0] border border-[#E8E2D9]/60 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="min-w-0">
                    <p className="font-poppins font-bold text-[#1F1F1F] text-sm truncate">{book.name}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{book.space} • {book.occasion}</p>
                    <p className="text-[10px] text-[#C5A880] font-bold tracking-wider mt-1">{book.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold inline-block border ${
                      book.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                      book.status === "Confirmed" ? "bg-primary text-white border-primary" :
                      book.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {book.status === "Confirmed" ? "Booked" : book.status}
                    </span>
                    <button
                      onClick={() => { setSelectedBooking(book); setIsDetailsDrawerOpen(true); }}
                      className="block text-[10px] text-[#C5A880] font-bold uppercase tracking-wider hover:underline mt-2 ml-auto"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-[#FFFFFF] p-8 rounded-[28px] border border-[#E8E2D9] shadow-sm flex flex-col h-[500px]">
          <h4 className="font-display font-semibold text-lg text-[#1F1F1F] mb-6">Recent Curator Activity</h4>
          <div className="space-y-6 overflow-y-auto flex-1 pr-1 font-poppins">
            
            {bookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <span className="material-symbols-outlined text-4xl text-[#C5A880]/40 mb-3">timeline</span>
                <p className="text-xs text-[#6B6B6B] font-medium">Activity timeline will populate as enquiries are received.</p>
              </div>
            ) : (
              bookings.slice(0, 5).map((book, idx) => {
                let icon = "mail";
                let colorClass = "bg-yellow-50 border-yellow-200 text-yellow-700";
                let desc = "";

                if (book.status === "Approved") {
                  icon = "check_circle";
                  colorClass = "bg-green-50 border-green-200 text-green-700";
                  desc = `Booking request from ${book.name} has been approved.`;
                } else if (book.status === "Confirmed") {
                  icon = "verified";
                  colorClass = "bg-emerald-50 border-emerald-200 text-emerald-700";
                  desc = `Slot confirmed and payment verified for ${book.name}'s event.`;
                } else if (book.status === "Rejected") {
                  icon = "block";
                  colorClass = "bg-red-50 border-red-200 text-red-700";
                  desc = `Enquiry from ${book.name} rejected by administrator.`;
                } else {
                  icon = "mail";
                  colorClass = "bg-yellow-50 border-yellow-200 text-yellow-700";
                  desc = `New pending enquiry submitted by ${book.name} for ${book.occasion}.`;
                }

                return (
                  <div key={`act-${idx}`} className="flex gap-4">
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${colorClass}`}>
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#1F1F1F] font-bold">
                        {book.status === "Confirmed" ? "Payment Completed" : `Enquiry ${book.status}`}
                      </p>
                      <p className="text-[11px] text-[#6B6B6B] mt-0.5">{desc}</p>
                      <span className="text-[9px] text-[#6B6B6B]/80 block mt-1">
                        {book.timestamp ? new Date(book.timestamp).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
