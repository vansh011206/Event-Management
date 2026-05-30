"use client";

import { useState, useEffect } from "react";
import { GalleryItem } from "../types";

interface GalleryTabProps {
  gallery: GalleryItem[];
  setGallery: (gallery: GalleryItem[]) => void;
  selectedAlbum: string;
  setSelectedAlbum: (album: string) => void;
  onAddGalleryItem: () => void;
  cmsGalleryQueries: Record<string, string>;
}

interface PexelsPhoto {
  id: number;
  src: string;
  alt: string;
  photographer: string;
}

const ALBUM_MAP = [
  { id: "all", label: "All Spaces" },
  { id: "weddings", label: "Weddings & Celebrations" },
  { id: "accommodation", label: "Suites & Villas" },
  { id: "dining", label: "Fine Dining" },
  { id: "pools", label: "Wellness & Pools" },
  { id: "gaming", label: "Gaming & Sports" },
  { id: "nightlife", label: "Nightlife & Bars" },
  { id: "corporate", label: "Corporate Galas" },
];

export default function GalleryTab({
  gallery,
  setGallery,
  selectedAlbum,
  setSelectedAlbum,
  onAddGalleryItem,
  cmsGalleryQueries,
}: GalleryTabProps) {
  const [subTab, setSubTab] = useState<"uploaded" | "pexels">("uploaded");
  const [pexelsPhotos, setPexelsPhotos] = useState<PexelsPhoto[]>([]);
  const [loadingPexels, setLoadingPexels] = useState(false);

  const handleToggleGalleryFeature = (id: string) => {
    setGallery(gallery.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g)));
  };

  const handleDeleteGallery = (id: string) => {
    setGallery(gallery.filter((g) => g.id !== id));
  };

  // Fetch live Pexels photos for real-time validation in the dashboard
  useEffect(() => {
    if (subTab !== "pexels") return;

    const fetchPexelsFeed = async () => {
      setLoadingPexels(true);
      const queryStr = cmsGalleryQueries[selectedAlbum] || cmsGalleryQueries["all"] || "resort lounge";
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY || "ZE2NC2G44FwB5CTHyEX1yNy0DAwiwvJEI1RogZiOh4XDOGc9HhHFiOii";

      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryStr)}&per_page=8`,
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        const data = await response.json();
        if (data && data.photos) {
          setPexelsPhotos(
            data.photos.map((p: any) => ({
              id: p.id,
              src: p.src.medium,
              alt: p.alt || "Pexels Photo",
              photographer: p.photographer,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading Pexels preview in admin panel:", err);
      } finally {
        setLoadingPexels(false);
      }
    };

    fetchPexelsFeed();
  }, [subTab, selectedAlbum, cmsGalleryQueries]);

  return (
    <div className="space-y-8 animate-fade-in font-poppins text-[#1F1F1F]">
      {/* Title */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Gallery Curation</h1>
          <p className="text-sm text-[#6B6B6B] mt-1 font-sans">
            Manage public venue albums, configure search descriptors, and inspect live Pexels photo feeds.
          </p>
        </div>
        <button
          onClick={onAddGalleryItem}
          className="bg-[#C5A880] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#Bfa372] active:scale-95 transition-all shadow-md shadow-[#C5A880]/20 shrink-0 self-start md:self-auto"
        >
          Upload Simulated Image
        </button>
      </section>

      {/* Album filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#E8E2D9] pb-4">
        {ALBUM_MAP.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbum(album.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
              selectedAlbum === album.id
                ? "bg-[#C5A880] text-white border-transparent shadow-sm"
                : "bg-white text-[#5A5245] border-[#E8E2D9]/70 hover:bg-[#FDFBF7]"
            }`}
          >
            {album.label}
          </button>
        ))}
      </div>

      {/* Mode selectors */}
      <div className="flex gap-4">
        <button
          onClick={() => setSubTab("uploaded")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === "uploaded"
              ? "border-[#C5A880] text-[#1F1F1F]"
              : "border-transparent text-[#6B6B6B] hover:text-[#1F1F1F]"
          }`}
        >
          Featured / Mock Uploads ({gallery.filter((g) => selectedAlbum === "all" || g.album === selectedAlbum).length})
        </button>
        <button
          onClick={() => setSubTab("pexels")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === "pexels"
              ? "border-[#C5A880] text-[#1F1F1F]"
              : "border-transparent text-[#6B6B6B] hover:text-[#1F1F1F]"
          }`}
        >
          Live Pexels Feed Preview
        </button>
      </div>

      {/* Main Grid */}
      {subTab === "uploaded" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery
            .filter((g) => selectedAlbum === "all" || g.album === selectedAlbum)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8DCC4]/60 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative p-3"
              >
                <div className="aspect-[4/3] rounded-[18px] overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleToggleGalleryFeature(item.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        item.featured ? "bg-[#C5A880] text-white" : "bg-white text-[#1F1F1F]"
                      }`}
                      title="Feature Image"
                    >
                      <span className="material-symbols-outlined text-sm">star</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center"
                      title="Delete Image"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-3.5 flex justify-between items-center font-sans">
                  <div>
                    <h5 className="text-xs font-bold text-[#1F1F1F] truncate w-32">{item.title}</h5>
                    <span className="text-[9px] text-[#8C6D3E] uppercase font-semibold font-poppins">
                      {ALBUM_MAP.find((a) => a.id === item.album)?.label || item.album}
                    </span>
                  </div>
                  {item.featured && <span className="material-symbols-outlined text-[#C5A880] text-sm">star</span>}
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* Pexels Live API Grid */
        <div className="space-y-4">
          <div className="bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-xl px-4 py-2.5 text-xs text-[#8C6D3E] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>
              Searching Pexels using query term:{" "}
              <strong className="underline">
                "{cmsGalleryQueries[selectedAlbum] || cmsGalleryQueries["all"] || "resort lounge"}"
              </strong>
            </span>
          </div>

          {loadingPexels ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-[#E5E2DD]/50 rounded-[24px]" />
              ))}
            </div>
          ) : pexelsPhotos.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6B6B6B] bg-white border border-dashed border-[#E8DCC4] rounded-[24px]">
              No live photos found. Check Pexels API Key or internet access.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {pexelsPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white border border-[#E8DCC4]/50 rounded-[24px] overflow-hidden p-3 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[4/3] rounded-[18px] overflow-hidden">
                    <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-[10px] text-[#6B6B6B] font-sans truncate">
                    <span>By <strong>{photo.photographer}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
