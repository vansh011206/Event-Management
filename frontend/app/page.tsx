"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState("");
  const [isHeroCardExpanded, setIsHeroCardExpanded] = useState(false);

  const [isOccasionOpen, setIsOccasionOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const [confirmedBookings, setConfirmedBookings] = useState<{ preferredDate: string; eventType: string; addOns?: string[] }[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<"unchecked" | "checking" | "available" | "unavailable">("unchecked");

  useEffect(() => {
    async function fetchConfirmed() {
      try {
        const res = await fetch("/api/enquiries/confirmed");
        const json = await res.json();
        if (json.success) {
          setConfirmedBookings(json.data);
        }
      } catch (err) {
        console.error("Error fetching confirmed bookings:", err);
      }
    }
    fetchConfirmed();
  }, []);

  const occasionsExtended = [
    { name: "Wedding Celebration", desc: "Grand matrimonial events" },
    { name: "Corporate Gala", desc: "Executive business banquets" },
    { name: "Reception & Cocktails", desc: "Elegant evening soirées" },
    { name: "Birthday & Anniversary", desc: "Intimate landmark milestones" },
    { name: "Private Soirée", desc: "Bespoke VIP gatherings" },
  ];

  const timeSlotsExtended = [
    { name: "Morning Slot", desc: "09:00 AM - 03:00 PM" },
    { name: "Evening Slot", desc: "05:00 PM - 11:00 PM" },
    { name: "Full Day", desc: "09:00 AM - 11:00 PM" },
  ];

  const guestRangesExtended = [
    { range: "0 - 30", desc: "Intimate Salon" },
    { range: "30 - 50", desc: "Classic Gathering" },
    { range: "50 - 100", desc: "Grand Banquet" },
    { range: "100 - 300", desc: "Majestic Ballroom" },
    { range: "300+", desc: "Imperial Gala" },
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday start offset
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

  const checkAvailability = async () => {
    if (!date || !timeSlot) {
      alert("Please select both Date and Time Slot first.");
      return;
    }
    setAvailabilityStatus("checking");
    
    try {
      const res = await fetch("/api/enquiries/confirmed");
      const json = await res.json();
      if (json.success) {
        const confirmed = json.data;
        setConfirmedBookings(confirmed);
        
        const selectedDateObj = new Date(date);
        const dayBookings = confirmed.filter((b: any) => {
          const bd = new Date(b.preferredDate);
          return bd.getFullYear() === selectedDateObj.getFullYear() && 
                 bd.getMonth() === selectedDateObj.getMonth() && 
                 bd.getDate() === selectedDateObj.getDate();
        });

        const hasFullDay = dayBookings.some((b: any) => (b.addOns?.[0] || "Morning Slot") === "Full Day");
        
        let isAvailable = true;
        if (hasFullDay) {
          isAvailable = false;
        } else if (timeSlot === "Full Day") {
          isAvailable = dayBookings.length === 0;
        } else {
          isAvailable = !dayBookings.some((b: any) => (b.addOns?.[0] || "Morning Slot") === timeSlot);
        }

        setAvailabilityStatus(isAvailable ? "available" : "unavailable");
      } else {
        setAvailabilityStatus("unchecked");
        alert("Failed to check availability.");
      }
    } catch (err) {
      console.error(err);
      setAvailabilityStatus("unchecked");
      alert("Error checking availability.");
    }
  };

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (occasion) params.set("occasion", occasion);
    if (date) params.set("date", date);
    if (timeSlot) params.set("slot", timeSlot);
    if (guests) {
      const numericGuests = guests.split(" ")[0] || "";
      params.set("guests", numericGuests);
    }
    router.push(`/booking?${params.toString()}`);
  };

  const handleSelectOccasion = (occName: string) => {
    setOccasion(occName);
    setAvailabilityStatus("unchecked");
    setIsOccasionOpen(false);
  };

  const handleSelectDate = (day: number) => {
    if (isPastDate(day) || isDateFullyBooked(day)) return;
    setDate(`${monthNames[currentMonth]} ${day}, ${currentYear}`);
    setAvailabilityStatus("unchecked");
    setIsDateOpen(false);
  };

  const handleSelectTimeSlot = (slotName: string) => {
    setTimeSlot(slotName);
    setAvailabilityStatus("unchecked");
    setIsTimeSlotOpen(false);
  };

  const handleSelectGuests = (gRange: string) => {
    setGuests(`${gRange} Guests`);
    setAvailabilityStatus("unchecked");
    setIsGuestsOpen(false);
  };

  return (
    <>
      <Navbar activePage="Home" />

      {/* Click-outside backdrop wrapper for dropdowns */}
      {(isOccasionOpen || isDateOpen || isTimeSlotOpen || isGuestsOpen) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => {
            setIsOccasionOpen(false);
            setIsDateOpen(false);
            setIsTimeSlotOpen(false);
            setIsGuestsOpen(false);
          }}
        />
      )}

      <main className="bg-background min-h-screen">
        {/* Cinematic Hero */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="The Grand Lounge Ballroom"
              className="w-full h-full object-cover animate-ken-burns"
              src="/hero-ballroom.png"
            />
            <div className="absolute inset-0 hero-overlay"></div>
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-20 z-10">
            <h1 className="text-white font-display text-4xl md:text-6xl lg:text-72px max-w-4xl animate-fade-up">
              The Art of Celebration
            </h1>
            <p className="text-surface-variant font-sans text-lg mt-6 max-w-2xl animate-fade-up-delay">
              A sanctuary of refined elegance where heritage meets contemporary luxury in the heart of Delhi.
            </p>
          </div>          {/* Overlapping Booking Card - Increased dimensions and luxury styles */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[95%] lg:w-[95%] max-w-7xl z-40 flex flex-col items-center gap-4">
            {/* Mobile Trigger Button (Visible only on mobile when card is collapsed) */}
            {!isHeroCardExpanded && (
              <button
                onClick={() => setIsHeroCardExpanded(true)}
                className="md:hidden bg-white/95 backdrop-blur-sm text-black border border-secondary/25 shadow-2xl px-6 py-4 rounded-full font-label-caps text-[10px] font-bold tracking-widest hover:bg-secondary/15 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">calendar_today</span>
                Check Availability
              </button>
            )}

            {/* Availability Card Container */}
            <div className={`w-full transition-all duration-500 origin-bottom transform ${
              isHeroCardExpanded 
                ? "scale-100 opacity-100 max-h-[85vh] overflow-y-auto" 
                : "scale-95 opacity-0 max-h-0 overflow-hidden md:scale-100 md:opacity-100 md:max-h-none md:overflow-visible"
            }`}>
              <div className="bg-surface/90 backdrop-blur-md rounded-[32px] md:rounded-full shadow-[0_32px_64px_-16px_rgba(117,90,40,0.15)] p-5 md:p-6 md:px-8 flex flex-col md:flex-row items-center gap-4 md:gap-6 border border-secondary/20 relative">
                
                {/* Close Button on Mobile */}
                <button
                  onClick={() => setIsHeroCardExpanded(false)}
                  className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-all z-50 animate-fade-in"
                  aria-label="Collapse Availability Checker"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 px-2">
                  
                  {/* Occasion Selection Field */}
                  <div className="flex items-center gap-3 p-2.5 rounded-[20px] md:rounded-full hover:bg-surface-container/60 transition-all cursor-pointer group relative"
                       onClick={() => {
                         setIsOccasionOpen(!isOccasionOpen);
                         setIsDateOpen(false);
                         setIsTimeSlotOpen(false);
                         setIsGuestsOpen(false);
                       }}>
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all shrink-0">
                      <span className="material-symbols-outlined text-xl">celebration</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="font-label-caps text-secondary text-[9px] tracking-widest mb-0.5 block">Occasion</span>
                      <input
                        className="bg-transparent border-0 font-display text-sm lg:text-base text-on-surface font-semibold placeholder:text-on-surface-variant/40 outline-none w-full cursor-pointer focus:ring-0 p-0 pointer-events-none animate-fade-in"
                        placeholder="Select Occasion"
                        type="text"
                        readOnly
                        value={occasion}
                      />
                    </div>
                    
                    {isOccasionOpen && (
                      <div 
                        className="absolute bottom-full mb-6 left-0 w-80 md:w-[350px] bg-surface/95 backdrop-blur-lg rounded-[28px] border border-secondary/20 p-6 shadow-[0_24px_48px_-12px_rgba(117,90,40,0.18)] z-50 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-label-caps text-secondary text-[11px] block font-bold mb-4 tracking-widest border-b border-secondary/15 pb-2">
                          RECOMMENDED OCCASIONS
                        </span>
                        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                          {occasionsExtended.map((occ) => (
                            <button
                              key={occ.name}
                              type="button"
                              onClick={() => handleSelectOccasion(occ.name)}
                              className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col items-start gap-0.5 ${
                                occasion === occ.name
                                  ? "bg-primary text-on-primary border-primary font-bold"
                                  : "bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container-high hover:border-secondary/25"
                              }`}
                            >
                              <span className="font-label-caps text-[11px] tracking-wider">{occ.name}</span>
                              <span className={`text-[10px] ${occasion === occ.name ? "text-on-primary/75" : "text-on-surface-variant/65"}`}>{occ.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
   
                  {/* Date Selection Field */}
                  <div className="flex items-center gap-3 p-2.5 rounded-[20px] md:rounded-full hover:bg-surface-container/60 transition-all cursor-pointer group relative"
                       onClick={() => {
                         setIsDateOpen(!isDateOpen);
                         setIsOccasionOpen(false);
                         setIsTimeSlotOpen(false);
                         setIsGuestsOpen(false);
                       }}>
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all shrink-0">
                      <span className="material-symbols-outlined text-xl">calendar_month</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="font-label-caps text-secondary text-[9px] tracking-widest mb-0.5 block">Event Date</span>
                      <input
                        className="bg-transparent border-0 font-display text-sm lg:text-base text-on-surface font-semibold placeholder:text-on-surface-variant/40 outline-none w-full cursor-pointer focus:ring-0 p-0 pointer-events-none animate-fade-in"
                        placeholder="Select Date"
                        type="text"
                        readOnly
                        value={date}
                      />
                    </div>
   
                    {isDateOpen && (
                      <div 
                        className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-[340px] md:w-[360px] bg-surface/95 backdrop-blur-lg rounded-[28px] border border-secondary/20 p-6 shadow-[0_24px_48px_-12px_rgba(117,90,40,0.18)] z-50 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4 border-b border-secondary/15 pb-2">
                          <div className="flex items-center gap-3">
                            <button 
                              type="button" 
                              disabled={isPrevMonthDisabled()} 
                              onClick={handlePrevMonth} 
                              className="w-7 h-7 rounded-full border border-secondary/25 flex items-center justify-center hover:bg-secondary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-on-surface"
                            >
                              <span className="material-symbols-outlined text-[14px] font-bold">chevron_left</span>
                            </button>
                            <span className="font-display text-base text-on-surface font-semibold">
                              {monthNames[currentMonth]} {currentYear}
                            </span>
                            <button 
                              type="button" 
                              onClick={handleNextMonth} 
                              className="w-7 h-7 rounded-full border border-secondary/25 flex items-center justify-center hover:bg-secondary/10 transition-all text-on-surface"
                            >
                              <span className="material-symbols-outlined text-[14px] font-bold">chevron_right</span>
                            </button>
                          </div>
                          <span className="font-label-caps text-[9px] text-secondary tracking-widest font-bold bg-secondary/10 px-2.5 py-1 rounded-full">
                            DELHI SEASONS
                          </span>
                        </div>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-y-2 gap-x-1.5 text-center">
                          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                            <div key={i} className="font-label-caps text-[10px] text-on-surface-variant opacity-60 pb-1 font-bold">
                              {d}
                            </div>
                          ))}
                          {Array.from({ length: startOffset }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-8" />
                          ))}
                          {calendarDays.map((day) => {
                            const isBooked = isDateFullyBooked(day);
                            const isPast = isPastDate(day);
                            const dNum = new Date(currentYear, currentMonth, day).getDay();
                            const isPeak = dNum === 0 || dNum === 6;
                            const isSelected = date === `${monthNames[currentMonth]} ${day}, ${currentYear}`;
    
                            let cellStyle = "h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold cursor-pointer transition-all mx-auto ";
    
                            if (isPast || isBooked) {
                              cellStyle += "bg-surface-container-highest text-on-surface-variant opacity-25 cursor-not-allowed line-through";
                            } else if (isSelected) {
                              cellStyle += "bg-primary text-on-primary font-bold shadow-md shadow-primary/35 scale-110";
                            } else if (isPeak) {
                              cellStyle += "bg-secondary/15 border border-secondary/35 text-secondary hover:bg-secondary/30 hover:scale-105";
                            } else {
                              cellStyle += "hover:bg-secondary/10 text-on-surface hover:text-secondary";
                            }
    
                            return (
                              <button
                                key={day}
                                type="button"
                                disabled={isPast || isBooked}
                                onClick={() => handleSelectDate(day)}
                                className={cellStyle}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
   
                        {/* Legend */}
                        <div className="mt-5 pt-3 border-t border-secondary/15 flex justify-between text-[9px] font-label-caps text-on-surface-variant font-bold">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-secondary/15 border border-secondary/35"></div>
                            <span>PEAK</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full border border-secondary/30"></div>
                            <span>AVAILABLE</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest opacity-55 relative overflow-hidden">
                              <div className="absolute inset-0 bg-line-through-deg"></div>
                            </div>
                            <span>BOOKED</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
   
                  {/* Time Slot Selection Field */}
                  <div className="flex items-center gap-3 p-2.5 rounded-[20px] md:rounded-full hover:bg-surface-container/60 transition-all cursor-pointer group relative"
                       onClick={() => {
                         setIsTimeSlotOpen(!isTimeSlotOpen);
                         setIsOccasionOpen(false);
                         setIsDateOpen(false);
                         setIsGuestsOpen(false);
                       }}>
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all shrink-0">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="font-label-caps text-secondary text-[9px] tracking-widest mb-0.5 block">Time Slot</span>
                      <input
                        className="bg-transparent border-0 font-display text-sm lg:text-base text-on-surface font-semibold placeholder:text-on-surface-variant/40 outline-none w-full cursor-pointer focus:ring-0 p-0 pointer-events-none animate-fade-in"
                        placeholder="Select Time"
                        type="text"
                        readOnly
                        value={timeSlot}
                      />
                    </div>
   
                    {isTimeSlotOpen && (
                      <div 
                        className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-80 md:w-[320px] bg-surface/95 backdrop-blur-lg rounded-[28px] border border-secondary/20 p-6 shadow-[0_24px_48px_-12px_rgba(117,90,40,0.18)] z-50 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-label-caps text-secondary text-[11px] block font-bold mb-4 tracking-widest border-b border-secondary/15 pb-2">
                          CHOOSE TIME SLOT
                        </span>
                        <div className="flex flex-col gap-2">
                          {timeSlotsExtended.map((slot) => (
                            <button
                              key={slot.name}
                              type="button"
                              onClick={() => handleSelectTimeSlot(slot.name)}
                              className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col items-start gap-0.5 ${
                                timeSlot === slot.name
                                  ? "bg-primary text-on-primary border-primary font-bold shadow-md"
                                  : "bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container-high hover:border-secondary/25"
                              }`}
                            >
                              <span className="font-label-caps text-[11px] tracking-wider">{slot.name}</span>
                              <span className={`text-[10px] ${timeSlot === slot.name ? "text-on-primary/75" : "text-on-surface-variant/65"}`}>{slot.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
   
                  {/* Guests Selection Field */}
                  <div className="flex items-center gap-3 p-2.5 rounded-[20px] md:rounded-full hover:bg-surface-container/60 transition-all cursor-pointer group relative"
                       onClick={() => {
                         setIsGuestsOpen(!isGuestsOpen);
                         setIsOccasionOpen(false);
                         setIsDateOpen(false);
                         setIsTimeSlotOpen(false);
                       }}>
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all shrink-0">
                      <span className="material-symbols-outlined text-xl">groups</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="font-label-caps text-secondary text-[9px] tracking-widest mb-0.5 block">Guest Count</span>
                      <input
                        className="bg-transparent border-0 font-display text-sm lg:text-base text-on-surface font-semibold placeholder:text-on-surface-variant/40 outline-none w-full cursor-pointer focus:ring-0 p-0 pointer-events-none animate-fade-in"
                        placeholder="Select Guests"
                        type="text"
                        readOnly
                        value={guests}
                      />
                    </div>
   
                    {isGuestsOpen && (
                      <div 
                        className="absolute bottom-full mb-6 right-0 w-80 md:w-[350px] bg-surface/95 backdrop-blur-lg rounded-[28px] border border-secondary/20 p-6 shadow-[0_24px_48px_-12px_rgba(117,90,40,0.18)] z-50 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-label-caps text-secondary text-[11px] block font-bold mb-4 tracking-widest border-b border-secondary/15 pb-2">
                          RECOMMENDED GUEST CAPACITY
                        </span>
                        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                          {guestRangesExtended.map((item) => (
                            <button
                              key={item.range}
                              type="button"
                              onClick={() => handleSelectGuests(item.range)}
                              className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col items-start gap-0.5 ${
                                guests === `${item.range} Guests`
                                  ? "bg-primary text-on-primary border-primary font-bold shadow-md"
                                  : "bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container-high hover:border-secondary/25"
                              }`}
                            >
                              <span className="font-label-caps text-[11px] tracking-wider">{item.range} Guests</span>
                              <span className={`text-[10px] ${guests === `${item.range} Guests` ? "text-on-primary/75" : "text-on-surface-variant/65"}`}>{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
   
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto shrink-0">
                  {availabilityStatus === "available" && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 animate-pulse text-center">
                      Available! You can book
                    </span>
                  )}
                  {availabilityStatus === "unavailable" && (
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-4 py-2 rounded-full border border-red-200 text-center">
                      Slot Booked. Choose another
                    </span>
                  )}
                  
                  {availabilityStatus === "available" ? (
                    <button
                      onClick={handleCheckAvailability}
                      className="w-full md:w-auto bg-green-600 text-white px-8 py-4 rounded-full font-label-caps text-xs hover:bg-green-700 transition-all duration-300 font-bold tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-green-600/10 flex items-center justify-center gap-2"
                    >
                      <span>BOOK NOW</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={availabilityStatus === "checking" ? undefined : checkAvailability}
                      disabled={availabilityStatus === "checking"}
                      className="w-full md:w-auto bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-xs hover:bg-secondary hover:text-white transition-all duration-300 font-bold tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{availabilityStatus === "checking" ? "Checking..." : "Check Availability"}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div></section>

        {/* Luxury Features */}
        <section className="py-24 md:py-32 px-6 md:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Grandeur */}
            <FadeIn className="bg-surface-container-low p-10 md:p-12 rounded-editorial border border-secondary/5 flex flex-col items-start gap-6 hover:translate-y-[-8px] transition-transform duration-500">
              <span className="material-symbols-outlined text-secondary text-4xl">castle</span>
              <h3 className="font-headline-md text-2xl md:text-3xl text-on-surface">Grandeur</h3>
              <p className="font-body-md text-on-surface-variant">
                Vast column-less spaces designed for majestic gatherings, featuring 24-foot ceilings and artisanal craftsmanship.
              </p>
              <div className="h-px w-12 bg-secondary/30 mt-auto"></div>
            </FadeIn>
            {/* Gastronomy */}
            <FadeIn delay={100} className="bg-surface-container-low p-10 md:p-12 rounded-editorial border border-secondary/5 flex flex-col items-start gap-6 hover:translate-y-[-8px] transition-transform duration-500 md:mt-12">
              <span className="material-symbols-outlined text-secondary text-4xl">restaurant</span>
              <h3 className="font-headline-md text-2xl md:text-3xl text-on-surface">Gastronomy</h3>
              <p className="font-body-md text-on-surface-variant">
                A culinary journey curated by world-class chefs, blending authentic Indian flavors with modern international flair.
              </p>
              <div className="h-px w-12 bg-secondary/30 mt-auto"></div>
            </FadeIn>
            {/* Grace */}
            <FadeIn delay={200} className="bg-surface-container-low p-10 md:p-12 rounded-editorial border border-secondary/5 flex flex-col items-start gap-6 hover:translate-y-[-8px] transition-transform duration-500 md:mt-24">
              <span className="material-symbols-outlined text-secondary text-4xl">flare</span>
              <h3 className="font-headline-md text-2xl md:text-3xl text-on-surface">Grace</h3>
              <p className="font-body-md text-on-surface-variant">
                Our signature white-glove service ensures every guest feels the warmth of traditional hospitality refined for the elite.
              </p>
              <div className="h-px w-12 bg-secondary/30 mt-auto"></div>
            </FadeIn>
          </div>
        </section>

        {/* Venue Showcase: Alternating Blocks */}
        <section className="bg-surface py-24 md:py-32 overflow-hidden">
          {/* Block 1 */}
          <div className="max-w-7xl mx-auto px-6 md:px-20 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12 md:gap-20">
              <FadeIn className="md:col-span-7 relative group">
                <div className="overflow-hidden rounded-editorial">
                  <img
                    className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="The Garden Pavilion at The Grand Lounge"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUFZQRQErmPuf7VIUjAjuYIOslzbQOIpo7KYtyi-ZyFM9wxOjq6SF1bJP0tk7AXgwZNqtDi5oa0u0Ai9sw3cNKfwlhXk_2X4UjyhGXwgBdaMVu81Dwe7GnqGBHrTnN6WMJSbhGoNkhBn5EFH9MaI2TqY03eUzEM9nq2R_D88gA30ZuAMZ-QMwDw1pHmaHXeYW6dbxNZuHh9avqsFjje9xsuj31Hyz5wCMmC6IZhGvnHp9TV0yG_NZgyB9ag-VTMjNZXzWNrsL866A"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-10"></div>
              </FadeIn>
              <FadeIn delay={150} className="md:col-span-5 flex flex-col gap-6">
                <span className="font-label-caps text-secondary text-xs">01. THE GARDEN PAVILION</span>
                <h2 className="font-headline-lg text-4xl md:text-5xl text-primary">Where Nature Meets Opulence</h2>
                <p className="font-body-lg text-on-surface-variant">
                  Step into an oasis of tranquility. Our Garden Pavilion offers a seamless blend of manicured landscapes and contemporary glass architecture, perfect for sunset cocktails or serene morning ceremonies.
                </p>
                <Link
                  href="/facilities"
                  className="inline-flex items-center gap-2 font-label-caps text-xs text-primary border-b border-primary w-fit pb-1 group"
                >
                  Explore The Garden
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </FadeIn>
            </div>
          </div>

          {/* Block 2 */}
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12 md:gap-20">
              <FadeIn className="md:col-span-5 order-2 md:order-1 flex flex-col gap-6">
                <span className="font-label-caps text-secondary text-xs">02. THE GRAND BALLROOM</span>
                <h2 className="font-headline-lg text-4xl md:text-5xl text-primary">A Stage for Extraordinary Stories</h2>
                <p className="font-body-lg text-on-surface-variant">
                  Host the event of the century in our signature ballroom. With customizable lighting and acoustics, it transforms from a high-energy gala to an intimate romantic setting with effortless poise.
                </p>
                <Link
                  href="/facilities"
                  className="inline-flex items-center gap-2 font-label-caps text-xs text-primary border-b border-primary w-fit pb-1 group"
                >
                  View Ballroom Details
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </FadeIn>
              <FadeIn delay={150} className="md:col-span-7 order-1 md:order-2 relative group">
                <div className="overflow-hidden rounded-editorial">
                  <img
                    className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="The Grand Ballroom Table Setup"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpjP7aTfCcspvO5rKd6WZQjB8CQ2yBgh-jUcbwysBRBa1t-Q8zQW1tJQUFAfu6s8MBkZL68mk9bitZdeIUaasNMkxvqZRUH4JJL3y4QnFXxCtuKutkZjaheSlcXh7XIBw2oMqWkl0D59WCka9_-cYA8Arz73cLHKET_lr936UHRyLHmgXd7_pLFmSJxqFVG57F8EZtiZ6WQLkbCDinYEB0cZmQakYqHGoiyQYgpYrIYTMGZSzYuUDTA6wLzF8BlbqxkYa_Rt5HCJw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Masonry Gallery Preview */}
        <section className="py-24 md:py-32 px-6 md:px-20 bg-background max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="font-label-caps text-secondary text-xs">ATMOSPHERE</span>
              <h2 className="font-headline-lg text-4xl md:text-5xl mt-4">Moments Captured in Gold</h2>
            </div>
            <Link
              href="/gallery"
              className="bg-outline-variant/10 border border-outline-variant text-on-surface font-label-caps text-xs px-8 py-4 rounded-full hover:bg-surface-variant transition-colors"
            >
              View Full Gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[600px] md:h-[800px]">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-editorial">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                alt="Lounge Interior"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpun5sxAT0iyCOa9AnbfmwtYOG-IlCiKYQLzC2vZOniLQhrU2HjLTi9zwtGgHCSska8Jk-l-zOArljyd8_IiSvFhSOh8tBNDwTZKGaQ8IVC94D1IX2JT1lad1Sw-QV-s94V2Y4Yib7AxJl0D_bLLtidJqQi6Br27jDfXtjgtUlETHzALFKYwHlperFUyBMFjnJFLp0wEkz6XYaIHnBzx4ZhDwM182xhkEoYXAQHmwLVIpTgSzcOWqIOc_szA95cVoiPRzhxvf2y6w"
              />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden rounded-editorial">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                alt="Bespoke Appetizers"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvjCtns9_Gn98W0fsLcbaXmBwnzpB_elMrUUVyEQPn06fJveDnJCDj7dkziRPKMPPcljG5zvUkWJ7ul78gaP-O8trdoOmnfYISJ6XR321wkWrN3qd-y_VvNzt9vdtqowyjsNt9trCAFplPza3UUbgGU1yRr46O5TKCwKPb6zmv3Sn5zqBTDAvMDaJx8OFrr-wKKQwO7dK3HzxUBtAPFO6ET1jPYIpimnmCpR1KoWOBdDUKMet1rHoc6QUCD_nQZ35GS-Hztyi4A4k"
              />
            </div>
            <div className="col-span-1 row-span-2 overflow-hidden rounded-editorial">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                alt="Grand Staircase Detail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHEs-Kfr2ZzSbHpLAzWcWoSMi2yxIR9rVZusHVHynfL31vct9T0RUKjBzSm5ba4a2GRYzvi7cTV_nVAqBYyhWKmwKJg3fEAomyIrBmVLfWeA4uOOgiuRxvYJ75i9G-ZTtOT0Qs_cLYaUq9z48yn5gg3wxI8UzSNG3q1X0q5_-RBIpw690C7GJl7CBfkK23e6a_WxVdpAN1Wz54jKJBacOySxmr4Vn-N-axHaQNFzKlTFKIWcJcuRGjSoO8I_ct4_Kist2vCmGyPMY"
              />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden rounded-editorial">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                alt="Terrace Garden Evening"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7OFH_jBS15WzrwopIclVB1cEd8Dlj21IyzzXYPf2vEc1pjOuybN4yydzaKEbAH9C-yk_GsMbuYXHyVe_-mEtA72fQukIiP68bar4ruXMOkMBuHIyahleQo00iqFtGr0evLGl9y9r5nQlxr02O-8vgEoHvNOoIdQS8cDef7YaGgu8j9ahpA5aT90fVKLP2ZZmbVZF9P4iEoEsYMIf10txHXiCTw8S7bEuYynGc3HM6rX6fhBIbqPAQpkXmzP0308p7Cfoib0Z17hs"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}