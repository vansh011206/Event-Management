"use client";

import { useState, useEffect } from "react";

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentMethod: string) => void;
  amount: number;
  enquiryId: string;
  eventDetails: {
    eventType: string;
    date: string;
    guests: number;
    packageName?: string;
    packageEmoji?: string;
    pricePerPerson?: number;
    discountPct?: number;
    discountAmount?: number;
    subtotal?: number;
  };
}

export default function MockPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  enquiryId,
  eventDetails,
}: MockPaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [loadingStep, setLoadingStep] = useState(0);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardFocus, setCardFocus] = useState(false);

  // UPI state
  const [upiId, setUpiId] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState<"idle" | "verifying" | "verified">("idle");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);

  // Net banking state
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setActiveTab("upi");
      setPaymentState("idle");
      setLoadingStep(0);
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      setCardName("");
      setUpiId("");
      setIsUpiVerified("idle");
      setSelectedUpiApp(null);
      setSelectedBank("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    // Format card number with spaces every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const verifyUpiId = () => {
    if (!upiId || !upiId.includes("@")) return;
    setIsUpiVerified("verifying");
    setTimeout(() => {
      setIsUpiVerified("verified");
    }, 1200);
  };

  const handlePay = () => {
    setPaymentState("processing");
    setLoadingStep(1);

    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      setLoadingStep(currentStep);
      if (currentStep > 4) {
        clearInterval(interval);
        setPaymentState("success");
        setTimeout(() => {
          onSuccess(activeTab);
        }, 1500);
      }
    }, 1000);
  };

  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\D/g, "");
    if (cleanNum.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(cleanNum)) return "mastercard";
    if (/^6(0|5)/.test(cleanNum)) return "rupay";
    return "generic";
  };

  const isFormValid = () => {
    if (activeTab === "upi") {
      return isUpiVerified === "verified" || selectedUpiApp !== null;
    }
    if (activeTab === "card") {
      return (
        cardNumber.replace(/\s/g, "").length === 16 &&
        cardExpiry.length === 5 &&
        cardCvv.length === 3 &&
        cardName.trim().length > 2
      );
    }
    if (activeTab === "netbanking") {
      return selectedBank !== "";
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(140px); }
        }
        .qr-scanner-line {
          animation: scan 2.5s infinite ease-in-out;
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-[#FCFAF7] rounded-[32px] border border-[#E8E2D9] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Loading overlay for payment processing */}
        {paymentState === "processing" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFAF7]/95 px-6">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin"></div>
              <span className="material-symbols-outlined text-secondary text-4xl animate-pulse">lock</span>
            </div>
            <h3 className="font-display text-2xl text-primary font-bold mb-2">Processing Payment</h3>
            <p className="font-sans text-xs tracking-widest text-secondary font-bold uppercase mb-4">SECURE TRANSACTION</p>
            <div className="w-64 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-secondary transition-all duration-1000 ease-out" 
                style={{ width: `${(loadingStep / 4) * 100}%` }}
              ></div>
            </div>
            <p className="font-body-md text-primary/75 font-semibold text-center italic">
              {loadingStep === 1 && "Contacting secure payment gateway..."}
              {loadingStep === 2 && "Authenticating transaction tokens..."}
              {loadingStep === 3 && "Authorizing amount with bank gateway..."}
              {loadingStep === 4 && "Finalizing booking confirmation..."}
            </p>
          </div>
        )}

        {/* Success overlay */}
        {paymentState === "success" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFAF7] px-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-200 animate-bounce">
              <span className="material-symbols-outlined text-5xl font-bold">check</span>
            </div>
            <h3 className="font-display text-3xl text-primary font-bold mb-2">Payment Confirmed</h3>
            <p className="font-label-caps text-xs tracking-wider text-green-700 font-extrabold mb-4">BOOKING PAYMENT SECURED ✓</p>
            <p className="font-body-md text-on-surface-variant max-w-sm">
              Your booking is confirmed. We have sent a confirmation email to your registered account.
            </p>
          </div>
        )}

        {/* Left Side: Order & Event Details Summary */}
        <div className="w-full md:w-2/5 bg-[#F6F1E9] p-8 border-b md:border-b-0 md:border-r border-[#E8E2D9] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">home_pin</span>
              </div>
              <span className="font-label-caps text-xs font-bold tracking-widest text-primary">THE GRAND LOUNGE</span>
            </div>

            {/* Package Info */}
            {eventDetails.packageName && (
              <div className="mb-6 p-4 bg-white/60 rounded-2xl border border-[#E8E2D9]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{eventDetails.packageEmoji || "📦"}</span>
                  <span className="font-display text-lg text-primary font-bold">{eventDetails.packageName}</span>
                </div>
                <p className="text-[10px] text-secondary font-bold tracking-wider ml-8">
                  ₹{(eventDetails.pricePerPerson || 0).toLocaleString("en-IN")} × {eventDetails.guests} guests
                </p>
              </div>
            )}

            <span className="font-label-caps text-[10px] text-secondary font-extrabold tracking-wider">TOTAL PAYABLE AMOUNT</span>
            <div className="flex items-baseline mt-1 mb-6">
              <span className="font-display text-4xl font-bold text-primary">₹{amount.toLocaleString("en-IN")}</span>
              <span className="text-xs text-[#6B6B6B] ml-2 font-medium">INR</span>
            </div>

            {/* Price breakdown */}
            {eventDetails.subtotal && eventDetails.subtotal > 0 && (
              <div className="space-y-2 border-t border-[#E8E2D9] pt-4 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Subtotal</span>
                  <span className="font-semibold text-primary">₹{eventDetails.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {(eventDetails.discountPct || 0) > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">local_offer</span>
                      Group Discount ({eventDetails.discountPct}%)
                    </span>
                    <span className="font-semibold">−₹{(eventDetails.discountAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E8E2D9] font-bold text-primary">
                  <span>Total</span>
                  <span>₹{amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            <div className="space-y-4 border-t border-[#E8E2D9] pt-6 text-sm">
              <div>
                <p className="font-label-caps text-[9px] text-secondary font-bold">BOOKING REF</p>
                <p className="font-sans font-semibold text-primary mt-0.5">{enquiryId}</p>
              </div>
              <div>
                <p className="font-label-caps text-[9px] text-secondary font-bold">EVENT OCCASION</p>
                <p className="font-body-md text-primary font-semibold mt-0.5">{eventDetails.eventType}</p>
              </div>
              <div>
                <p className="font-label-caps text-[9px] text-secondary font-bold">RESERVED DATE</p>
                <p className="font-body-md text-primary font-semibold mt-0.5">{eventDetails.date}</p>
              </div>
              <div>
                <p className="font-label-caps text-[9px] text-secondary font-bold">EXPECTED GUESTS</p>
                <p className="font-body-md text-primary font-semibold mt-0.5">{eventDetails.guests} Guests</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
            <div className="flex items-center gap-3 text-xs text-[#6B6B6B] opacity-80 mb-2">
              <span className="material-symbols-outlined text-lg text-secondary">verified_user</span>
              <span>256-bit SSL encrypted connection</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6B6B6B] opacity-80">
              <span className="material-symbols-outlined text-lg text-secondary">shield</span>
              <span>PCI-DSS compliant sandbox mode</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Selection & Inputs */}
        <div className="w-full md:w-3/5 p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-none">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl text-primary font-bold">Select Payment Method</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#E8E2D9] flex items-center justify-center text-primary/75 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F1EBE3] rounded-xl mb-6">
              {(["upi", "card", "netbanking"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-3 rounded-lg text-xs font-label-caps font-bold transition-all ${
                    activeTab === tab 
                      ? "bg-white text-secondary shadow-sm" 
                      : "text-primary/60 hover:text-primary"
                  }`}
                >
                  {tab === "upi" && "UPI"}
                  {tab === "card" && "CARD"}
                  {tab === "netbanking" && "NET BANKING"}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: UPI */}
            {activeTab === "upi" && (
              <div className="space-y-6">
                <div>
                  <label className="block font-label-caps text-[9px] text-secondary font-bold mb-3">POPULAR UPI APPS</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "gpay", name: "Google Pay", color: "bg-blue-50 border-blue-200 text-blue-600", logoIcon: "payments" },
                      { id: "phonepe", name: "PhonePe", color: "bg-purple-50 border-purple-200 text-purple-600", logoIcon: "account_balance_wallet" },
                      { id: "paytm", name: "Paytm", color: "bg-sky-50 border-sky-200 text-sky-600", logoIcon: "credit_card" }
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          setSelectedUpiApp(app.id);
                          setIsUpiVerified("idle");
                          setUpiId("");
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                          selectedUpiApp === app.id
                            ? "border-secondary bg-[#FDFBF7] ring-2 ring-secondary/20 shadow-sm"
                            : "border-[#E8E2D9] hover:bg-[#FDFBF7]"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-2xl mb-1 ${app.color}`}>
                          {app.logoIcon}
                        </span>
                        <span className="font-sans text-[11px] font-bold text-primary">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-[#E8E2D9]"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-label-caps text-[#6B6B6B] font-bold tracking-wider">OR ENTER UPI ID</span>
                  <div className="flex-grow border-t border-[#E8E2D9]"></div>
                </div>

                <div>
                  <label className="block font-label-caps text-[9px] text-secondary font-bold mb-2">UPI ID</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi or name@okaxis"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setSelectedUpiApp(null);
                          setIsUpiVerified("idle");
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary placeholder-primary/30 focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none"
                      />
                      {isUpiVerified === "verified" && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-600 font-bold">
                          check_circle
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={verifyUpiId}
                      disabled={!upiId || !upiId.includes("@") || isUpiVerified === "verifying"}
                      className={`px-4 py-2 text-xs font-label-caps font-bold rounded-xl transition-all ${
                        isUpiVerified === "verified"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-primary text-white hover:bg-secondary disabled:opacity-50"
                      }`}
                    >
                      {isUpiVerified === "verifying" && "VERIFYING..."}
                      {isUpiVerified === "verified" && "VERIFIED"}
                      {isUpiVerified === "idle" && "VERIFY"}
                    </button>
                  </div>
                  {isUpiVerified === "verified" && (
                    <p className="text-[10px] text-green-700 font-bold mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">person</span> Verified: {upiId.split("@")[0].toUpperCase()} SHARMA
                    </p>
                  )}
                </div>

                {selectedUpiApp && (
                  <div className="p-4 bg-[#F8F5F0] rounded-2xl border border-[#E8E2D9] flex gap-4 items-center animate-fade-in">
                    {/* Simulated QR Code */}
                    <div className="relative w-20 h-20 bg-white border border-[#E8E2D9] rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-[radial-gradient(#C5A880_2px,transparent_2px)] [background-size:6px_6px]"></div>
                      <div className="absolute top-2 left-2 right-2 bottom-2 border border-secondary/20 rounded"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md">
                        <span className="material-symbols-outlined text-sm text-secondary">qr_code_2</span>
                      </div>
                      {/* Scanning Laser Line */}
                      <div className="qr-scanner-line absolute left-0 right-0 h-0.5 bg-secondary shadow shadow-secondary/80"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">Scan QR Code or Open App</p>
                      <p className="text-[10px] text-[#6B6B6B] mt-1 leading-relaxed">
                        A transaction request has been pushed. Scan the QR code or approve the notification in your {selectedUpiApp.toUpperCase()} app.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CARD */}
            {activeTab === "card" && (
              <div className="space-y-5">
                {/* Credit Card Digital Mock Preview */}
                <div className="w-full h-44 bg-gradient-to-br from-[#3D2C1E] via-[#5C4533] to-[#241A12] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-white/5 pointer-events-none"></div>
                  <div className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-white/5 pointer-events-none"></div>

                  <div className="flex justify-between items-start">
                    <span className="font-label-caps text-[9px] tracking-widest text-white/60">THE GRAND LOUNGE VIP</span>
                    {getCardType(cardNumber) === "visa" && (
                      <span className="text-lg font-bold italic tracking-wider text-white/90">VISA</span>
                    )}
                    {getCardType(cardNumber) === "mastercard" && (
                      <span className="text-lg font-bold italic tracking-wider text-white/90">Mastercard</span>
                    )}
                    {getCardType(cardNumber) === "rupay" && (
                      <span className="text-lg font-bold italic tracking-wider text-white/90">RuPay</span>
                    )}
                    {getCardType(cardNumber) === "generic" && (
                      <span className="text-lg font-bold italic tracking-wider text-white/40">CARD</span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Card Number</p>
                    <p className="font-mono text-lg tracking-widest">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5">Cardholder</p>
                      <p className="font-sans text-xs tracking-wider font-semibold truncate max-w-[150px]">
                        {cardName.toUpperCase() || "YOUR NAME"}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5">Expires</p>
                        <p className="font-mono text-xs font-semibold">
                          {cardExpiry || "MM/YY"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5">CVV</p>
                        <p className="font-mono text-xs font-semibold">
                          {cardFocus ? cardCvv : "•••"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-label-caps text-[9px] text-secondary font-bold mb-1">CARDHOLDER NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. VANSHAJ SHARMA"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary placeholder-primary/30 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[9px] text-secondary font-bold mb-1">CARD NUMBER</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary placeholder-primary/30 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary opacity-60">
                        credit_card
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-[9px] text-secondary font-bold mb-1">EXPIRY DATE</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary placeholder-primary/30 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[9px] text-secondary font-bold mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        onFocus={() => setCardFocus(true)}
                        onBlur={() => setCardFocus(false)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary placeholder-primary/30 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NET BANKING */}
            {activeTab === "netbanking" && (
              <div className="space-y-6">
                <div>
                  <label className="block font-label-caps text-[9px] text-secondary font-bold mb-3">POPULAR BANKS</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "hdfc", name: "HDFC Bank" },
                      { id: "sbi", name: "State Bank of India" },
                      { id: "icici", name: "ICICI Bank" },
                      { id: "axis", name: "Axis Bank" },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          selectedBank === bank.id
                            ? "border-secondary bg-[#FDFBF7] ring-2 ring-secondary/20 shadow-sm font-bold text-secondary"
                            : "border-[#E8E2D9] hover:bg-[#FDFBF7] text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg text-secondary">
                          account_balance
                        </span>
                        <span className="font-sans text-xs font-semibold">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[9px] text-secondary font-bold mb-2">ALL OTHER BANKS</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-white text-sm text-primary outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                  >
                    <option value="">-- Choose your Bank --</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="indusind">IndusInd Bank</option>
                    <option value="idbi">IDBI Bank</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handlePay}
              disabled={!isFormValid() || paymentState !== "idle"}
              className="w-full py-4 bg-secondary text-white font-label-caps text-xs font-bold rounded-full hover:bg-primary transition-all tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-secondary/10 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm font-bold">lock</span>
              CONFIRM & PAY ₹{amount.toLocaleString("en-IN")}
            </button>
            <p className="text-[10px] text-center text-[#6B6B6B] mt-3">
              By paying, you confirm your event booking and authorize the payment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
