export interface Booking {
  id: string;
  space: string;
  occasion: string;
  guests: string;
  date: string;
  slot?: string;
  rate: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed" | "Confirmed";
  step: number;
  timestamp: string;
  interest?: string;
  avatarText?: string;
  bg?: string;
  paymentStatus?: "unpaid" | "paid";
  packageSelected?: string;
  estimatedBill?: number;
  paymentAmount?: number;
}

export interface Package {
  id: string;
  name: string;
  tier: string;
  price: string;
  desc: string;
  capacity: string;
  services: string[];
  image: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  occasion: string;
  status: "Pending" | "Approved" | "Featured";
}

export interface GalleryItem {
  id: string;
  title: string;
  album: string;
  image: string;
  featured: boolean;
}
