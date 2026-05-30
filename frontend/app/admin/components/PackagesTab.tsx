"use client";

import { Package } from "../types";

interface PackagesTabProps {
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  handleOpenEditPackage: (pkg: Package) => void;
  setIsPackageModalOpen: (open: boolean) => void;
  setEditingPackage: (pkg: Package | null) => void;
}

export default function PackagesTab({
  packages,
  setPackages,
  handleOpenEditPackage,
  setIsPackageModalOpen,
  setEditingPackage
}: PackagesTabProps) {

  const handleToggleFeatured = (id: string) => {
    setPackages(packages.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
  };

  const handleCreateNewPackage = () => {
    setEditingPackage({
      id: "pkg_" + Date.now(),
      tier: "",
      name: "",
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
    <div className="space-y-8 animate-fade-in">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-[#1F1F1F] font-bold">Packages & Collections</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Configure pricing packages, toggle feature flags, and modify dynamic pricing rates.</p>
        </div>
        <button 
          onClick={handleCreateNewPackage}
          className="bg-[#C5A880] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#Bfa372] transition-colors"
        >
          Create Package
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10]">
              <img 
                src={pkg.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpjP7aTfCcspvO5rKd6WZQjB8CQ2yBgh-jUcbwysBRBa1t-Q8zQW1tJQUFAfu6s8MBkZL68mk9bitZdeIUaasNMkxvqZRUH4JJL3y4QnFXxCtuKutkZjaheSlcXh7XIBw2oMqWkl0D59WCka9_-cYA8Arz73cLHKET_lr936UHRyLHmgXd7_pLFmSJxqFVG57F8EZtiZ6WQLkbCDinYEB0cZmQakYqHGoiyQYgpYrIYTMGZSzYuUDTA6wLzF8BlbqxkYa_Rt5HCJw"} 
                alt={pkg.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#C5A880] uppercase tracking-wider border border-[#E8E2D9]">
                {pkg.tier}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="font-display font-semibold text-xl text-[#1F1F1F]">{pkg.name}</h3>
                  <span className="font-poppins font-bold text-lg text-[#C5A880]">{pkg.price}</span>
                </div>
                <p className="text-xs text-[#6B6B6B] mb-4">{pkg.desc}</p>
                
                <div className="space-y-2 mb-6">
                  <p className="text-[10px] font-bold tracking-wider text-[#1F1F1F] uppercase font-poppins">INCLUDED SERVICES</p>
                  <ul className="text-xs text-[#6B6B6B] space-y-1.5 list-disc pl-4">
                    {pkg.services.map((ser, i) => (
                      <li key={i}>{ser}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#E8E2D9] pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B6B6B]">Featured:</span>
                  <button
                    onClick={() => handleToggleFeatured(pkg.id)}
                    className={`w-10 h-6 rounded-full p-1 transition-colors ${pkg.featured ? "bg-[#C5A880]" : "bg-[#F3EEE7]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pkg.featured ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEditPackage(pkg)} 
                    className="w-8 h-8 rounded-full border border-[#E8E2D9] flex items-center justify-center text-[#6B6B6B] hover:bg-[#F8F5F0] hover:text-[#1F1F1F] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeletePackage(pkg.id)} 
                    className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
