"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

interface PhotoItem {
  id: string | number;
  src: string;
  alt: string;
  photographer: string;
  photographer_url?: string;
}

const CATEGORIES = [
  { id: "all", label: "All Spaces", query: "luxury resort pool garden" },
  { id: "weddings", label: "Weddings & Celebrations", query: "luxury wedding stage decoration" },
  { id: "accommodation", label: "Suites & Villas", query: "luxury hotel suite villa" },
  { id: "dining", label: "Fine Dining", query: "gourmet food fine dining" },
  { id: "pools", label: "Wellness & Pools", query: "luxury resort swimming pool spa" },
  { id: "gaming", label: "Gaming & Sports", query: "bowling alley arcade sport" },
  { id: "nightlife", label: "Nightlife & Bars", query: "cocktail bar club party" },
  { id: "corporate", label: "Corporate Galas", query: "conference business meeting gala" },
];

const FALLBACK_IMAGES: Record<string, PhotoItem[]> = {
  all: [
    {
      id: "fallback-all-1",
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury resort swimming pool with beautiful lounge areas.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-all-2",
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      alt: "Grand resort facade at sunset with glowing lights.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-all-3",
      src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant modern lounge room with gold finishes.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-all-4",
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      alt: "Infinite poolside view with tropical background.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-all-5",
      src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      alt: "Fine dining setup with wine glasses and plates.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-all-6",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      alt: "Beautiful wedding altar with hanging flowers.",
      photographer: "Unsplash Contributor",
    },
  ],
  weddings: [
    {
      id: "fallback-wed-1",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      alt: "Stunning outdoor wedding layout under high canopy flowers.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-wed-2",
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury banquet tables decorated with fresh white roses and candles.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-wed-3",
      src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
      alt: "Delicate crystal plates and gold cutlery arrangement.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-wed-4",
      src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
      alt: "A majestic floral arch at the entrance of a ballroom.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-wed-5",
      src: "https://images.unsplash.com/photo-1507504038482-7621c51b3f94?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant stage lights reflecting off a grand wedding layout.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-wed-6",
      src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
      alt: "Champagne tower ready for the couples wedding toast.",
      photographer: "Unsplash Contributor",
    },
  ],
  accommodation: [
    {
      id: "fallback-room-1",
      src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      alt: "Spacious presidential suite with a plush king-sized bed.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-room-2",
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury suite window overlooking manicured gardens.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-room-3",
      src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern resort bathroom with marble details and a freestanding tub.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-room-4",
      src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant design details inside our premium pool villas.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-room-5",
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      alt: "Private villa lounge with glass walls merging with natural light.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-room-6",
      src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury private pool villa courtyard view.",
      photographer: "Unsplash Contributor",
    },
  ],
  dining: [
    {
      id: "fallback-dining-1",
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
      alt: "Fine dining plate with beautifully arranged gourmet cuisine.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-dining-2",
      src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      alt: "Perfect steak dinner served with rich reduction sauce.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-dining-3",
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      alt: "Chefs preparing custom culinary boards at the live counters.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-dining-4",
      src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
      alt: "Beautifully presented seafood platter in a warm-lit restaurant.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-dining-5",
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      alt: "Fresh desserts setup for premium buffet dining.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-dining-6",
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      alt: "Table setting with red wine glasses for a VIP dinner gathering.",
      photographer: "Unsplash Contributor",
    },
  ],
  pools: [
    {
      id: "fallback-pool-1",
      src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      alt: "Stunning infinity pool melting into the sunset horizon.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-pool-2",
      src: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=1200&q=80",
      alt: "Comfortable lounge beds alongside the pristine heated water.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-pool-3",
      src: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80",
      alt: "Cabana setup overlooking the scenic resort lake.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-pool-4",
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      alt: "Resort garden layout centering around the blue family pool.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-pool-5",
      src: "https://images.unsplash.com/photo-1545156521-77bd85671d30?auto=format&fit=crop&w=1200&q=80",
      alt: "Calming outdoor jacuzzi with water jets and stone backdrop.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-pool-6",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      alt: "Golden hour sunset coloring the water of pool loungers.",
      photographer: "Unsplash Contributor",
    },
  ],
  gaming: [
    {
      id: "fallback-game-1",
      src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      alt: "Futuristic gaming zone setup with neon highlights.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-game-2",
      src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
      alt: "Arcade controller cabinets with colorful buttons.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-game-3",
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      alt: "Archery targets lined up on a lush green outdoor grass field.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-game-4",
      src: "https://images.unsplash.com/photo-1543616991-73bb0d540853?auto=format&fit=crop&w=1200&q=80",
      alt: "High-speed quad bike riding track in the dirt forest trails.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-game-5",
      src: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=1200&q=80",
      alt: "Billiards table in a wood-paneled lounge.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-game-6",
      src: "https://images.unsplash.com/photo-1511871810226-7722d6b1d49e?auto=format&fit=crop&w=1200&q=80",
      alt: "Bowling alley lanes illuminated with neon blue lighting.",
      photographer: "Unsplash Contributor",
    },
  ],
  nightlife: [
    {
      id: "fallback-night-1",
      src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      alt: "Sophisticated bartender preparing handcrafted cocktail drinks.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-night-2",
      src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      alt: "High energy DJ mixing music track under neon laser lights.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-night-3",
      src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
      alt: "Cozy open-air bonfire setup with guests relaxing around.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-night-4",
      src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      alt: "Large open-air amphitheatre crowd cheering under party lights.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-night-5",
      src: "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=1200&q=80",
      alt: "Champagne bottle and glasses reflecting starlit background lights.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-night-6",
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
      alt: "Vast outdoor lawn setup for late night music concerts.",
      photographer: "Unsplash Contributor",
    },
  ],
  corporate: [
    {
      id: "fallback-corp-1",
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      alt: "Large executive conference hall with projection screens.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-corp-2",
      src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      alt: "Team-building meeting group gathered around a shared display table.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-corp-3",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      alt: "Auditorium seating setup for high profile business talks.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-corp-4",
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      alt: "Gala stage with branding and dynamic event backdrop LEDs.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-corp-5",
      src: "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=1200&q=80",
      alt: "Beautiful registry tables for corporate guest arrival check-ins.",
      photographer: "Unsplash Contributor",
    },
    {
      id: "fallback-corp-6",
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      alt: "Executive boardroom with modern leather seating and smart layouts.",
      photographer: "Unsplash Contributor",
    },
  ],
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [images, setImages] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [galleryQueries, setGalleryQueries] = useState<Record<string, string>>({
    all: "luxury resort pool garden",
    weddings: "luxury wedding stage decoration",
    accommodation: "luxury hotel suite villa",
    dining: "gourmet food fine dining",
    pools: "luxury resort swimming pool spa",
    gaming: "bowling alley arcade sport",
    nightlife: "cocktail bar club party",
    corporate: "conference business meeting gala",
  });

  useEffect(() => {
    const storedQueries = localStorage.getItem("cms_gallery_queries");
    if (storedQueries) {
      try {
        setGalleryQueries(JSON.parse(storedQueries));
      } catch (err) {
        console.error("Failed to parse stored gallery queries:", err);
      }
    }
  }, []);

  // Dynamic Pexels fetch based on selected category query
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const queryStr = galleryQueries[activeCategory] || galleryQueries["all"] || "resort lounge";
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY || "ZE2NC2G44FwB5CTHyEX1yNy0DAwiwvJEI1RogZiOh4XDOGc9HhHFiOii";

      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryStr)}&per_page=12`,
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Pexels request failed");
        }

        const data = await response.json();
        if (data && data.photos && data.photos.length > 0) {
          const mappedPhotos: PhotoItem[] = data.photos.map((p: any) => ({
            id: p.id,
            src: p.src.large2x || p.src.large,
            alt: p.alt || queryStr,
            photographer: p.photographer,
            photographer_url: p.photographer_url,
          }));
          setImages(mappedPhotos);
        } else {
          throw new Error("No photos found");
        }
      } catch (error) {
        console.warn("Failed fetching from Pexels. Falling back to high-quality static assets.", error);
        setImages(FALLBACK_IMAGES[activeCategory] || FALLBACK_IMAGES["all"]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeCategory, galleryQueries]);

  // Lightbox keyboard controls (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images]);

  return (
    <>
      <Navbar activePage="Gallery" />

      <main className="bg-[#F8F5F0] min-h-screen pt-24 relative overflow-hidden">
        {/* Luxury Backdrop Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#C5A880]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Header / Intro */}
        <header className="pt-24 pb-12 px-6 md:px-20 text-center max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="font-label-caps text-secondary mb-4 block uppercase tracking-widest text-xs font-bold">
              📸 Resort Visual Archives
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-primary mb-4 leading-[1.1] tracking-[-0.02em] font-semibold">
              A Symphony of Spaces
            </h1>

            {/* Luxury Gold Flourish Line */}
            <div className="flex items-center justify-center gap-4 my-6">
              <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A880]/50" />
              <span className="material-symbols-outlined text-[#C5A880] text-xs">grade</span>
              <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A880]/50" />
            </div>

            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Witness the transformation of our grand architecture into moments of extraordinary celebration. Each frame tells a story of heritage meeting contemporary luxury.
            </p>
          </FadeIn>
        </header>

        {/* Floating Category Filter Pill Bar */}
        <div className="sticky top-20 z-40 flex justify-center mb-16 px-6">
          <FadeIn className="bg-white/70 backdrop-blur-xl px-2 py-2 rounded-full border border-[#E8DCC4]/50 shadow-[0_8px_30px_rgba(197,168,128,0.06)] flex gap-1.5 flex-wrap justify-center max-w-5xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-label-caps text-[10px] tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-[#B49363] to-[#C5A880] text-white font-bold shadow-md shadow-[#C5A880]/20 scale-102"
                    : "text-[#5A5245] hover:bg-[#C5A880]/10 hover:text-[#755a28]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </FadeIn>
        </div>

        {/* Gallery Content Section */}
        <section className="px-6 md:px-20 mb-32 max-w-7xl mx-auto relative z-10">
          {loading ? (
            /* Loading Skeletons Grid */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid bg-white/40 border border-[#E8DCC4]/30 rounded-[32px] overflow-hidden p-3 animate-pulse shadow-sm h-72 flex flex-col justify-between"
                >
                  <div className="w-full h-full bg-[#E5E2DD]/50 rounded-[24px]" />
                </div>
              ))}
            </div>
          ) : (
            /* Masonry Grid View */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="break-inside-avoid bg-white border border-[#E8DCC4]/60 rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer p-3.5"
                >
                  <div className="rounded-[22px] overflow-hidden relative">
                    <img
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700 max-h-[500px]"
                      alt={item.alt}
                      src={item.src}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#1F1F1F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 scale-90 group-hover:scale-100 transition-all duration-300">
                        zoom_in
                      </span>
                    </div>
                  </div>
                  {/* Photo Attribution Info */}
                  <div className="mt-3 px-1.5 flex justify-between items-center">
                    <p className="text-[11px] text-[#5A5245] truncate font-sans max-w-[70%] font-medium">
                      {item.alt}
                    </p>
                    <p className="text-[9px] font-label-caps text-[#8C6D3E] tracking-normal shrink-0 font-semibold bg-[#C5A880]/10 px-2 py-0.5 rounded-full">
                      By {item.photographer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Immersive Bottom Page Anchor Banner */}
        <section className="w-full h-[60vh] md:h-[70vh] relative mb-0 overflow-hidden border-t border-[#E8DCC4]/30">
          <div className="absolute inset-0 bg-primary/20 z-10" />
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Panoramic garden twilight view"
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <span className="font-label-caps text-white tracking-[0.3em] mb-4 text-xs font-semibold">
              THE EXTERIOR
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-white max-w-3xl leading-[1.1] tracking-[-0.02em] font-semibold drop-shadow-sm">
              Where Nature Meets Grandeur.
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="h-[1px] w-8 bg-white/60" />
              <span className="material-symbols-outlined text-white text-xs">grade</span>
              <span className="h-[1px] w-8 bg-white/60" />
            </div>
          </div>
        </section>
      </main>

      {/* Premium Full Screen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-6">
          {/* Top Panel Actions */}
          <div className="flex justify-between items-center text-white z-10 w-full max-w-7xl mx-auto">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] tracking-wider text-[#C5A880] font-semibold">
                {CATEGORIES.find((c) => c.id === activeCategory)?.label.toUpperCase() || "GALLERY ARCHIVE"}
              </span>
              <span className="text-sm font-sans mt-0.5 text-white/90">
                {images[lightboxIndex]?.alt}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-white/50">
                {lightboxIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/25 active:scale-95 transition-all"
                aria-label="Close Lightbox"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Main Interactive Display Area */}
          <div className="flex-1 flex items-center justify-center relative w-full max-w-6xl mx-auto my-4">
            {/* Left Nav Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))}
              className="absolute left-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/25 active:scale-95 transition-all text-white hover:scale-105 z-20 cursor-pointer"
              aria-label="Previous Image"
            >
              <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
            </button>

            {/* Lightbox Main Image */}
            <div className="max-w-full max-h-[75vh] flex items-center justify-center select-none relative p-4 group">
              <img
                src={images[lightboxIndex]?.src}
                alt={images[lightboxIndex]?.alt || "Gallery Preview"}
                className="max-w-full max-h-[72vh] object-contain rounded-[24px] shadow-2xl border border-white/10 transition-all duration-300"
              />
            </div>

            {/* Right Nav Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))}
              className="absolute right-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/25 active:scale-95 transition-all text-white hover:scale-105 z-20 cursor-pointer"
              aria-label="Next Image"
            >
              <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
            </button>
          </div>

          {/* Bottom Panel Attribution */}
          <div className="text-center text-white/50 text-[11px] font-sans pb-2 z-10">
            {images[lightboxIndex]?.photographer_url ? (
              <a
                href={images[lightboxIndex].photographer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A880] transition-colors underline decoration-[#C5A880]/30"
              >
                Photo by {images[lightboxIndex]?.photographer} on Pexels
              </a>
            ) : (
              <span>Photo by {images[lightboxIndex]?.photographer}</span>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}