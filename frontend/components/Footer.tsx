import Link from "next/link";
import FadeIn from "./FadeIn";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand — spans 4 cols */}
          <FadeIn className="md:col-span-4 flex flex-col gap-5">
            <Link
              href="/"
              className="font-display text-[24px] md:text-[28px] text-primary tracking-tight font-semibold"
            >
              The Grand Lounge
            </Link>
            <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant max-w-xs">
              Redefining luxury events through the lens of Indian heritage and
              contemporary minimalist design.
            </p>
          </FadeIn>

          {/* Explore */}
          <FadeIn delay={100} className="md:col-span-2 md:col-start-6 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-secondary font-semibold mb-1">
              Explore
            </span>
            <Link
              href="/facilities"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Facilities
            </Link>
            <Link
              href="/packages"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Packages
            </Link>
            <Link
              href="/gallery"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Gallery
            </Link>
          </FadeIn>

          {/* Legal */}
          <FadeIn delay={200} className="md:col-span-2 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-secondary font-semibold mb-1">
              Legal
            </span>
            <a
              href="#"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </a>
          </FadeIn>

          {/* Company */}
          <FadeIn delay={300} className="md:col-span-2 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-secondary font-semibold mb-1">
              Company
            </span>
            <a
              href="#"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Careers
            </a>
            <a
              href="#"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Press Kit
            </a>
            <Link
              href="/contact"
              className="font-sans text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Contact
            </Link>
          </FadeIn>
        </div>

        {/* Copyright bottom bar */}
        <div className="mt-16 pt-8 border-t border-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[12px] text-on-surface-variant">
            © {currentYear} The Grand Lounge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-lg" data-icon="share">
              share
            </span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-lg" data-icon="public">
              public
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}