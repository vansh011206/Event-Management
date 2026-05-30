"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "../types";

interface Notification {
  id: string;
  text: string;
  read: boolean;
  time: string;
}

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  setIsNewBookingModalOpen: (open: boolean) => void;
  setIsPackageModalOpen: (open: boolean) => void;
  setEditingPackage: (pkg: Package | null) => void;
  onAddGalleryItem: () => void;
  notifications: Notification[];
  setNotifications: (notifs: Notification[]) => void;
}

export default function Topbar({
  searchQuery,
  setSearchQuery,
  setActiveTab,
  setIsNewBookingModalOpen,
  setIsPackageModalOpen,
  setEditingPackage,
  onAddGalleryItem,
  notifications,
  setNotifications
}: TopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleQuickNewBooking = () => {
    setIsNewBookingModalOpen(true);
  };

  const handleQuickBlockDate = () => {
    setActiveTab("calendar");
  };

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

  const handleQuickUploadPhotos = () => {
    onAddGalleryItem();
  };

  return (
    <header className="bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8E2D9] py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* Search bar */}
      <div className="relative w-64 md:w-80 flex items-center bg-[#F8F5F0] rounded-full px-4 py-2 border border-[#E8E2D9]/70 focus-within:ring-1 focus-within:ring-[#C5A880] focus-within:border-[#C5A880] transition-all">
        <span className="material-symbols-outlined text-[#6B6B6B] text-lg mr-2">search</span>
        <input
          type="text"
          placeholder="Search bookings, clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-xs w-full text-[#1F1F1F] placeholder-[#6B6B6B]/60 p-0 focus:ring-0 focus:border-none"
        />
      </div>

      {/* Right settings and menu toggles */}
      <div className="flex items-center gap-3 relative">
        
        {/* Quick Actions Dropdown */}
        <div className="relative group">
          <button className="hidden md:flex items-center gap-2 bg-[#C5A880] text-white px-5 py-2.5 rounded-full font-poppins text-xs font-medium hover:bg-[#Bfa372] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Quick Actions</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8E2D9] rounded-[16px] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 p-2">
            <button 
              onClick={handleQuickNewBooking} 
              className="w-full text-left px-4 py-2 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">assignment</span> New Booking
            </button>
            <button 
              onClick={handleQuickBlockDate} 
              className="w-full text-left px-4 py-2 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">block</span> Block Date
            </button>
            <button 
              onClick={handleQuickCreatePackage} 
              className="w-full text-left px-4 py-2 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">category</span> Create Package
            </button>
            <button 
              onClick={handleQuickUploadPhotos} 
              className="w-full text-left px-4 py-2 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">collections</span> Upload Photos
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F8F5F0] transition-colors relative"
          >
            <span className="material-symbols-outlined text-xl text-[#6B6B6B]">notifications</span>
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C5A880]" />
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E8E2D9] rounded-[20px] shadow-lg z-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2 mb-3">
                <h5 className="font-display font-bold text-sm text-[#1F1F1F]">Notifications</h5>
                <button 
                  onClick={handleMarkAllRead} 
                  className="text-[10px] text-[#C5A880] font-bold tracking-wider hover:underline"
                >
                  MARK ALL READ
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-2 rounded-[12px] text-xs transition-colors ${notif.read ? "bg-[#FFFFFF]" : "bg-[#F8F5F0]"}`}>
                    <p className={`text-[#1F1F1F] ${!notif.read && "font-semibold"}`}>{notif.text}</p>
                    <span className="text-[10px] text-[#6B6B6B] block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Selector */}
        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
            className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center bg-[#F3EEE7] overflow-hidden hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[#C5A880] text-2xl font-bold">person</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8E2D9] rounded-[16px] shadow-lg z-50 p-2">
              <button 
                onClick={() => { setActiveTab("settings"); setIsProfileOpen(false); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">settings</span> Profile Settings
              </button>
              <button 
                onClick={() => { setActiveTab("cms"); setIsProfileOpen(false); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-[#1F1F1F] hover:bg-[#F8F5F0] rounded-[8px] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">web</span> CMS Controls
              </button>
              <div className="h-[1px] bg-[#E8E2D9] my-1" />
              <Link 
                href="/" 
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 rounded-[8px] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span> Logout to Web
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
