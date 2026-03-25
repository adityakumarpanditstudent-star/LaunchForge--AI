"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  Info,
  QrCode,
  Copy,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planRequested = searchParams.get('plan') || 'pro';
  const billingCycle = (searchParams.get('billing') as "monthly" | "yearly") || 'monthly';
  
  // Calculate amount based on plan and billing cycle
  const getAmount = () => {
    if (planRequested === 'pro') {
      return billingCycle === 'monthly' ? 199 : 1990;
    }
    if (planRequested === 'premium') {
      return billingCycle === 'monthly' ? 399 : 3990;
    }
    return 0;
  };

  const amount = getAmount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiId] = useState("9304371915@fam");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    utr: "",
  });

  useEffect(() => {
    // If it's starter plan, maybe redirect or handle differently
    // For now, let's keep it but show 0
  }, [planRequested]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please login to continue payment");
        router.push('/login');
        return;
      }

      // 2. Insert payment record
      const { error } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user.id,
            plan_requested: planRequested,
            billing_cycle: billingCycle,
            amount: amount,
            utr_number: formData.utr,
            status: 'processing'
          }
        ]);

      if (error) throw error;

      // 3. Redirect to processing page
      router.push(`/payment/processing?user_id=${user.id}`);
    } catch (error: any) {
      console.error("Payment submission error:", error.message);
      alert("Error submitting payment details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const upiLink = `upi://pay?pa=${upiId}&pn=LaunchForge%20AI&cu=INR&am=${amount}`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    alert("UPI ID Copied!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Secure Payment</h1>
        <p className="text-gray-400">Upgrade to LaunchForge {planRequested.charAt(0).toUpperCase() + planRequested.slice(1)} and unlock the power of AI.</p>
      </header>

      <AnimatePresence mode="wait">
        <motion.div 
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* QR Section (FamApp Style) */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
              
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-center">Scan or Tap to Pay</h3>
              <p className="text-gray-500 text-sm mb-4 text-center">Open any UPI app to pay</p>
              <p className="text-blue-400 font-bold mb-4">₹{amount} for {planRequested.toUpperCase()} Plan</p>
              
              <a 
                href={upiLink}
                className="relative w-56 h-56 bg-white p-4 rounded-3xl mb-8 overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer"
              >
                {/* Dynamic QR Code Generator */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-bold bg-blue-600 px-3 py-1 rounded-full">Open in App</p>
                </div>
              </a>

              <div className="w-full space-y-4">
                <Button 
                  variant="glow" 
                  className="w-full py-4 h-auto text-lg mb-2 lg:hidden"
                  onClick={() => window.location.href = upiLink}
                >
                  Pay via UPI App
                </Button>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">UPI ID</p>
                    <p className="font-mono text-sm">{upiId}</p>
                  </div>
                  <button 
                    onClick={copyUpi}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 text-sm text-gray-400">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <p>Payments are 100% secure and encrypted. Your subscription will be activated within 2-4 hours.</p>
            </div>
          </div>

          {/* Verification Form */}
          <div className="space-y-6">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" /> Verify Payment
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Transaction ID (UTR)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter 12-digit UTR number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.utr}
                    onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Upload Screenshot</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-gray-600 group-hover:text-blue-400 mx-auto mb-4 transition-colors" />
                    <p className="text-sm text-gray-500 group-hover:text-gray-300">Click to upload or drag & drop</p>
                    <p className="text-[10px] text-gray-600 mt-2">PNG, JPG or PDF up to 10MB</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="glow" 
                  className="w-full py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                    </div>
                  ) : "Submit Payment Details"}
                </Button>
              </form>
            </GlassCard>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-xs leading-relaxed">
              <strong>Note:</strong> Do not close this page after payment. Once submitted, our team will verify your transaction and activate your features.
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Payment() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Payment...</p>
          </div>
        }>
          <PaymentContent />
        </Suspense>
      </main>
    </div>
  );
}
