"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MockPaymentModal from "@/components/MockPaymentModal";

interface Enquiry {
  _id: string;
  eventType: string;
  packageSelected: string;
  expectedGuests: number;
  preferredDate: string;
  message: string;
  addOns: string[];
  status: "pending" | "approved" | "rejected" | "confirmed";
  paymentStatus: "unpaid" | "paid";
  paymentOrderId?: string;
  paymentAmount?: number;
  adminNote?: string;
  createdAt: string;
}

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [user, setUser] = useState<{ name?: string; email?: string; id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const router = useRouter();

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/enquiries/my");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (!session || !session.user) {
          router.push("/login");
        } else {
          setUser(session.user);
          await fetchEnquiries();
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // Refetch on window focus and every 5 seconds for real-time feel
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch helper
    fetchEnquiries();

    const handleFocus = () => {
      fetchEnquiries();
    };

    const interval = setInterval(() => {
      fetchEnquiries();
    }, 5000);

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [user]);

  const handlePayment = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string) => {
    if (!selectedEnquiry) return;
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: selectedEnquiry._id,
          paymentMethod,
        }),
      });

      const verifyData = await res.json();
      if (verifyData.success) {
        setIsPaymentModalOpen(false);
        setSelectedEnquiry(null);
        await fetchEnquiries();
      } else {
        alert("Payment verification failed: " + verifyData.error);
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      alert("Something went wrong during payment verification.");
    }
  };

  const pipelineStages = [
    { num: 1, label: "Submitted", desc: "Enquiry Sent" },
    { num: 2, label: "Approved", desc: "Ready for Payment" },
    { num: 3, label: "Payment Done", desc: "Awaiting Confirmation" },
    { num: 4, label: "Booked", desc: "Slot Reserved" },
  ];

  // Helper to map DB status to pipeline steps (1 to 4)
  const getStep = (enq: Enquiry) => {
    if (enq.status === "rejected") return 0;
    if (enq.status === "pending") return 1;
    if (enq.status === "approved" && enq.paymentStatus === "unpaid") return 2;
    if (enq.status === "approved" && enq.paymentStatus === "paid") return 3;
    if (enq.status === "confirmed") return 4;
    return 1;
  };

  const getStatusMessage = (enq: Enquiry) => {
    const step = getStep(enq);
    const dateStr = new Date(enq.preferredDate).toLocaleDateString();
    switch (step) {
      case 1:
        return "We have received your celebration request. Our Curator Desk is reviewing the details.";
      case 2:
        return `Grand news! Your request is approved and your preferred date of ${dateStr} is provisionally secured. Please click "Pay Now" below to complete the deposit of ₹${enq.paymentAmount?.toLocaleString("en-IN")}.`;
      case 3:
        return "Payment received successfully. Our curators are preparing the final booking confirmation.";
      case 4:
        return "Congratulations! Your event space is fully booked and reserved in our master schedule. We await you with pleasure.";
      case 0:
        return `We regret to inform you that we cannot host your event. Reason: ${enq.adminNote || "Scheduling conflict"}.`;
      default:
        return "Reviewing details.";
    }
  };

  const calculateBillAmount = (packageId: string, guestCount: number, addOns?: string[]) => {
    let pricePerPerson = 3999;
    if (packageId === "standard") pricePerPerson = 7499;
    else if (packageId === "premium") pricePerPerson = 14999;
    else if (packageId === "royal-elite") pricePerPerson = 24999;

    const isFullDay = addOns && addOns.includes("Full Day");
    if (isFullDay) {
      pricePerPerson += 699;
    }

    const subtotal = pricePerPerson * guestCount;
    
    let discountPct = 0;
    if (guestCount >= 350) discountPct = 20;
    else if (guestCount >= 200) discountPct = 15;
    else if (guestCount >= 100) discountPct = 10;
    else if (guestCount >= 50) discountPct = 5;

    const discountAmount = Math.round(subtotal * (discountPct / 100));
    return subtotal - discountAmount;
  };

  const getSpaceLabel = (packageSelected: string, eventType: string, addOns?: string[]) => {
    const packageNames: Record<string, string> = {
      basic: "Basic Package",
      standard: "Standard Package",
      premium: "Premium Package",
      "royal-elite": "Royal Elite Package",
    };
    if (packageNames[packageSelected]) {
      return packageNames[packageSelected];
    }
    if (addOns && addOns.includes("The Crystal Ballroom")) return "The Crystal Ballroom";
    if (addOns && addOns.includes("The Terrace Gardens")) return "The Terrace Gardens";
    if (addOns && addOns.includes("Private Lounges")) return "Private Lounges";

    if (eventType === "Wedding" || eventType === "Corporate") return "The Crystal Ballroom";
    if (eventType === "Social") return "The Terrace Gardens";
    return "Private Lounges";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <span className="font-label-caps text-secondary text-xs tracking-widest font-extrabold animate-pulse">SECURE LOADING...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar activePage="My Enquiries" />

      <main className="pt-32 pb-24 px-6 md:px-20 max-w-7xl mx-auto min-h-screen">
        <header className="mb-12 max-w-2xl">
          <span className="font-label-caps text-secondary text-xs font-extrabold tracking-wider">CLIENT PORTAL</span>
          <h1 className="font-display text-4xl md:text-5xl text-primary font-semibold mt-4">
            Celebration Pipeline
          </h1>
          <p className="font-body-lg text-on-surface-variant mt-2">
            Track the status of your bespoke event enquiries and venue availability in real-time.
          </p>
        </header>

        {enquiries.length === 0 ? (
          <section className="text-center py-24 bg-[#FFFFFF] rounded-[40px] border border-secondary/15 max-w-4xl mx-auto">
            <span className="material-symbols-outlined text-secondary text-5xl mb-6">
              celebration
            </span>
            <h3 className="font-display text-2xl text-on-surface font-semibold mb-3">
              No Curations Initiated
            </h3>
            <p className="font-body-md text-[#6B6B6B] max-w-md mx-auto mb-8">
              Begin your journey of celebration with us. Initiate an enquiry for our luxury ballrooms or gardens.
            </p>
            <Link
              href="/booking"
              className="px-10 py-4 bg-primary text-white rounded-full font-label-caps text-xs hover:bg-secondary transition-all font-bold tracking-wider"
            >
              START NEW ENQUIRY
            </Link>
          </section>
        ) : (
          <div className="space-y-12">
            {enquiries.map((enq) => {
              const currentStep = getStep(enq);
              return (
                <section
                  key={enq._id}
                  className="bg-[#FFFFFF] rounded-[40px] p-8 md:p-12 border border-[#E8E2D9] shadow-xl shadow-secondary/5 transition-all hover:border-secondary/25"
                >
                  {/* Card Header Info */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#E8E2D9] gap-4">
                    <div>
                      <span className={`text-[10px] tracking-wider font-extrabold px-3 py-1 rounded-full border ${
                        enq.status === "confirmed" ? "bg-primary text-white border-primary" :
                        enq.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                        enq.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {enq.status === "confirmed" ? "BOOKED" : enq.status.toUpperCase()}
                      </span>
                      <h3 className="font-display text-2xl text-primary font-semibold mt-3">
                        {getSpaceLabel(enq.packageSelected, enq.eventType, enq.addOns)}
                      </h3>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        Enquiry ID: <span className="font-sans font-semibold text-primary">{enq._id}</span> • Sent on {new Date(enq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 min-w-[150px]">
                      <div className="bg-[#F8F5F0] rounded-2xl p-4 border border-[#E8E2D9] shrink-0 text-center w-full">
                        <p className="font-label-caps text-[9px] text-secondary font-bold">ESTIMATED BILL</p>
                        <p className="font-display text-2xl text-primary font-bold mt-1">
                          ₹{(enq.paymentAmount || calculateBillAmount(enq.packageSelected, enq.expectedGuests, enq.addOns)).toLocaleString("en-IN")}
                        </p>
                      </div>
                      {enq.status === "pending" && (
                        <button
                          disabled
                          className="w-full py-2 bg-[#E8E2D9] text-[#6B6B6B]/85 text-[10px] font-label-caps font-bold rounded-full cursor-not-allowed tracking-wider"
                        >
                          PAY NOW (LOCKED)
                        </button>
                      )}
                      {enq.status === "approved" && enq.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => handlePayment(enq)}
                          className="w-full py-2 bg-secondary text-white text-[10px] font-label-caps font-bold rounded-full hover:bg-primary transition-all tracking-wider ring-4 ring-secondary/20 shadow-md animate-pulse"
                        >
                          PAY NOW
                        </button>
                      )}
                      {enq.status === "approved" && enq.paymentStatus === "paid" && (
                        <span className="w-full text-center py-2 bg-green-50 border border-green-200 text-green-700 text-[10px] font-label-caps font-extrabold rounded-full">
                          PAID ✓
                        </span>
                      )}
                      {enq.status === "confirmed" && (
                        <span className="w-full text-center py-2 bg-green-50 border border-green-200 text-green-700 text-[10px] font-label-caps font-extrabold rounded-full">
                          BOOKED ✓
                        </span>
                      )}
                      {enq.status === "rejected" && (
                        <span className="w-full text-center py-2 bg-red-50 border border-red-200 text-red-700 text-[10px] font-label-caps font-extrabold rounded-full">
                          REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking parameters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-b border-[#E8E2D9] text-sm">
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold">EVENT OCCASION</p>
                      <p className="font-body-md text-primary font-semibold mt-1">{enq.eventType}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold">EVENT DATE</p>
                      <p className="font-body-md text-primary font-semibold mt-1">{new Date(enq.preferredDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold">TIME SLOT</p>
                      <p className="font-body-md text-primary font-semibold mt-1">
                        {enq.addOns.includes("Evening Slot") ? "Evening Slot" : enq.addOns.includes("Full Day") ? "Full Day" : "Morning Slot"}
                      </p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold">GUEST COUNT</p>
                      <p className="font-body-md text-primary font-semibold mt-1">{enq.expectedGuests} Guests</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[9px] text-secondary font-bold">PACKAGE</p>
                      <p className="font-body-md text-primary font-semibold mt-1 text-capitalize">{enq.packageSelected}</p>
                    </div>
                  </div>

                  {/* Stepper Pipeline */}
                  {enq.status !== "rejected" && (
                    <div className="py-10">
                      <p className="font-label-caps text-[10px] text-secondary tracking-widest font-extrabold mb-8 text-center md:text-left">
                        CURATION PROGRESS PIPELINE
                      </p>
                      <div className="relative flex flex-col md:flex-row justify-between items-center w-full max-w-4xl mx-auto gap-8 md:gap-4">
                        
                        {/* Connection Bar */}
                        <div className="absolute top-[22px] left-[5%] right-[5%] h-0.5 bg-[#E8E2D9]/60 hidden md:block -z-10" />
                        <div 
                          className="absolute top-[22px] left-[5%] h-0.5 bg-secondary hidden md:block -z-10 transition-all duration-500" 
                          style={{ width: `${((currentStep - 1) / 3) * 90}%` }}
                        />

                        {pipelineStages.map((stage) => {
                          const isCompleted = currentStep > stage.num;
                          const isActive = currentStep === stage.num;

                          return (
                            <div key={stage.num} className="flex flex-row md:flex-col items-center gap-4 md:gap-2.5 text-center flex-1 z-10 w-full md:w-auto">
                              <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-sm transition-all duration-300 ${
                                  isCompleted
                                    ? "bg-primary text-white border-2 border-primary shadow-md scale-105"
                                    : isActive
                                    ? "bg-secondary text-white border-2 border-secondary font-extrabold shadow-md scale-110 ring-4 ring-secondary/20"
                                    : "bg-white text-[#6B6B6B] border-2 border-[#E8E2D9]"
                                }`}
                              >
                                {isCompleted ? (
                                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                                ) : (
                                  stage.num
                                )}
                              </div>

                              <div className="text-left md:text-center flex-1">
                                <p
                                  className={`font-label-caps text-[11px] tracking-wider font-bold ${
                                    isActive ? "text-secondary font-extrabold" : isCompleted ? "text-primary" : "text-[#6B6B6B] opacity-60"
                                  }`}
                                >
                                  {stage.label}
                                </p>
                                <p className="text-[10px] text-[#6B6B6B] opacity-75 mt-0.5 font-medium">
                                  {stage.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Curator Status Message */}
                  <div className={`p-6 rounded-[24px] border flex items-start gap-4 shadow-inner ${
                    enq.status === "rejected" ? "bg-red-50/50 border-red-100" : "bg-[#F8F5F0]/50 border-[#E8E2D9]"
                  }`}>
                    <span className={`material-symbols-outlined text-2xl shrink-0 mt-0.5 ${
                      enq.status === "rejected" ? "text-red-500" : "text-secondary"
                    }`}>
                      {enq.status === "rejected" ? "cancel" : "info"}
                    </span>
                    <div>
                      <p className={`font-label-caps text-[10px] font-extrabold ${enq.status === "rejected" ? "text-red-700" : "text-secondary"}`}>
                        {enq.status === "rejected" ? "REJECTION NOTICE" : "CURATOR REMARK"}
                      </p>
                      <p className="font-body-md text-primary mt-1 font-medium leading-relaxed">
                        {getStatusMessage(enq)}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {selectedEnquiry && (
        <MockPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedEnquiry(null);
          }}
          onSuccess={handlePaymentSuccess}
          amount={selectedEnquiry.paymentAmount || 20000}
          enquiryId={selectedEnquiry._id}
          eventDetails={{
            eventType: selectedEnquiry.eventType,
            date: new Date(selectedEnquiry.preferredDate).toLocaleDateString(),
            guests: selectedEnquiry.expectedGuests,
          }}
        />
      )}
    </>
  );
}
