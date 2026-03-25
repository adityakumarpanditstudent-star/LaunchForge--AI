"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Loader2, 
  ShieldCheck, 
  Search, 
  ExternalLink 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Payment {
  id: string;
  user_id: string;
  plan_requested: string;
  amount: number;
  utr_number: string;
  screenshot_url: string;
  status: string;
  created_at: string;
  user_email?: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users:user_id (email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error.message);
    } else {
      setPayments(data.map(p => ({
        ...p,
        user_email: p.users?.email
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (paymentId: string, userId: string, plan: string) => {
    setIsProcessing(paymentId);
    try {
      // 1. Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'success' })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // 2. Update user plan
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          plan: plan,
          trial_active: false
        })
        .eq('id', userId);

      if (userError) throw userError;

      alert("Payment Approved Successfully!");
      fetchPayments();
    } catch (error: any) {
      console.error("Error approving payment:", error.message);
      alert("Failed to approve payment.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to reject this payment?")) return;
    
    setIsProcessing(paymentId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentId);

      if (error) throw error;
      
      alert("Payment Rejected.");
      fetchPayments();
    } catch (error: any) {
      console.error("Error rejecting payment:", error.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              Admin Verification Panel
            </h1>
            <p className="text-gray-400">Review and approve manual UPI transactions.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPayments}>
            Refresh Data
          </Button>
        </header>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <GlassCard className="text-center py-20">
              <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-500">No Payments Found</h3>
              <p className="text-gray-600">When users submit payments, they will appear here.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <GlassCard className={`p-6 border border-white/5 transition-all ${
                      payment.status === 'success' ? 'bg-green-500/5 border-green-500/20' : 
                      payment.status === 'failed' ? 'bg-red-500/5 border-red-500/20' : 'hover:border-white/10'
                    }`}>
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            payment.status === 'success' ? 'bg-green-500/20 text-green-500' :
                            payment.status === 'failed' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {payment.plan_requested.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{payment.user_email}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                payment.status === 'success' ? 'bg-green-500/20 text-green-500' :
                                payment.status === 'failed' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/10 text-blue-400 animate-pulse'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              UTR: <span className="font-mono text-gray-300">{payment.utr_number}</span> • ₹{payment.amount}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right mr-4 hidden sm:block">
                            <p className="text-xs text-gray-500">Requested Plan</p>
                            <p className="font-bold text-sm text-blue-400">{payment.plan_requested.toUpperCase()}</p>
                          </div>

                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" /> Screenshot
                          </Button>

                          {payment.status === 'processing' && (
                            <div className="flex items-center gap-2 border-l border-white/5 pl-4 ml-2">
                              <Button 
                                variant="glow" 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-500"
                                disabled={isProcessing === payment.id}
                                onClick={() => handleApprove(payment.id, payment.user_id, payment.plan_requested)}
                              >
                                {isProcessing === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                                disabled={isProcessing === payment.id}
                                onClick={() => handleReject(payment.id)}
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
