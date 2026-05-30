"use client";

import { Testimonial } from "../types";

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
}

export default function TestimonialsTab({
  testimonials,
  setTestimonials
}: TestimonialsTabProps) {

  const handleUpdateTestimonialStatus = (id: string, status: Testimonial["status"]) => {
    setTestimonials(testimonials.map((t) => t.id === id ? { ...t, status } : t));
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Review Moderation</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Approve, delete or feature reviews collected from clients during curations.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-[24px] border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display font-semibold text-base text-[#1F1F1F]">{t.name}</h4>
                  <span className="text-[10px] text-[#6B6B6B] tracking-wide uppercase font-semibold font-poppins">{t.occasion}</span>
                </div>
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className="material-symbols-outlined text-sm" 
                      style={{ fontVariationSettings: i < t.rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#6B6B6B] italic leading-relaxed mb-6">“{t.text}”</p>
            </div>

            <div className="border-t border-[#E8E2D9] pt-4 flex items-center justify-between">
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold border uppercase tracking-wider ${
                t.status === "Featured" ? "bg-amber-50 text-amber-700 border-amber-200" :
                t.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
                {t.status}
              </span>
              <div className="flex gap-2">
                {t.status !== "Featured" && (
                  <button 
                    onClick={() => handleUpdateTestimonialStatus(t.id, "Featured")} 
                    className="px-3 py-1.5 border border-[#E8E2D9] text-[10px] font-bold rounded-full hover:bg-[#F8F5F0] transition-colors uppercase tracking-wider"
                  >
                    Feature
                  </button>
                )}
                {t.status === "Pending" && (
                  <button 
                    onClick={() => handleUpdateTestimonialStatus(t.id, "Approved")} 
                    className="px-3 py-1.5 border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold rounded-full hover:bg-green-100 transition-colors uppercase tracking-wider"
                  >
                    Approve
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteTestimonial(t.id)} 
                  className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
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
