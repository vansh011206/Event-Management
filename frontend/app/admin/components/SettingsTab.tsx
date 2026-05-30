"use client";

import { useState } from "react";

interface SettingsTabProps {
  adminName: string;
  setAdminName: (name: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  adminPhone: string;
  setAdminPhone: (phone: string) => void;
}

export default function SettingsTab({
  adminName,
  setAdminName,
  adminEmail,
  setAdminEmail,
  adminPhone,
  setAdminPhone
}: SettingsTabProps) {
  const [password, setPassword] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save success
    alert("Admin Settings successfully saved!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Admin Profile Settings</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Configure profile notifications, verify credentials, and customize general settings.</p>
      </section>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-[24px] border border-[#E8E2D9] shadow-sm max-w-3xl space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#F3EEE7] border border-[#E8E2D9] flex items-center justify-center text-[#C5A880] shrink-0">
            <span className="material-symbols-outlined text-4xl">person</span>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg text-[#1F1F1F]">{adminName}</h4>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Venue Curator Manager • New Delhi</p>
            <button 
              type="button"
              className="text-[10px] text-[#C5A880] font-bold uppercase tracking-wider mt-2 border border-[#E8E2D9] px-3.5 py-1.5 rounded-full hover:bg-[#F8F5F0] transition-colors"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-[#E8E2D9]/70" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-poppins">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase font-poppins">Full Admin Name</label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase font-poppins">Admin Email Address</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase font-poppins">Verification Phone</label>
            <input
              type="text"
              required
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase font-poppins">Security Password</label>
            <input
              type="password"
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
            />
          </div>
        </div>

        <button type="submit" className="bg-[#1F1F1F] text-white px-8 py-3 rounded-full text-xs font-semibold hover:bg-black transition-all">
          Save Settings Profile
        </button>

      </form>
    </div>
  );
}
