"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

interface Facility {
  name: string;
  desc: string;
  icon: string;
  tags: string[];
}

const CATEGORIES = [
  { id: "water", label: "Water & Leisure", icon: "pool" },
  { id: "dining", label: "Dining & Food", icon: "restaurant" },
  { id: "bar", label: "Bar & Lounge", icon: "local_bar" },
  { id: "gaming", label: "Gaming & Entertainment", icon: "sports_esports" },
  { id: "events", label: "Events & Nightlife", icon: "nightlife" },
  { id: "wellness", label: "Fitness & Wellness", icon: "spa" },
  { id: "adventure", label: "Adventure Activities", icon: "explore" },
  { id: "sports", label: "Sports Facilities", icon: "sports_soccer" },
  { id: "family", label: "Family & Kids", icon: "child_friendly" },
  { id: "accommodation", label: "Accommodation", icon: "hotel" },
  { id: "corporate", label: "Corporate & Business", icon: "business_center" },
  { id: "wedding", label: "Wedding & Celebration", icon: "favorite" },
  { id: "services", label: "Guest Services", icon: "room_service" },
  { id: "premium", label: "Premium Experiences", icon: "photo_camera" },
  { id: "safety", label: "Safety & Convenience", icon: "security" },
];

const FACILITIES_DATA: Record<string, Facility[]> = {
  water: [
    { name: "Infinity Swimming Pool", desc: "A breathtaking pool merging with the horizon, perfect for sunset relaxation.", icon: "pool", tags: ["Outdoor", "Heated", "Panoramic"] },
    { name: "Private Pool Villas", desc: "Exclusive suites featuring your personal plunge pool for complete privacy.", icon: "home_work", tags: ["Bespoke", "VIP Only"] },
    { name: "Kids Swimming Pool", desc: "Safe, shallow splash zones designed for family fun and younger guests.", icon: "child_care", tags: ["Supervised", "Safe"] },
    { name: "Jacuzzi", desc: "Therapeutic hot tubs with pressurized jets to soothe and rejuvenate your senses.", icon: "hot_tub", tags: ["Indoor", "Hydrotherapy"] },
    { name: "Rain Dance Area", desc: "A lively outdoor space with synchronized misting systems and music.", icon: "rainy", tags: ["Fun", "Sound System"] },
    { name: "Water Slides", desc: "Thrilling slides for recreational water activities and leisure.", icon: "waves", tags: ["Kids Friendly"] },
    { name: "Water Sports Activities", desc: "Exciting activities including canoeing, paddle boarding, and pool games.", icon: "kayaking", tags: ["Adventure"] },
    { name: "Poolside Loungers & Cabanas", desc: "Plush, shaded daybeds offering white-glove service by the pool.", icon: "deck", tags: ["Butler Service", "Relax"] },
    { name: "Poolside Bar", desc: "Handcrafted cocktails and refreshments served right to your lounge chair.", icon: "local_bar", tags: ["Beverages", "Cocktails"] },
  ],
  dining: [
    { name: "Multi-Cuisine Restaurant", desc: "A rich culinary spread featuring classic dishes from around the world.", icon: "restaurant", tags: ["All Day", "Buffet & A La Carte"] },
    { name: "Fine Dining Restaurant", desc: "Award-winning chefs offering curated degustation menus in an elegant setting.", icon: "dinner_dining", tags: ["Reservation Required", "Gourmet"] },
    { name: "Rooftop Dining", desc: "Al fresco dining under the stars with breathtaking views of the city skyline.", icon: "storefront", tags: ["Scenic", "Evening Soirées"] },
    { name: "Buffet Dining", desc: "A grand gastronomic spread spanning regional delicacies and international favorites.", icon: "ramen_dining", tags: ["Unlimited", "Live Stations"] },
    { name: "Live Food Counters", desc: "Interactive cooking stations where chefs prepare fresh meals custom-made for you.", icon: "soup_kitchen", tags: ["Fresh", "Customizable"] },
    { name: "BBQ & Grill Station", desc: "Savory, fire-grilled meats and vegetables smoked to perfection.", icon: "outdoor_grill", tags: ["Live Grill", "Dinner Only"] },
    { name: "Café & Coffee Lounge", desc: "Artisanal brews, single-origin coffees, and freshly baked pastries.", icon: "local_cafe", tags: ["24/7 Access", "Cozy"] },
    { name: "Private Dining Area", desc: "Exclusive dining salons for intimate family gatherings or VIP business dinners.", icon: "meeting_room", tags: ["Soundproof", "Dedicated Butler"] },
    { name: "Banquet Dining", desc: "Elegant catering setups tailored for grand weddings and large corporate events.", icon: "celebration", tags: ["High Volume", "Curated Menus"] },
    { name: "24×7 Room Service", desc: "Late-night cravings or breakfast in bed delivered with swift, premium service.", icon: "room_service", tags: ["In-Room", "Always Available"] },
  ],
  bar: [
    { name: "Luxury Bar", desc: "A refined space stocked with rare single malts, fine wines, and custom spirits.", icon: "wine_bar", tags: ["Premium Spirits", "Elegant Lounge"] },
    { name: "Poolside Bar", desc: "Refreshing mocktails and tropical cocktails to enjoy while relaxing by the water.", icon: "local_bar", tags: ["Leisure", "Scenic"] },
    { name: "Rooftop Lounge", desc: "An open-sky lounge featuring a dynamic bar menu and panoramic twilight views.", icon: "nightlife", tags: ["Live DJ", "Vibrant"] },
    { name: "Mocktail Bar", desc: "Sophisticated non-alcoholic botanicals, cold-press juices, and signature mixes.", icon: "liquor", tags: ["Botanical", "Healthy"] },
    { name: "Premium Beverage Service", desc: "Elite curation of international wines and spirits managed by in-house sommeliers.", icon: "wine_bar", tags: ["Sommelier Select"] },
    { name: "Private VIP Lounge", desc: "A restricted-access enclave for high-profile guests requiring extra privacy.", icon: "vpn_key", tags: ["Discreet", "Top-tier Selection"] },
    { name: "Live Music Lounge", desc: "Unwind with live jazz, acoustic sessions, and classic cocktail menus.", icon: "music_note", tags: ["Live Performance", "Cozy"] },
  ],
  gaming: [
    { name: "Gaming Zone", desc: "A state-of-the-art arcade and digital recreation arena for all ages.", icon: "sports_esports", tags: ["Interactive", "Fun"] },
    { name: "PlayStation 5 Arena", desc: "Ultra-high-definition gaming stations loaded with the latest multiplayer hits.", icon: "videogame_asset", tags: ["4K HDR", "Comfort Seating"] },
    { name: "VR Gaming", desc: "Fully immersive virtual reality pods for advanced simulator gaming experiences.", icon: "vrpano", tags: ["Next-Gen", "Immersive"] },
    { name: "Racing Simulators", desc: "Professional force-feedback steering wheel setups for realistic track racing.", icon: "directions_car", tags: ["F1 Simulator", "High Octane"] },
    { name: "Arcade Games", desc: "Retro cabinet arcade games and pinball tables for nostalgic amusement.", icon: "gamepad", tags: ["Retro Classics", "Token Free"] },
    { name: "Bowling Alley", desc: "Multi-lane professional bowling alleys featuring automatic scoring systems.", icon: "bowling_ball", tags: ["Multi-lane", "Family Friendly"] },
    { name: "Billiards & Snooker", desc: "Championship-grade felt tables set in a classic wood-paneled lounge.", icon: "sports_billiards", tags: ["Premium Cues", "Acoustically Calmed"] },
    { name: "Table Tennis", desc: "Fast-paced indoor table tennis setups with professional-grade paddles and balls.", icon: "sports_tennis", tags: ["High Energy"] },
    { name: "Chess & Carrom Zone", desc: "Quiet tables designed for strategic board games and classic family carrom.", icon: "casino", tags: ["Mind Sports"] },
    { name: "Mini Theatre / Cinema Hall", desc: "A plush private theater with Dolby Atmos surround sound and reclining leather seats.", icon: "movie", tags: ["Dolby Sound", "Private Screenings"] },
  ],
  events: [
    { name: "DJ Dance Floor", desc: "A high-energy club-style dance floor with advanced synchronized laser layouts.", icon: "nightlife", tags: ["Intelligent Lighting", "Club Sound"] },
    { name: "Live Music Stage", desc: "A professional performance stage equipped with top-tier acoustic reinforcement.", icon: "mic", tags: ["Pro Audio", "Backstage Access"] },
    { name: "Concert Area", desc: "Vast lawns designed to host major music festivals, celebrity performances, and concerts.", icon: "theater_comedy", tags: ["Large Scale", "Open Air"] },
    { name: "Open Air Amphitheatre", desc: "Tiered stone seating for cultural acts, theatrical events, and starlit presentations.", icon: "stadium", tags: ["Acoustics", "Outdoor"] },
    { name: "LED Wall Setup", desc: "Massive high-resolution LED screens for cinematic backdrops and live broadcasts.", icon: "tv", tags: ["Ultra HD", "Seamless Display"] },
    { name: "Sound & Lighting System", desc: "State-of-the-art concert-grade PA systems and automated moving head light setups.", icon: "volume_up", tags: ["Pro DMX", "Acoustic Tuning"] },
    { name: "Bonfire Area", desc: "Cozy stone circles for evening fire gatherings, roasting marshmallows, and live music.", icon: "local_fire_department", tags: ["Winter Evenings", "Rustic Charm"] },
    { name: "Fireworks Arrangement", desc: "Spectacular aerial fireworks displays choreographed for weddings and celebrations.", icon: "flare", tags: ["Choreographed", "Licensed Staff"] },
    { name: "Theme Party Venue", desc: "Highly customizable event zones designed for retro, tropical, or luxury masquerade themes.", icon: "celebration", tags: ["Custom Decor", "Immersive"] },
  ],
  wellness: [
    { name: "Modern Gym", desc: "Equipped with high-end cardio machines, strength equipment, and free weights.", icon: "fitness_center", tags: ["Technogym", "24/7 Access"] },
    { name: "Yoga Studio", desc: "A peaceful hardwood floor studio with ambient lighting and professional mats.", icon: "self_improvement", tags: ["Zen Vibe", "Guided Classes"] },
    { name: "Meditation Area", desc: "A quiet outdoor zone by a peaceful water body, designed for deep reflection.", icon: "self_improvement", tags: ["Zen Garden", "Silent Zone"] },
    { name: "Spa & Wellness Center", desc: "An award-winning sanctuary offering holistic therapies and luxurious body wraps.", icon: "spa", tags: ["Organic Products", "Therapists"] },
    { name: "Sauna Room", desc: "Traditional dry heat cedarwood saunas to detoxify and improve circulation.", icon: "detector_smoke", tags: ["Cedarwood", "Detox"] },
    { name: "Steam Bath", desc: "Eucalyptus-infused steam rooms to soothe muscles and clear respiration.", icon: "air", tags: ["Aromatherapy", "Relaxing"] },
    { name: "Massage Therapy Rooms", desc: "Private treatment suites with adjustable massage beds and calming music.", icon: "spa", tags: ["Deep Tissue", "Swedish Massage"] },
    { name: "Personal Trainers", desc: "Certified fitness professionals to curate personalized workouts and nutrition guides.", icon: "person", tags: ["One-on-One", "Custom Plan"] },
  ],
  adventure: [
    { name: "Zip Line", desc: "An exhilarating aerial zip line spanning across the resort's scenic canopy.", icon: "explore", tags: ["Guided", "Safety Harness"] },
    { name: "Wall Climbing", desc: "A 30-foot climbing tower with multiple difficulty levels for beginners and experts.", icon: "terrain", tags: ["Instructional", "Safe Belay"] },
    { name: "Rope Course", desc: "Challenging aerial obstacles, suspended bridges, and balance logs.", icon: "explore", tags: ["Team Building", "High Ropes"] },
    { name: "ATV Bike Rides", desc: "Off-road quad biking tracks through rugged dirt trails and mud curves.", icon: "two_wheeler", tags: ["Quad Bikes", "Instructor Led"] },
    { name: "Archery", desc: "Dedicated archery ranges with professional bows, targets, and expert coaching.", icon: "explore", tags: ["Precision", "Calm Focus"] },
    { name: "Paintball Arena", desc: "A tactical themed paintball arena with bunkers, barricades, and team events.", icon: "sports_kabaddi", tags: ["Tactical Zone", "Gear Provided"] },
    { name: "Obstacle Course", desc: "Military-style ground obstacle courses to test endurance and team agility.", icon: "explore", tags: ["Bootcamp", "Agility"] },
    { name: "Trekking Trails", desc: "Scenic nature walks and hiking trails wrapping around the resort's lush forest boundary.", icon: "hiking", tags: ["Flora & Fauna", "Guided walks"] },
    { name: "Cycling Track", desc: "Dedicated paved tracks with premium mountain bikes available for guest hire.", icon: "directions_bike", tags: ["Scenic Loop", "Helmets Included"] },
  ],
  sports: [
    { name: "Cricket Ground", desc: "A lush green cricket outfield with a professionally maintained pitch and net practice.", icon: "sports_cricket", tags: ["Net Practice", "Floodlights"] },
    { name: "Football Ground", desc: "Natural grass turf field designed for 7-a-side matches and weekend sports.", icon: "sports_soccer", tags: ["Lush Turf"] },
    { name: "Volleyball Court", desc: "Professional sand volleyball courts for high-energy casual matches.", icon: "sports_volleyball", tags: ["Sand Turf", "Evening Play"] },
    { name: "Basketball Court", desc: "Standard hardcourt basketball arenas equipped with professional hoops.", icon: "sports_basketball", tags: ["Acrylic Floor", "Floodlights"] },
    { name: "Badminton Court", desc: "Indoor wooden-floor courts with optimal lighting and premium rackets.", icon: "sports_tennis", tags: ["Indoor", "Wooden Court"] },
    { name: "Lawn Tennis Court", desc: "Synthetic hardcourt tennis courts set in a quiet, manicured enclave.", icon: "sports_tennis", tags: ["Hard Court", "Ball Machine"] },
    { name: "Indoor Sports Arena", desc: "Climate-controlled sports hall hosting table tennis, squash, and basketball.", icon: "stadium", tags: ["A/C Hall"] },
  ],
  family: [
    { name: "Kids Play Zone", desc: "Safe, colorful indoor play spaces with ball pits, slides, and soft toys.", icon: "toys", tags: ["Supervised", "Soft Play"] },
    { name: "Indoor Kids Activities", desc: "Interactive arts, crafts, storytelling sessions, and puzzle challenges.", icon: "palette", tags: ["Creative", "Instructor Led"] },
    { name: "Outdoor Play Area", desc: "Manicured playground structures featuring swings, slides, and climbing frames.", icon: "child_care", tags: ["Lush Lawns", "Safe Play"] },
    { name: "Trampoline Park", desc: "A secure, padded indoor jumping arena for kids to bounce and play.", icon: "explore", tags: ["Safe Padding", "Agility"] },
    { name: "Family Recreation Area", desc: "Lounges loaded with board games, trivia tables, and lounge chairs for families.", icon: "family_restroom", tags: ["All Ages", "Cozy"] },
    { name: "Daycare Facility", desc: "Professional childcare services ensuring your children are cared for safely.", icon: "baby_changing_station", tags: ["Nannies", "Safe Environment"] },
  ],
  accommodation: [
    { name: "Deluxe Rooms", desc: "Elegant rooms featuring contemporary design, workspaces, and plush bedding.", icon: "king_bed", tags: ["King Bed", "Garden View"] },
    { name: "Premium Rooms", desc: "Spacious rooms offering private balconies overlooking the pool or scenic gardens.", icon: "king_bed", tags: ["Balcony", "Mini Bar"] },
    { name: "Luxury Suites", desc: "Grand suites with separate living salons, designer baths, and premium views.", icon: "weekend", tags: ["VIP Lounge Access", "Designer Tub"] },
    { name: "Presidential Suites", desc: "The pinnacle of opulence with two bedrooms, private boardrooms, and personal butler service.", icon: "hotel_class", tags: ["24/7 Butler", "Private Dining"] },
    { name: "Pool Villas", desc: "Detached private villas with individual plunge pools and direct garden access.", icon: "villa", tags: ["Private Plunge Pool"] },
    { name: "Private Cottages", desc: "Rustic-luxe log cottages offering peace, quiet, and beautiful nature views.", icon: "cottage", tags: ["Forest View", "Eco-luxe"] },
    { name: "Family Villas", desc: "Spacious multi-bedroom villas designed for maximum comfort during group stays.", icon: "home", tags: ["Multi-bedroom", "Kitchenette"] },
    { name: "Honeymoon Suites", desc: "Romantic suites featuring canopy beds, private jacuzzis, and bespoke couples dining.", icon: "favorite", tags: ["Couples Jacuzzi", "Bespoke Decor"] },
  ],
  corporate: [
    { name: "Conference Hall", desc: "Grand conference arenas with advanced acoustic wall treatments and smart screens.", icon: "co_present", tags: ["Dolby Sound", "Up to 300 Pax"] },
    { name: "Meeting Rooms", desc: "Boardrooms designed for executive reviews and closed-door presentations.", icon: "groups", tags: ["High-speed WiFi", "Smart Screen"] },
    { name: "Co-working Spaces", desc: "A quiet, productive environment featuring high-speed connectivity and ergonomic seats.", icon: "laptop_mac", tags: ["Silent Zone", "Ergonomic Chairs"] },
    { name: "Business Center", desc: "Full-service administrative hub offering print, scan, courier, and secretarial support.", icon: "business_center", tags: ["Concierge Desk"] },
    { name: "Corporate Event Venue", desc: "Spacious halls and lawns customizable for seminars, product launches, and gala dinners.", icon: "corporate_fare", tags: ["A/V Setup", "Branding Ready"] },
    { name: "Team Building Areas", desc: "Dedicated outdoor arenas designed for adventure-based corporate bonding courses.", icon: "handshake", tags: ["Instructor Led", "ATV & High Ropes"] },
  ],
  wedding: [
    { name: "Grand Banquet Hall", desc: "A magnificent ballroom with crystal chandeliers, perfect for grand Indian weddings.", icon: "nightlife", tags: ["500 Capacity", "A/C Hall"] },
    { name: "Destination Wedding Venue", desc: "A curated package converting the entire resort lawns into a fairytale wedding.", icon: "favorite", tags: ["Resort Buyout", "Bespoke Themes"] },
    { name: "Lawn Wedding Area", desc: "Manicured green fields accommodating massive floral mandaps and open-sky dining.", icon: "park", tags: ["1000+ Capacity", "Scenic Backdrop"] },
    { name: "Pre-Wedding Shoot Locations", desc: "Access to the resort's most photogenic bridges, waterfalls, and pool villas.", icon: "photo_camera", tags: ["Lush Greens", "Golden Hour views"] },
    { name: "Luxury Decoration Services", desc: "Collaborations with top floral designers and light curators for bespoke styling.", icon: "style", tags: ["Custom Mandaps", "Laser Lights"] },
    { name: "Stage Setup", desc: "Spacious main stages equipped with heavy truss setups and LED display screens.", icon: "stadium", tags: ["High Weight Capacity"] },
    { name: "Catering Services", desc: "Gourmet wedding menus featuring live counters, global cuisines, and signature mocktails.", icon: "soup_kitchen", tags: ["Traditional & Modern"] },
  ],
  services: [
    { name: "Valet Parking", desc: "Prompt, secure valet service welcoming you at the resort gates.", icon: "local_parking", tags: ["Secure Lot"] },
    { name: "VIP Parking", desc: "Dedicated high-security parking spaces situated closest to the main entrance.", icon: "local_parking", tags: ["Under Surveillance"] },
    { name: "Airport Transfers", desc: "Chauffeured luxury sedans available for airport pick-ups and drop-offs.", icon: "directions_car", tags: ["BMW/Audi fleet"] },
    { name: "Concierge Service", desc: "On-site curators to arrange local sightseeing, dining reservations, and tickets.", icon: "support_agent", tags: ["24/7 Desk"] },
    { name: "Butler Service", desc: "Dedicated butler service assigned to suites and villas to cater to every request.", icon: "person", tags: ["Personalized", "White-glove"] },
    { name: "24×7 Reception", desc: "Warm hospitality and check-ins/check-outs at any time of day or night.", icon: "desk", tags: ["Express Check-in"] },
    { name: "Luggage Assistance", desc: "Swift, careful handling of your bags from your arrival vehicle to your room.", icon: "work", tags: ["Porter Service"] },
    { name: "Electric Buggy Service", desc: "Eco-friendly buggy transport to zip around the resort's vast lawns.", icon: "electric_car", tags: ["Eco-friendly", "Swift Transit"] },
  ],
  premium: [
    { name: "Drone Photography", desc: "Aerial drone shots documenting your grand event from breathtaking heights.", icon: "photo_camera", tags: ["4K Video", "Licensed Pilots"] },
    { name: "Professional Photography", desc: "Award-winning photographers capturing authentic emotions and premium layouts.", icon: "photo_camera", tags: ["High Res", "Editing Included"] },
    { name: "Sunset Deck", desc: "An elevated deck offering uncompromised views of the setting sun with music.", icon: "deck", tags: ["Scenic views", "Mocktails"] },
    { name: "Lake View Area", desc: "A serene zone bordering a quiet lake, perfect for evening walks and photography.", icon: "water", tags: ["Peaceful", "Twilight lights"] },
    { name: "Private Cabanas", desc: "Secluded poolside cabanas providing private dining, music, and butler service.", icon: "deck", tags: ["Curtained", "Plush Seating"] },
    { name: "Luxury Gazebos", desc: "Beautiful wooden gazebos set in the gardens, perfect for intimate romantic dinners.", icon: "storefront", tags: ["Candlelit Dining"] },
    { name: "Open Sky Dining", desc: "Table setups in the middle of manicured lawns with dynamic lighting overlay.", icon: "dinner_dining", tags: ["Gourmet", "Starlit Sky"] },
    { name: "VIP Event Experiences", desc: "Custom access passes, private lounge seating, and fast-track food queue entries.", icon: "stars", tags: ["Bespoke Concierge"] },
  ],
  safety: [
    { name: "High-Speed WiFi", desc: "Seamless, high-speed internet connectivity across the entire resort campus.", icon: "wifi", tags: ["Fiber Broadband", "Unlimited Devices"] },
    { name: "CCTV Security", desc: "24/7 video surveillance coverage monitoring all public zones and hallways.", icon: "videocam", tags: ["AI Analytics", "Secure Site"] },
    { name: "Medical Assistance", desc: "On-call doctors, first-aid center, and emergency transit arrangements.", icon: "medical_services", tags: ["First Aid Certified"] },
    { name: "Fire Safety Systems", desc: "Comprehensive sprinkler layouts, smoke detectors, and secure emergency exits.", icon: "fire_extinguisher", tags: ["Compliant", "Tested Monthly"] },
    { name: "Power Backup", desc: "Generator setups ensuring uninterrupted climate control and starlit lighting.", icon: "electric_bolt", tags: ["Instant Switchover"] },
    { name: "Secure Lockers", desc: "Digital safe deposit lockers situated inside your room and near changing rooms.", icon: "lock", tags: ["Digital Safes"] },
    { name: "Wheelchair Accessibility", desc: "Step-free ramps, wide elevator doors, and accessible washroom layouts.", icon: "accessible", tags: ["ADA Compliant"] },
  ],
};

