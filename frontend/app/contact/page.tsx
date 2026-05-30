"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("The Ballroom Gala");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setEmail("");
      setEventType("The Ballroom Gala");
      setDate("");
      setMessage("");
    }, 5000);
  };

  return (
    <>
      <Navbar activePage="Contact" />

      <main className="min-h-screen bg-background pt-24 md:pt-0">
        <section className="flex flex-col md:flex-row min-h-screen">
          {/* Left Side: Immersive Atmospheric Visual */}
          <div className="w-full md:w-[45%] h-[400px] md:h-screen relative overflow-hidden group">
            <img
              alt="The Grand Lounge Entrance"
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNGK-WmRzVjgqwzvK6avJ_lGhHVI0LKGb4i0SKuKg6CiHnXyw6-PLzgFw2sIQGc9z_YNAnnXinKEQLYwyY1ASm7Wat5yNBIy3ZAJMSnwiNQV6hnNxignJWfUH2escpeh_bXZpf_6HGaQEMmOWpUqOEz13vCBUim2b9p9bamDOTbd6mHyOqc8EFBn9guPuljnsx05-YCYYmKFnYlY_bJ7qrrfTJpYpUcrEl1hSpOobGB29xLUNkSNNxTvR0oAbjJVsC-gm1zi2cJlI"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-6 md:left-20 text-white z-10">
              <p className="font-label-caps text-xs uppercase tracking-widest opacity-80 mb-2">
                Exclusivity Redefined
              </p>
              <h2 className="font-headline-lg text-4xl md:text-5xl italic leading-tight">
                The Art of<br />Gathering.
              </h2>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full md:w-[55%] flex flex-col justify-center bg-[#f8f5f0] px-6 md:px-20 py-20">
            <div className="max-w-xl mx-auto md:mx-0 w-full">
              <header className="mb-12">
                <span className="font-label-caps text-secondary mb-4 block text-xs">
                  INQUIRE
                </span>
                <h1 className="font-display text-4xl md:text-5xl text-primary mb-4 leading-tight">
                  Begin Your Story
                </h1>
                <p className="font-body-lg text-on-surface-variant max-w-md">
                  From intimate soirees to grand celebrations, our dedicated curators are ready to bring your vision to life.
                </p>
              </header>

              {isSubmitted ? (
                <div className="bg-surface p-8 rounded-editorial border border-secondary/20 text-center animate-fade-in">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4">
                    check_circle
                  </span>
                  <h3 className="font-headline-md text-2xl text-primary mb-2">
                    Inquiry Received
                  </h3>
                  <p className="font-body-md text-on-surface-variant">
                    Thank you. A curator will reach out to you shortly to begin planning your event.
                  </p>
                </div>
              ) : (
                <form className="space-y-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Name */}
                    <div className="border-b border-[#cdc5ba] focus-within:border-primary transition-all pb-2">
                      <label className="block font-headline-md text-sm text-secondary mb-1 italic">
                        Name
                      </label>
                      <input
                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-on-surface placeholder:text-outline-variant/40"
                        placeholder="Elias Thorne"
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    {/* Email */}
                    <div className="border-b border-[#cdc5ba] focus-within:border-primary transition-all pb-2">
                      <label className="block font-headline-md text-sm text-secondary mb-1 italic">
                        Email Address
                      </label>
                      <input
                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-on-surface placeholder:text-outline-variant/40"
                        placeholder="elias@example.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* Event Type */}
                    <div className="border-b border-[#cdc5ba] focus-within:border-primary transition-all pb-2">
                      <label className="block font-headline-md text-sm text-secondary mb-1 italic">
                        Event Type
                      </label>
                      <select
                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-on-surface appearance-none"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <option>The Ballroom Gala</option>
                        <option>The Garden Soiree</option>
                        <option>Corporate Retreat</option>
                        <option>Private Lounge Dining</option>
                      </select>
                    </div>
                    {/* Preferred Date */}
                    <div className="border-b border-[#cdc5ba] focus-within:border-primary transition-all pb-2">
                      <label className="block font-headline-md text-sm text-secondary mb-1 italic">
                        Preferred Date
                      </label>
                      <input
                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-on-surface placeholder:text-outline-variant/40"
                        placeholder="December 2024"
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Tell us about your vision */}
                  <div className="border-b border-[#cdc5ba] focus-within:border-primary transition-all pb-2">
                    <label className="block font-headline-md text-sm text-secondary mb-1 italic">
                      Tell us about your vision
                    </label>
                    <textarea
                      className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-on-surface placeholder:text-outline-variant/40 resize-none"
                      placeholder="Share a few details..."
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <button
                      className="group relative bg-primary text-on-primary px-12 py-5 rounded-full font-label-caps text-xs overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
                      type="submit"
                    >
                      <span className="relative z-10">Send Inquiry</span>
                      <div className="absolute inset-0 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 opacity-20"></div>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="px-6 md:px-20 py-24 flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
          <div className="w-full md:w-1/3 flex flex-col justify-end pb-6">
            <h3 className="font-headline-lg text-3xl md:text-4xl text-primary mb-6">
              Our Sanctuary
            </h3>
            <div className="space-y-6">
              <div>
                <p className="font-label-caps text-secondary mb-2 text-xs">
                  Location
                </p>
                <p className="font-body-lg text-on-surface">
                  14 Grand Vista Estate, Ridge Road,<br />Udaipur, Rajasthan 313001
                </p>
              </div>
              <div>
                <p className="font-label-caps text-secondary mb-2 text-xs">
                  Connect
                </p>
                <p className="font-body-lg text-on-surface">
                  +91 (294) 555-0192<br />curate@grandlounge.in
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 h-[450px] relative rounded-editorial overflow-hidden shadow-2xl shadow-secondary/10 group">
            {/* Custom Grayscale Map Image */}
            <div className="absolute inset-0 filter grayscale contrast-105 brightness-95 sepia-[10%]">
              <img
                className="w-full h-full object-cover"
                alt="Estate Location Map Udaipur"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOL-Wkt25xyi1Oi8L4MruP-yVI2Tfltx3KZoHVCsiQ18hmBWKupVX5pIAm6gJT6SnGFj_mwHcn-2M1UphdnoxHykdM_DIQHlqa1E3cgUH_GXDyJCMlboIdv-zGaLI5jEfPmwC_xQ5sFeWNP4q-uV19tbDMIagZ9pW2qln1ksnZHINeMFs7hTVHPoN5IFIfX66I7syEbs_-fjxpIvsZGs9DoObJyXpLsEFH_OIqitdNhx_IMLGQjSDsKvrfJFN0TNFTufgBTL9-dkA"
              />
            </div>
            {/* Gold Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                <span className="material-symbols-outlined text-[24px]">
                  location_on
                </span>
              </div>
              <div className="mt-4 bg-surface px-6 py-2 rounded-full shadow-md">
                <span className="font-label-caps text-primary text-xs font-bold">
                  The Grand Lounge
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}