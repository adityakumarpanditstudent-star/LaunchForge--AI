"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Search, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const steps = [
  "Checking transaction",
  "Confirming details",
  "Verifying UTR number",
  "Activating your plan"
];

function ProcessingContent() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!userId) {
      router.push('/pricing');
      return;
    }

    // 1. Simulate step transitions
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 5000);

    // 2. Real-time subscription to payment status
    const channel = supabase
      .channel('payment_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new.status === 'success') {
            setStatus("success");
            clearInterval(stepInterval);
          } else if (payload.new.status === 'failed') {
            setStatus("failed");
            clearInterval(stepInterval);
          }
        }
      )
      .subscribe();

    // 3. Fallback polling every 10 seconds
    const pollInterval = setInterval(async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.status === 'success') {
        setStatus("success");
        clearInterval(pollInterval);
        clearInterval(stepInterval);
      }
    }, 10000);

    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
      clearInterval(stepInterval);
    };
  }, [userId, router]);

  return (
    <div className="max-w-md w-full text-center">
      <AnimatePresence mode="wait">
        {status === "processing" ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8"
          >
            <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <Search className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Verifying Your Payment...</h1>
              <p className="text-gray-400">
                We're confirming your transaction details. This usually takes 5-30 minutes.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-left">
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : idx === currentStep ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/10" />
                  )}
                  <span className={idx === currentStep ? "text-white font-medium" : "text-gray-500"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-6 glass rounded-2xl border border-white/5 flex items-center gap-4 text-sm text-gray-400">
              <ShieldCheck className="w-6 h-6 text-blue-500/50" />
              <p>Secure UPI verification system in progress. Feel free to stay on this page or come back later.</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 uppercase tracking-widest font-bold">
              <Clock className="w-3 h-3" />
              Estimated time: 5-10 mins
            </div>
          </motion.div>
        ) : status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Your Plan is Active 🚀</h1>
              <p className="text-gray-400 text-lg">
                Congratulations! Your premium features are now unlocked. Ready to launch something amazing?
              </p>
            </div>

            <GlassCard className="bg-blue-600/5 border-blue-500/20">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold">Premium Features Unlocked</h4>
                  <p className="text-xs text-gray-500">Unlimited generations, priority support, and more.</p>
                </div>
              </div>
            </GlassCard>

            <Button variant="glow" size="lg" className="w-full h-16 text-xl" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-red-500/50">
              <div className="text-red-500 text-4xl font-bold">!</div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Verification Failed</h1>
              <p className="text-gray-400">
                We couldn't verify your transaction. Please check your UTR number and try again or contact support.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => router.push('/payment')}>
              Retry Payment
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Status...</p>
          </div>
        }>
          <ProcessingContent />
        </Suspense>
      </main>
    </div>
  );
}