function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[28px] p-7 border border-[#E8DCC4]/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(197,168,128,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden border-t-2 border-t-transparent hover:border-t-[#C5A880]">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#C5A880]/10 to-transparent rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#E8DCC4]/40 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-sm shrink-0">
          <span className="material-symbols-outlined text-2xl">{facility.icon}</span>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end max-w-[60%]">
          {facility.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[9px] text-[#8C6D3E] font-bold bg-[#C5A880]/10 border border-[#C5A880]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex-1 flex flex-col justify-end">
        <h3 className="text-lg font-semibold text-[#1F1F1F] tracking-tight group-hover:text-[#8C6D3E] transition-colors duration-300">{facility.name}</h3>
        <p className="text-[13px] text-[#5A5245]/90 mt-2 line-clamp-2 leading-relaxed font-sans">{facility.desc}</p>
      </div>
    </div>
  );
}

export default function FacilitiesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [marqueeText, setMarqueeText] = useState("Infinity Pool • Luxury Suites • Fine Dining • Premium Bar • Gaming Zone • Spa • Adventure Activities • DJ Nights • Destination Weddings • Corporate Events • 500+ Guest Capacity — Everything Under One Roof.");

  useEffect(() => {
    const storedMarquee = localStorage.getItem("cms_marquee_text");
    if (storedMarquee) {
      setMarqueeText(storedMarquee);
    }
  }, []);

  const categoriesList = [
    { id: "all", label: "All Facilities", icon: "widgets" },
    ...CATEGORIES
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar activePage="Facilities" />

      <main className="bg-[#F8F5F0] min-h-screen pt-24 relative overflow-hidden">
        {/* Luxury Backdrop Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#C5A880]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Header / Intro */}
        <header className="pt-24 pb-8 px-6 md:px-20 text-center max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="font-label-caps text-secondary mb-4 block uppercase tracking-widest text-xs font-bold">
              🌟 Resort Facilities & Amenities
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-primary mb-4 leading-[1.1] tracking-[-0.02em] font-semibold">
              The World of The Grand Lounge
            </h1>
            
            {/* Elegant Luxury Flourish Divider */}
            <div className="flex items-center justify-center gap-4 my-6">
              <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A880]/50" />
              <span className="material-symbols-outlined text-[#C5A880] text-xs">grade</span>
              <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A880]/50" />
            </div>

            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Explore our extensive selection of world-class facilities and curated services. From active sports and adventure to starlit dining and wedding curations.
            </p>
          </FadeIn>
        </header>

        {/* Premium Selling Line Marquee */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16 relative z-10">
          <FadeIn>
            <div className="bg-[#1F1F1F] text-[#C5A880] py-5 border border-[#C5A880]/30 rounded-[28px] shadow-lg shadow-black/5 overflow-hidden relative">
              {/* Fade overlays */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1F1F1F] via-[#1F1F1F]/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1F1F1F] via-[#1F1F1F]/80 to-transparent z-10 pointer-events-none" />
              
              <div className="flex whitespace-nowrap overflow-hidden">
                <div className="animate-marquee flex gap-12 text-[10.5px] md:text-xs font-display tracking-[0.15em] uppercase font-semibold">
                  <span>{marqueeText}</span>
                  <span>{marqueeText}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Sticky Filter Pill Bar */}
        <div className="sticky top-20 z-40 max-w-6xl w-full mx-auto mb-16 px-6">
          <FadeIn className="relative w-full bg-white/70 backdrop-blur-xl rounded-[28px] border border-[#E8DCC4]/50 p-2 shadow-[0_8px_30px_rgba(197,168,128,0.06)] flex items-center">
            {/* Left Chevron Scroll Button */}
            <button 
              onClick={() => scroll("left")}
              className="absolute left-4 w-9 h-9 rounded-full bg-white border border-[#E8DCC4]/60 flex items-center justify-center text-[#755a28] shadow-sm hover:bg-[#FDFBF7] hover:scale-105 active:scale-95 transition-all z-20 shrink-0"
              aria-label="Scroll Left"
            >
              <span className="material-symbols-outlined text-lg font-bold">chevron_left</span>
            </button>

            {/* Left/Right scroll fade gradients */}
            <div className="absolute inset-y-0 left-12 w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-12 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div 
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide w-full py-1.5 px-12 scroll-smooth"
            >
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-[20px] font-label-caps text-[10px] tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 border ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-[#B49363] to-[#C5A880] text-white border-transparent font-bold shadow-md shadow-[#C5A880]/30 scale-102"
                      : "text-[#5A5245] border-transparent hover:bg-[#C5A880]/10 hover:text-[#755a28] hover:border-[#C5A880]/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span>{cat.label.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Right Chevron Scroll Button */}
            <button 
              onClick={() => scroll("right")}
              className="absolute right-4 w-9 h-9 rounded-full bg-white border border-[#E8DCC4]/60 flex items-center justify-center text-[#755a28] shadow-sm hover:bg-[#FDFBF7] hover:scale-105 active:scale-95 transition-all z-20 shrink-0"
              aria-label="Scroll Right"
            >
              <span className="material-symbols-outlined text-lg font-bold">chevron_right</span>
            </button>
          </FadeIn>
        </div>

        {/* Facilities Grid View */}
        <section className="px-6 md:px-20 mb-32 max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="space-y-16">
              {activeCategory === "all" ? (
                CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-6">
                    <h2 className="font-display text-2xl font-medium text-[#1F1F1F] flex items-center justify-between border-b border-[#E8DCC4]/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#C5A880] text-2xl bg-[#C5A880]/5 p-2 rounded-xl">{cat.icon}</span>
                        <span className="tracking-tight">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-label-caps text-[#8C6D3E] font-semibold bg-[#C5A880]/10 px-3 py-1 rounded-full">
                        {FACILITIES_DATA[cat.id].length} Facilities
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {FACILITIES_DATA[cat.id].map((f, idx) => (
                        <FacilityCard key={idx} facility={f} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-medium text-[#1F1F1F] flex items-center justify-between border-b border-[#E8DCC4]/40 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#C5A880] text-2xl bg-[#C5A880]/5 p-2 rounded-xl">
                        {CATEGORIES.find((c) => c.id === activeCategory)?.icon || "widgets"}
                      </span>
                      <span className="tracking-tight">{CATEGORIES.find((c) => c.id === activeCategory)?.label || ""}</span>
                    </div>
                    <span className="text-[10px] font-label-caps text-[#8C6D3E] font-semibold bg-[#C5A880]/10 px-3 py-1 rounded-full">
                      {FACILITIES_DATA[activeCategory]?.length || 0} Facilities
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FACILITIES_DATA[activeCategory]?.map((f, idx) => (
                      <FacilityCard key={idx} facility={f} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </>
  );
}