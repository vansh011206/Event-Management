"use client";

export default function AnalyticsTab() {
  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Analytics & Metrics</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Review revenue curves, occupancy ratios, and package distribution shares.</p>
      </section>

      {/* Analytics visual grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Curve Line Chart widget */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border border-[#E8E2D9] shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-baseline mb-8">
            <h4 className="font-display font-semibold text-lg text-[#1F1F1F]">Revenue Trends Curve</h4>
            <span className="text-xs text-[#C5A880] font-bold bg-[#F3EEE7] px-3 py-1 rounded-full uppercase tracking-wider">6 Months</span>
          </div>
          <div className="flex-1 relative flex items-end">
            {/* SVG Line Graph representation */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A880" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C5A880" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 160 Q 100 130 200 100 T 400 40 T 500 20 L 500 200 L 0 200 Z" fill="url(#chart-glow)" />
              <path d="M 0 160 Q 100 130 200 100 T 400 40 T 500 20" fill="none" stroke="#C5A880" strokeWidth="3" />
              <circle cx="200" cy="100" r="5" fill="#FFFFFF" stroke="#C5A880" strokeWidth="3" />
              <circle cx="400" cy="40" r="5" fill="#FFFFFF" stroke="#C5A880" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#6B6B6B] mt-4 font-bold tracking-wider font-poppins">
            <span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span>
          </div>
        </div>

        {/* Donut Chart widget */}
        <div className="bg-white p-8 rounded-[24px] border border-[#E8E2D9] shadow-sm flex flex-col h-[400px] justify-between">
          <h4 className="font-display font-semibold text-lg text-[#1F1F1F] mb-4">Packages Market Share</h4>
          
          <div className="relative flex justify-center items-center h-48">
            {/* SVG Donut Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#F3EEE7" strokeWidth="18" />
              {/* Heritage Wedding slice 55% */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#C5A880" strokeWidth="18" strokeDasharray="377" strokeDashoffset="170" />
              {/* Corporate Excellence slice 30% */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#1F1F1F" strokeWidth="18" strokeDasharray="377" strokeDashoffset="282.7" />
            </svg>
            <div className="absolute text-center">
              <h4 className="text-2xl font-bold font-poppins text-[#1F1F1F]">88%</h4>
              <p className="text-[9px] text-[#6B6B6B] uppercase font-semibold">Active Booking</p>
            </div>
          </div>

          <div className="space-y-2 text-[10px] text-[#6B6B6B] font-bold font-poppins">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C5A880]" />
                <span>HERITAGE WEDDING (55%)</span>
              </div>
              <span className="text-[#1F1F1F]">₹137k</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1F1F1F]" />
                <span>CORPORATE SUMMITS (30%)</span>
              </div>
              <span className="text-[#1F1F1F]">₹74k</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F3EEE7]" />
                <span>PRIVATE SOIRÉE (15%)</span>
              </div>
              <span className="text-[#1F1F1F]">₹37k</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
