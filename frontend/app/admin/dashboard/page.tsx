"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Booking, Package, Testimonial, GalleryItem } from "../types";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Import modular tabs
import OverviewTab from "../components/OverviewTab";
import BookingsTab from "../components/BookingsTab";
import CalendarTab from "../components/CalendarTab";
import PackagesTab from "../components/PackagesTab";
import GalleryTab from "../components/GalleryTab";
import TestimonialsTab from "../components/TestimonialsTab";
import CmsTab from "../components/CmsTab";
import InquiriesTab from "../components/InquiriesTab";
import AnalyticsTab from "../components/AnalyticsTab";
import SettingsTab from "../components/SettingsTab";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [spaceFilter, setSpaceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [adminName, setAdminName] = useState("Arjun Mehta");
  const [adminEmail, setAdminEmail] = useState("curator@thegrandlounge.com");
  const [adminPhone, setAdminPhone] = useState("+91 11 4999 9999");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Toast notifications state for real-time enquiries
  interface ToastNotification {
    id: string;
    booking: Booking;
  }
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const seenBookingIds = useRef<Set<string>>(new Set());
  const isInitialLoaded = useRef(false);

  // Core databases (Enquiry bookings synced with backend MONGODB)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: "1", text: "New inquiry from Julianne Moore for Crystal Ballroom", read: false, time: "5 mins ago" },
    { id: "2", text: "Kapoor Wedding updated date to Oct 20", read: false, time: "2 hrs ago" },
    { id: "3", text: "Server backup successfully completed", read: true, time: "1 day ago" },
  ]);

  // Create/Edit Modals state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  // New booking form fields
  const [newBName, setNewBName] = useState("");
  const [newBEmail, setNewBEmail] = useState("");
  const [newBPhone, setNewBPhone] = useState("");
  const [newBPackageId, setNewBPackageId] = useState("basic");
  const [newBOccasion, setNewBOccasion] = useState("Wedding Celebration");
  const [newBDate, setNewBDate] = useState("October 25, 2024");
  const [newBGuests, setNewBGuests] = useState("50 - 100");
  const [newBSlot, setNewBSlot] = useState("Evening Slot");
  const [newBNotes, setNewBNotes] = useState("");

  // Packages Database
  const [packages, setPackages] = useState<Package[]>([
    {
      id: "basic",
      tier: "Basic",
      name: "Basic Package",
      price: "₹3,999 / Person",
      desc: "Perfect for intimate gatherings with all essentials covered — great food, fun activities, and a refreshing pool experience.",
      capacity: "Min 20 Guests",
      services: [
        "Welcome Drink",
        "Unlimited Veg + Non-Veg Buffet Lunch/Dinner",
        "Swimming Pool Access",
        "Rain Dance Access",
        "Indoor & Outdoor Games",
        "Kids Play Area & Parking"
      ],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
      featured: false
    },
    {
      id: "standard",
      tier: "Standard",
      name: "Standard Package",
      price: "₹7,499 / Person",
      desc: "A full-day experience with premium amenities, adventure activities, entertainment, and a dedicated event coordinator.",
      capacity: "Min 20 Guests",
      services: [
        "Everything in Basic +",
        "Premium Welcome Mocktails",
        "Breakfast + Lunch + Evening Snacks + Dinner",
        "Gaming Zone (PS5, VR)",
        "DJ & Dedicated Coordinator"
      ],
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
      featured: true
    },
    {
      id: "premium",
      tier: "Premium",
      name: "Premium Package",
      price: "₹14,999 / Person",
      desc: "The ultimate luxury experience with private pools, live entertainment, professional photography, and celebrity-style entry.",
      capacity: "Min 20 Guests",
      services: [
        "Everything in Standard +",
        "Luxury Suite & Cabana Seating",
        "Live Food Counters & Water Sports",
        "Celebrity Entry & Live DJ Setup",
        "Pro Photographer & Drone Coverage"
      ],
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600",
      featured: true
    },
    {
      id: "royal-elite",
      tier: "Royal Elite",
      name: "Royal Elite Package",
      price: "₹24,999 / Person",
      desc: "The most exclusive, all-inclusive experience — your own private resort zone with butler service, luxury suites, spa, and fireworks.",
      capacity: "Min 50 Guests",
      services: [
        "Everything in Premium +",
        "Private Resort Zone Booking",
        "Butler Service & Imported Beverages*",
        "Jacuzzi, Spa & Private Bar",
        "Fireworks & Live Band Setup"
      ],
      image: "https://images.unsplash.com/photo-1519225495810-7517c24a259c?auto=format&fit=crop&q=80&w=600",
      featured: false
    }
  ]);

  // Gallery database
  const [gallery, setGallery] = useState<GalleryItem[]>([
    { id: "g1", title: "Majestic Chandelier", album: "weddings", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", featured: true },
    { id: "g2", title: "Verdana Sunset Setup", album: "all", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600", featured: true },
    { id: "g3", title: "Cigar Lounge Suite", album: "nightlife", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600", featured: false }
  ]);
  const [selectedAlbum, setSelectedAlbum] = useState("all");

  // Testimonials database
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: "t1", name: "Ananya Sen", rating: 5, text: "The white-glove curation by General Manager Arjun Mehta exceeded all family expectations. Our wedding was legendary.", occasion: "Wedding Celebration", status: "Featured" },
    { id: "t2", name: "Vikram Malhotra", rating: 5, text: "A truly column-less space that made our luxury automobile product launch look futuristic. Excellent AV setup.", occasion: "Corporate Gala", status: "Approved" },
    { id: "t3", name: "Rishabh Malhotra", rating: 4, text: "Perfect sunset cocktails. The terrace gardens have the best landscaping layouts in New Delhi.", occasion: "Private Soirée", status: "Pending" }
  ]);

  // CMS dynamic configuration
  const [cmsHeroTitle, setCmsHeroTitle] = useState("The Art of Celebration");
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState("A sanctuary of refined elegance where heritage meets contemporary luxury in the heart of Delhi.");
  const [cmsPhone, setCmsPhone] = useState("+91 11 4999 9999");
  const [cmsEmail, setCmsEmail] = useState("curator@thegrandlounge.com");
  const [cmsMarqueeText, setCmsMarqueeText] = useState("Infinity Pool • Luxury Suites • Fine Dining • Premium Bar • Gaming Zone • Spa • Adventure Activities • DJ Nights • Destination Weddings • Corporate Events • 500+ Guest Capacity — Everything Under One Roof.");
  const [cmsGalleryQueries, setCmsGalleryQueries] = useState<Record<string, string>>({
    all: "luxury resort pool garden",
    weddings: "luxury wedding stage decoration",
    accommodation: "luxury hotel suite villa",
    dining: "gourmet food fine dining",
    pools: "luxury resort swimming pool spa",
    gaming: "bowling alley arcade sport",
    nightlife: "cocktail bar club party",
    corporate: "conference business meeting gala",
  });

  // Inquiries Conversation Inbox state
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>("enq_static1");
  const [chatReplies, setChatReplies] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    enq_static1: [
      { sender: "client", text: "Hello, we are looking to book the Crystal Ballroom for an art auction.", time: "2 hours ago" },
      { sender: "admin", text: "Welcome! We would be delighted to host Sotheby's. Do you have specific lighting setup configurations in mind?", time: "1 hour ago" },
    ],
    enq_static2: [
      { sender: "client", text: "Hi, can you provide florist referrals for our wedding setup on Oct 20?", time: "5 hours ago" }
    ]
  });

  // Availability calendar state
  const [blockedDates, setBlockedDates] = useState<Record<string, "Booked" | "Blocked" | "Maintenance">>({
    "3": "Booked",
    "7": "Booked",
    "12": "Booked",
    "15": "Blocked",
    "16": "Booked",
    "20": "Booked",
    "22": "Blocked",
    "25": "Maintenance",
    "28": "Booked"
  });

  // Fetch real-time inquiries from Express backend database
  const fetchLiveBookings = async () => {
    try {
      const res = await fetch("/api/admin/enquiries?limit=200");
      const json = await res.json();
      if (json.success && json.data.enquiries) {
        const mapped: Booking[] = json.data.enquiries.map((enq: any) => {
          const pSelected = enq.packageSelected || "basic";
          
          let pricePerPerson = 3999;
          if (pSelected === "standard") pricePerPerson = 7499;
          else if (pSelected === "premium") pricePerPerson = 14999;
          else if (pSelected === "royal-elite") pricePerPerson = 24999;

          const isFullDay = enq.addOns && enq.addOns.includes("Full Day");
          if (isFullDay) {
            pricePerPerson += 699;
          }

          const guestsCount = Number(enq.expectedGuests) || 20;
          const subtotal = pricePerPerson * guestsCount;

          let discountPct = 0;
          if (guestsCount >= 350) discountPct = 20;
          else if (guestsCount >= 200) discountPct = 15;
          else if (guestsCount >= 100) discountPct = 10;
          else if (guestsCount >= 50) discountPct = 5;

          const discountAmount = Math.round(subtotal * (discountPct / 100));
          const estimatedBill = subtotal - discountAmount;

          const packageNames: Record<string, string> = {
            basic: "Basic Package",
            standard: "Standard Package",
            premium: "Premium Package",
            "royal-elite": "Royal Elite Package",
          };
          const spaceLabel = packageNames[pSelected] || "Basic Package";
          const rateLabel = `₹${pricePerPerson.toLocaleString("en-IN")} / Person`;

          let interestLabel = "Medium";
          if (pSelected === "premium" || pSelected === "royal-elite") interestLabel = "High";
          else if (pSelected === "basic") interestLabel = "Low";

          const dateStr = new Date(enq.preferredDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          });

          return {
            id: enq._id,
            name: enq.userId ? enq.userId.name : enq.guestName || "Guest User",
            email: enq.userId ? enq.userId.email : enq.guestEmail || "",
            phone: enq.userId ? enq.userId.phone : enq.guestPhone || "",
            space: spaceLabel,
            occasion: enq.eventType,
            guests: guestsCount.toString(),
            date: dateStr,
            slot: enq.addOns.includes("Evening Slot") ? "Evening Slot" : enq.addOns.includes("Full Day") ? "Full Day" : "Morning Slot",
            rate: rateLabel,
            notes: enq.message || "",
            status: enq.status.charAt(0).toUpperCase() + enq.status.slice(1),
            interest: interestLabel,
            timestamp: enq.createdAt,
            step: enq.status === "approved" ? (enq.paymentStatus === "paid" ? 5 : 4) : (enq.status === "rejected" ? 0 : 2),
            paymentStatus: enq.paymentStatus || "unpaid",
            packageSelected: pSelected,
            estimatedBill: estimatedBill,
            paymentAmount: enq.paymentAmount || estimatedBill,
          };
        });

        // Detect new enquiries if initial fetch is already done
        if (isInitialLoaded.current) {
          const newPendingEnquiries = mapped.filter(
            (b) => b.status === "Pending" && !seenBookingIds.current.has(b.id)
          );
          if (newPendingEnquiries.length > 0) {
            newPendingEnquiries.forEach((b) => {
              setToasts((prev) => [
                ...prev,
                { id: `toast-${b.id}-${Date.now()}`, booking: b },
              ]);
            });
          }
        } else {
          isInitialLoaded.current = true;
        }

        // Add all fetched IDs to seen set
        mapped.forEach((b) => seenBookingIds.current.add(b.id));

        setBookings(mapped);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveBookings();
    const interval = setInterval(() => {
      fetchLiveBookings();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedTitle = localStorage.getItem("cms_hero_title");
    if (storedTitle) setCmsHeroTitle(storedTitle);
    
    const storedSubtitle = localStorage.getItem("cms_hero_subtitle");
    if (storedSubtitle) setCmsHeroSubtitle(storedSubtitle);

    const storedPhone = localStorage.getItem("cms_phone");
    if (storedPhone) setCmsPhone(storedPhone);

    const storedEmail = localStorage.getItem("cms_email");
    if (storedEmail) setCmsEmail(storedEmail);

    const storedMarquee = localStorage.getItem("cms_marquee_text");
    if (storedMarquee) setCmsMarqueeText(storedMarquee);

    const storedQueries = localStorage.getItem("cms_gallery_queries");
    if (storedQueries) {
      try {
        setCmsGalleryQueries(JSON.parse(storedQueries));
      } catch (err) {
        console.error("Failed to parse stored gallery queries:", err);
      }
    }
  }, []);

  // API update status
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const dbStatus = newStatus.toLowerCase();
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: dbStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus as any });
        }
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Mock delete
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setBookings(bookings.filter(b => b.id !== id));
    setIsDetailsDrawerOpen(false);
  };

  // Handle Quick Create Booking via API
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let mappedEventType = "Custom";
      if (newBOccasion === "Wedding Celebration") mappedEventType = "Wedding";
      else if (newBOccasion === "Corporate Gala") mappedEventType = "Corporate";
      else if (newBOccasion === "Private Soirée") mappedEventType = "Social";

      let mappedPackage = newBPackageId;

      let expectedCount = 50;
      if (newBGuests === "0 - 30") expectedCount = 30;
      else if (newBGuests === "30 - 50") expectedCount = 50;
      else if (newBGuests === "50 - 100") expectedCount = 100;
      else if (newBGuests === "100 - 300") expectedCount = 300;
      else expectedCount = 500;

      const parsedDate = new Date(newBDate);
      const dateStr = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

      const payload = {
        eventType: mappedEventType,
        packageSelected: mappedPackage,
        expectedGuests: expectedCount,
        preferredDate: dateStr,
        message: newBNotes,
        addOns: [newBSlot],
        guestName: newBName,
        guestEmail: newBEmail,
        guestPhone: newBPhone,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        await fetchLiveBookings();
        setIsNewBookingModalOpen(false);
        // Clear fields
        setNewBName("");
        setNewBEmail("");
        setNewBPhone("");
        setNewBNotes("");
      } else {
        alert(data.error || "Failed to create booking.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: "g" + (gallery.length + 1),
      title: "New Curation Media",
      album: "Ballroom",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
      featured: false
    };
    setGallery([newItem, ...gallery]);
  };

  const handleOpenEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const setActiveTab = (tab: string) => {
    router.push(`/admin/dashboard?tab=${tab}`);
  };

  // Counts for sidebar badges
  const pendingCount = bookings.filter(b => b.status === "Pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold animate-pulse">LOADING CURATOR DATABASE...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F5F0] overflow-hidden">
      
      {/* Dynamic Sidebar */}
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        bookingsCount={pendingCount}
        adminName={adminName}
      />

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Dynamic Topbar */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setActiveTab={setActiveTab}
          setIsNewBookingModalOpen={setIsNewBookingModalOpen}
          setIsPackageModalOpen={setIsPackageModalOpen}
          setEditingPackage={setEditingPackage}
          onAddGalleryItem={handleAddGalleryItem}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Tab View Switcher */}
        <main className="p-6 md:p-12 max-w-7xl w-full mx-auto pb-24">
          {activeTab === "overview" && (
            <OverviewTab
              adminName={adminName}
              bookings={bookings}
              totalBookingsCount={bookings.length}
              pendingRequestsCount={pendingCount}
              approvedEventsCount={bookings.filter(b => b.status === "Approved").length}
              blockedDatesCount={Object.keys(blockedDates).length}
              setActiveTab={setActiveTab}
              setSelectedBooking={setSelectedBooking}
              setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
              setIsNewBookingModalOpen={setIsNewBookingModalOpen}
              setIsPackageModalOpen={setIsPackageModalOpen}
              setEditingPackage={setEditingPackage}
              onAddGalleryItem={handleAddGalleryItem}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsTab
              bookings={bookings}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              spaceFilter={spaceFilter}
              setSpaceFilter={setSpaceFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setIsNewBookingModalOpen={setIsNewBookingModalOpen}
              setSelectedBooking={setSelectedBooking}
              setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
              handleUpdateBookingStatus={handleUpdateBookingStatus}
              handleDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarTab
              bookings={bookings}
              setSelectedCalendarDay={setSelectedCalendarDay}
            />
          )}

          {activeTab === "packages" && (
            <PackagesTab
              packages={packages}
              setPackages={setPackages}
              handleOpenEditPackage={handleOpenEditPackage}
              setIsPackageModalOpen={setIsPackageModalOpen}
              setEditingPackage={setEditingPackage}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryTab
              gallery={gallery}
              setGallery={setGallery}
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}
              onAddGalleryItem={handleAddGalleryItem}
              cmsGalleryQueries={cmsGalleryQueries}
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              setTestimonials={setTestimonials}
            />
          )}

          {activeTab === "cms" && (
            <CmsTab
              cmsHeroTitle={cmsHeroTitle}
              setCmsHeroTitle={setCmsHeroTitle}
              cmsHeroSubtitle={cmsHeroSubtitle}
              setCmsHeroSubtitle={setCmsHeroSubtitle}
              cmsPhone={cmsPhone}
              setCmsPhone={setCmsPhone}
              cmsEmail={cmsEmail}
              setCmsEmail={setCmsEmail}
              cmsMarqueeText={cmsMarqueeText}
              setCmsMarqueeText={setCmsMarqueeText}
              cmsGalleryQueries={cmsGalleryQueries}
              setCmsGalleryQueries={setCmsGalleryQueries}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesTab
              bookings={bookings}
              selectedInquiryId={selectedInquiryId}
              setSelectedInquiryId={setSelectedInquiryId}
              handleUpdateBookingStatus={handleUpdateBookingStatus}
              handleDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              adminName={adminName}
              setAdminName={setAdminName}
              adminEmail={adminEmail}
              setAdminEmail={setAdminEmail}
              adminPhone={adminPhone}
              setAdminPhone={setAdminPhone}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}

      {/* 1. Client Booking Details Drawer */}
      {isDetailsDrawerOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity" onClick={() => setIsDetailsDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#E8E2D9] shadow-2xl p-8 flex flex-col h-full justify-between">
              
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-[#E8E2D9] pb-4 mb-6">
                <div>
                  <h3 className="font-display font-semibold text-xl text-[#1F1F1F]">Enquiry Details</h3>
                  <p className="text-[10px] text-[#6B6B6B] mt-0.5 uppercase tracking-widest font-bold">ID: {selectedBooking.id}</p>
                </div>
                <button onClick={() => setIsDetailsDrawerOpen(false)} className="w-8 h-8 rounded-full bg-[#F8F5F0] flex items-center justify-center hover:bg-[#F3EEE7]">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Drawer Scroll Body */}
              <div className="flex-1 overflow-y-auto space-y-6 text-xs text-[#6B6B6B] pr-1">
                <div>
                  <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-1">Status</p>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border inline-block ${
                    selectedBooking.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                    selectedBooking.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Client Name</p>
                    <p className="font-semibold text-[#1F1F1F] text-sm">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Phone Number</p>
                    <p className="font-semibold text-[#1F1F1F]">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Email Address</p>
                  <p className="font-semibold text-[#1F1F1F]">{selectedBooking.email}</p>
                </div>

                <div className="border-t border-[#E8E2D9]/60 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Event Space</p>
                    <p className="font-semibold text-[#1F1F1F]">{selectedBooking.space}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Occasion</p>
                    <p className="font-semibold text-[#1F1F1F]">{selectedBooking.occasion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Preferred Date</p>
                    <p className="font-semibold text-[#1F1F1F]">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-0.5">Guests / Time Slot</p>
                    <p className="font-semibold text-[#1F1F1F]">{selectedBooking.guests} Guests ({selectedBooking.slot})</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="border-t border-[#E8E2D9]/60 pt-4">
                    <p className="font-label-caps text-[9px] text-[#C5A880] font-bold uppercase mb-1.5">Special Requests</p>
                    <p className="p-3 bg-[#F8F5F0] border border-[#E8E2D9] rounded-xl italic leading-relaxed text-[#1F1F1F]">
                      “{selectedBooking.notes}”
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-[#E8E2D9] pt-4 mt-6 flex gap-3">
                {selectedBooking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, "Approved")}
                      className="flex-1 py-3 bg-[#C5A880] text-white rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-[#Bfa372] transition-colors"
                    >
                      Approve Booking
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, "Rejected")}
                      className="flex-1 py-3 bg-red-50 border border-red-200 text-red-700 rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-red-100 transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                {selectedBooking.status !== "Pending" && (
                  <button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="w-full py-3 bg-red-50 border border-red-200 text-red-700 rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-red-100 transition-colors"
                  >
                    Delete Reservation
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. Create New Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-6 font-poppins">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsNewBookingModalOpen(false)} />
          <div className="relative bg-white border border-[#E8E2D9] rounded-[32px] w-full max-w-lg p-8 shadow-2xl z-10">
            
            <div className="flex justify-between items-center mb-6 border-b border-[#E8E2D9] pb-4">
              <h3 className="font-display font-semibold text-xl text-[#1F1F1F]">Initiate Client Reservation</h3>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="w-8 h-8 rounded-full bg-[#F8F5F0] flex items-center justify-center hover:bg-[#F3EEE7]">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Client Name</label>
                  <input
                    type="text"
                    value={newBName}
                    onChange={(e) => setNewBName(e.target.value)}
                    placeholder="Julianne Moore"
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={newBPhone}
                    onChange={(e) => setNewBPhone(e.target.value)}
                    placeholder="10 digit number"
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  value={newBEmail}
                  onChange={(e) => setNewBEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Selected Package</label>
                  <select
                    value={newBPackageId}
                    onChange={(e) => setNewBPackageId(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                  >
                    <option value="basic">Basic Package (₹3,999/person)</option>
                    <option value="standard">Standard Package (₹7,499/person)</option>
                    <option value="premium">Premium Package (₹14,999/person)</option>
                    <option value="royal-elite">Royal Elite Package (₹24,999/person)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Event Occasion</label>
                  <select
                    value={newBOccasion}
                    onChange={(e) => setNewBOccasion(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                  >
                    <option value="Wedding Celebration">Wedding Celebration</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Private Soirée">Private Soirée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Preferred Date</label>
                  <input
                    type="text"
                    value={newBDate}
                    onChange={(e) => setNewBDate(e.target.value)}
                    placeholder="E.g., October 12, 2024"
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Guests Range</label>
                  <select
                    value={newBGuests}
                    onChange={(e) => setNewBGuests(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                  >
                    <option value="0 - 30">0 - 30</option>
                    <option value="30 - 50">30 - 50</option>
                    <option value="50 - 100">50 - 100</option>
                    <option value="100 - 300">100 - 300</option>
                    <option value="300+">300+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Time Slot</label>
                <select
                  value={newBSlot}
                  onChange={(e) => setNewBSlot(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#C5A880]"
                >
                  <option value="Morning Slot">Morning Slot (09:00 AM - 03:00 PM)</option>
                  <option value="Evening Slot">Evening Slot (05:00 PM - 11:00 PM)</option>
                  <option value="Full Day">Full Day (09:00 AM - 11:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-label-caps text-[#C5A880] font-bold mb-1.5 uppercase">Curator Special Notes</label>
                <textarea
                  rows={3}
                  value={newBNotes}
                  onChange={(e) => setNewBNotes(e.target.value)}
                  placeholder="Special requests or internal reminders..."
                  className="w-full bg-[#F8F5F0] border border-[#E8E2D9] p-3 rounded-2xl outline-none focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#1F1F1F] text-white rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-black transition-colors"
              >
                Create Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#1F1F1F] text-white border border-[#C5A880]/30 p-5 rounded-[20px] shadow-2xl flex flex-col gap-3 animate-slide-in relative overflow-hidden"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Visual Micro-animation Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A880] animate-pulse" />
            
            <div className="flex justify-between items-start pl-2">
              <div>
                <span className="font-label-caps text-[9px] text-[#C5A880] font-extrabold uppercase tracking-widest block">
                  NEW ENQUIRY RECEIVED
                </span>
                <h4 className="font-display font-semibold text-sm text-white mt-1">
                  {toast.booking.name}
                </h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                  Requested {toast.booking.occasion} for {toast.booking.date}
                </p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-[#A3A3A3] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex gap-2 justify-end pl-2">
              <button
                onClick={() => {
                  setSelectedBooking(toast.booking);
                  setIsDetailsDrawerOpen(true);
                  // Dismiss toast
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
                className="px-4 py-2 bg-[#C5A880] text-white text-[10px] font-label-caps font-bold tracking-wider rounded-full hover:bg-[#Bfa372] transition-colors"
              >
                VIEW DETAILS
              </button>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="px-4 py-2 bg-[#2D2D2D] text-[#A3A3A3] text-[10px] font-label-caps font-bold tracking-wider rounded-full hover:bg-[#3D3D3D] transition-colors"
              >
                DISMISS
              </button>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold animate-pulse">PREPARING PORTAL...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
