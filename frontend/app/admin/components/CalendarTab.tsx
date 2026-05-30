"use client";

import { useState } from "react";
import { Booking } from "../types";

interface CalendarTabProps {
  bookings: Booking[];
  setSelectedCalendarDay: (day: string | null) => void;
}

export default function CalendarTab({
  bookings,
  setSelectedCalendarDay
}: CalendarTabProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get first day of month (Monday=1, Sunday=0)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust offset for Monday start
  const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handleCalendarClick = (dayStr: string) => {
    // Find all bookings for this day
    const dayBookingsList = bookings.filter((b) => {
      const bDate = new Date(b.date);
      return !isNaN(bDate.getTime()) && 
             bDate.getFullYear() === currentYear && 
             bDate.getMonth() === currentMonth && 
             bDate.getDate().toString() === dayStr;
    });

    if (dayBookingsList.length > 0) {
      const details = dayBookingsList
        .map(b => `${b.name} (${b.occasion} - ${b.slot || "Morning Slot"}) [${b.status}]`)
        .join(", ");
      setSelectedCalendarDay(`Date: ${monthNames[currentMonth]} ${dayStr}, ${currentYear} | ${details}`);
    } else {
      setSelectedCalendarDay(`Date: ${monthNames[currentMonth]} ${dayStr}, ${currentYear} | Available`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Availability Calendar</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Review active events, block specific VIP dates, and schedule maintenance slots.</p>
      </section>

      {/* Master Calendar Grid */}
      <div className="bg-[#FFFFFF] p-8 rounded-[24px] border border-[#E8E2D9] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-display text-2xl font-bold text-[#1F1F1F]">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F8F5F0] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F8F5F0] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-[#E8E2D9] rounded-[16px] overflow-hidden">
          {/* Days label */}
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <div key={d} className="p-4 bg-[#F8F5F0] border-r border-b border-[#E8E2D9] text-center font-label-caps text-[10px] text-[#6B6B6B] font-bold">
              {d}
            </div>
          ))}

          {/* Empty offset cells */}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`offset-${i}`} className="p-4 border-r border-b border-[#E8E2D9] h-28 bg-[#F8F5F0]/30" />
          ))}

          {/* Days loop */}
          {Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()).map((day) => {
            // Find all bookings on this day:
            const dayBookingsList = bookings.filter((b) => {
              const bDate = new Date(b.date);
              return !isNaN(bDate.getTime()) && 
                     bDate.getFullYear() === currentYear && 
                     bDate.getMonth() === currentMonth && 
                     bDate.getDate().toString() === day;
            });

            // Determine day status
            const dateObj = new Date(currentYear, currentMonth, parseInt(day, 10));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = dateObj < today;

            let status: "Booked" | "Blocked" | "Maintenance" | null = null;
            if (dayBookingsList.some(b => b.status === "Approved" || b.status === "Confirmed")) {
              status = "Booked";
            } else if (dayBookingsList.some(b => b.status === "Pending")) {
              status = "Blocked";
            }
            
            let bgStyle = "bg-white hover:bg-[#F8F5F0]";
            let borderHighlight = "border-[#E8E2D9]";

            if (status === "Booked") {
              bgStyle = "bg-[#F3EEE7]/30 text-[#1F1F1F]";
              borderHighlight = "border-[#C5A880]/30";
            } else if (status === "Blocked") {
              bgStyle = "bg-[#FFF2CC]/20 text-[#B08000]";
              borderHighlight = "border-yellow-200";
            } else if (status === "Maintenance") {
              bgStyle = "bg-[#FADBD8]/20 text-[#922B21]";
              borderHighlight = "border-red-200";
            }

            if (isPast) {
              bgStyle = "bg-[#EDE9E2] text-[#6B6B6B]/60 opacity-95 hover:bg-[#E5DFD6]";
              borderHighlight = "border-[#D8CEBC]";
            }

            return (
              <div 
                key={day}
                onClick={() => handleCalendarClick(day)}
                className={`p-3 border-r border-b ${borderHighlight} h-28 flex flex-col justify-between cursor-pointer transition-all relative group ${bgStyle}`}
              >
                <span className="font-sans font-bold text-xs text-[#6B6B6B]">{day}</span>
                
                {dayBookingsList.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[64px] scrollbar-hide">
                    {dayBookingsList.map((b, idx) => {
                      const slotName = b.slot || "Morning Slot";
                      let slotColor = "bg-amber-50 border-amber-200 text-amber-800";
                      
                      if (b.status === "Approved" || b.status === "Confirmed") {
                        if (slotName === "Full Day") slotColor = "bg-[#C5A880]/20 border-[#C5A880]/40 text-[#1F1F1F]";
                        else if (slotName === "Evening Slot") slotColor = "bg-indigo-50 border-indigo-200 text-indigo-800";
                        else slotColor = "bg-green-50 border-green-200 text-green-800";
                      } else if (b.status === "Pending") {
                        slotColor = "bg-yellow-50 border-yellow-200 text-yellow-700";
                      } else {
                        slotColor = "bg-red-50 border-red-200 text-red-700 line-through opacity-50";
                      }

                      return (
                        <div 
                          key={idx} 
                          className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded border ${slotColor} truncate tracking-wider max-w-full shadow-sm`} 
                          title={`${b.name} (${b.occasion}): ${slotName}`}
                        >
                          {slotName.replace(" Slot", "")} Booked
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 material-symbols-outlined text-[12px] text-[#C5A880]">
                  info
                </span>
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D9] flex flex-wrap gap-6 text-[10px] font-label-caps text-[#6B6B6B] font-bold">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-white border border-[#E8E2D9]" />
            <span>AVAILABLE DATE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#F3EEE7]/30 border border-[#C5A880]/30" />
            <span>BOOKED / CONFIRMED EVENTS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#FFF2CC]/20 border border-yellow-200" />
            <span>PENDING REQUESTS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#FADBD8]/20 border border-red-200" />
            <span>MAINTENANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
