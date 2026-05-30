"use client";

interface CmsTabProps {
  cmsHeroTitle: string;
  setCmsHeroTitle: (title: string) => void;
  cmsHeroSubtitle: string;
  setCmsHeroSubtitle: (sub: string) => void;
  cmsPhone: string;
  setCmsPhone: (phone: string) => void;
  cmsEmail: string;
  setCmsEmail: (email: string) => void;
  cmsMarqueeText: string;
  setCmsMarqueeText: (text: string) => void;
  cmsGalleryQueries: Record<string, string>;
  setCmsGalleryQueries: (queries: Record<string, string>) => void;
}

export default function CmsTab({
  cmsHeroTitle,
  setCmsHeroTitle,
  cmsHeroSubtitle,
  setCmsHeroSubtitle,
  cmsPhone,
  setCmsPhone,
  cmsEmail,
  setCmsEmail,
  cmsMarqueeText,
  setCmsMarqueeText,
  cmsGalleryQueries,
  setCmsGalleryQueries,
}: CmsTabProps) {

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage to persist across public routes
    localStorage.setItem("cms_marquee_text", cmsMarqueeText);
    localStorage.setItem("cms_gallery_queries", JSON.stringify(cmsGalleryQueries));
    localStorage.setItem("cms_hero_title", cmsHeroTitle);
    localStorage.setItem("cms_hero_subtitle", cmsHeroSubtitle);
    localStorage.setItem("cms_phone", cmsPhone);
    localStorage.setItem("cms_email", cmsEmail);

    alert("Website content successfully updated and published live!");
  };

  return (
    <div className="space-y-8 animate-fade-in font-poppins">
      <section>
        <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Website Content Management</h1>
        <p className="text-sm text-[#6B6B6B] mt-1 font-sans">Modify customer-facing headings, banners, contact numbers, and preview content updates.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CMS Form Editor */}
        <form onSubmit={handlePublish} className="bg-white p-8 rounded-[24px] border border-[#E8DCC4]/60 shadow-sm space-y-6">
          <h4 className="font-display font-semibold text-lg text-[#1F1F1F]">Header Content Settings</h4>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">Hero Section Title</label>
            <input
              type="text"
              value={cmsHeroTitle}
              onChange={(e) => setCmsHeroTitle(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">Hero Section Subtitle Description</label>
            <textarea
              rows={2}
              value={cmsHeroSubtitle}
              onChange={(e) => setCmsHeroSubtitle(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F] resize-none"
            />
          </div>

          <h4 className="font-display font-semibold text-lg text-[#1F1F1F] pt-4 border-t border-[#E8E2D9]/60">Facilities & Gallery Settings</h4>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">Facilities Marquee Text</label>
            <textarea
              rows={2}
              value={cmsMarqueeText}
              onChange={(e) => setCmsMarqueeText(e.target.value)}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F] resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase block">Gallery Search Queries (Pexels)</label>
            <div className="grid grid-cols-2 gap-3 bg-[#F8F5F0] p-4 rounded-[16px] border border-[#E8E2D9]/60 max-h-48 overflow-y-auto">
              {Object.keys(cmsGalleryQueries).map((catId) => {
                const label = catId.replace(/^\w/, (c) => c.toUpperCase());
                return (
                  <div key={catId} className="space-y-1">
                    <label className="text-[9px] font-bold text-[#8C6D3E] tracking-normal">{label}</label>
                    <input
                      type="text"
                      value={cmsGalleryQueries[catId] || ""}
                      onChange={(e) => {
                        setCmsGalleryQueries({
                          ...cmsGalleryQueries,
                          [catId]: e.target.value,
                        });
                      }}
                      className="w-full bg-white border border-[#E8E2D9] px-3 py-1.5 rounded-[8px] text-[11px] focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <h4 className="font-display font-semibold text-lg text-[#1F1F1F] pt-4 border-t border-[#E8E2D9]/60">Global Contact Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">Contact Phone</label>
              <input
                type="text"
                value={cmsPhone}
                onChange={(e) => setCmsPhone(e.target.value)}
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">Contact Email</label>
              <input
                type="email"
                value={cmsEmail}
                onChange={(e) => setCmsEmail(e.target.value)}
                className="w-full bg-[#F8F5F0] border border-[#E8E2D9] px-4 py-3 rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A880] text-[#1F1F1F]"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1F1F1F] text-white py-3 rounded-full text-xs font-semibold hover:bg-black transition-all pt-4">
            Publish CMS Updates
          </button>
        </form>

        {/* CMS Live Preview Panel */}
        <div className="bg-[#F3EEE7] p-8 rounded-[24px] border border-[#E8E2D9] flex flex-col h-[650px] justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold tracking-wider text-[#6B6B6B] uppercase">LIVE PREVIEW ACCREDITED</span>
          </div>
          
          <div className="flex-1 bg-white rounded-[20px] p-6 shadow-sm border border-[#E8E2D9]/70 flex flex-col justify-center text-center overflow-y-auto">
            <span className="font-label-caps text-[#C5A880] text-[10px] block mb-2 tracking-[0.2em] font-semibold">THE VENUE</span>
            <h2 className="font-display font-bold text-2xl text-[#1F1F1F] mb-4">{cmsHeroTitle}</h2>
            <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto leading-relaxed font-sans">{cmsHeroSubtitle}</p>
            <div className="h-[1px] bg-[#E8E2D9] my-6 max-w-xs mx-auto" />
            <div className="text-[10px] text-[#6B6B6B]/80 space-y-1">
              <p>Phone: {cmsPhone}</p>
              <p>Email: {cmsEmail}</p>
            </div>
            
            <div className="h-[1px] bg-[#E8DCC4]/50 my-6 max-w-xs mx-auto" />
            <div className="text-left space-y-3 font-sans">
              <div>
                <span className="text-[9px] font-bold tracking-wider text-[#8C6D3E] uppercase block mb-1">Facilities Marquee Preview</span>
                <div className="bg-[#1F1F1F] text-[#C5A880] text-[9px] py-2 px-3 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis border border-[#C5A880]/30 select-none">
                  {cmsMarqueeText}
                </div>
              </div>
              
              <div>
                <span className="text-[9px] font-bold tracking-wider text-[#8C6D3E] uppercase block mb-1">Active Gallery Queries Preview</span>
                <div className="grid grid-cols-2 gap-1.5 text-[9px] text-[#6B6B6B]">
                  {Object.entries(cmsGalleryQueries).slice(0, 4).map(([key, val]) => (
                    <p key={key} className="truncate">
                      <span className="font-semibold text-[#1F1F1F]">{key}:</span> {val}
                    </p>
                  ))}
                  <p className="text-[8px] italic text-[#C5A880] col-span-2 text-right">+ {Object.keys(cmsGalleryQueries).length - 4} more terms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
