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
  ExternalLink,
  Zap,
  Clock
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  user_id: string;
  plan_requested: string;
  billing_cycle: string;
  amount: number;
  utr_number: string;
  screenshot_url: string;
  status: string;
  created_at: string;
  user_email?: string;
}

export default function AdminPayments() {
  const supabase = createClient();
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

  const handleApprove = async (paymentId: string, userId: string, plan: string, billingCycle: string) => {
    setIsProcessing(paymentId);
    try {
      // 1. Calculate expiry date
      const expiryDate = new Date();
      if (billingCycle === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (billingCycle === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      // 2. Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'success' })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // 3. Update user plan and expiry
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          plan: plan,
          trial_active: false,
          subscription_end: expiryDate.toISOString()
        })
        .eq('id', userId);

      if (userError) throw userError;

      alert(`Payment Approved! ${plan.toUpperCase()} plan active until ${expiryDate.toLocaleDateString()}`);
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
    <div className="flex min-h-screen bg-black text-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20 mb-4">
                <ShieldCheck className="w-3 h-3" /> Admin Dashboard
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Payment Approvals</h1>
              <p className="text-gray-500 dark:text-gray-400">Review and approve manual payment requests from users.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search UTR or Email..."
                className="w-full sm:w-80 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </header>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center gap-4"
              >
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Loading payment requests...</p>
              </motion.div>
            ) : payments.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[50vh] flex flex-col items-center justify-center text-center p-8 glass rounded-[48px] border-dashed border-2 border-gray-200 dark:border-white/10"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Pending Payments</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">All payment requests have been processed. Great job!</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-6"
              >
                {payments.map((payment) => (
                  <GlassCard 
                    key={payment.id} 
                    className={cn(
                      "p-0 overflow-hidden border transition-all duration-300",
                      payment.status === 'pending' ? "border-amber-500/30 bg-amber-500/5" : "border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5"
                    )}
                  >
                    <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                          {payment.status === 'pending' ? (
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                          ) : payment.status === 'success' ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-bold">{payment.user_email || 'Unknown User'}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                              payment.status === 'pending' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"
                            )}>
                              {payment.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> {payment.plan_requested} ({payment.billing_cycle})</div>
                            <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">₹{payment.amount}</div>
                            <div className="flex items-center gap-1.5 font-mono">UTR: {payment.utr_number}</div>
                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(payment.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200 dark:border-white/5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl border-gray-200 dark:border-white/10"
                          onClick={() => window.open(payment.screenshot_url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" /> Screenshot
                        </Button>
                        
                        {payment.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleReject(payment.id)}
                              disabled={isProcessing === payment.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                            <Button 
                              variant="glow" 
                              size="sm" 
                              className="rounded-xl px-8"
                              onClick={() => handleApprove(payment.id, payment.user_id, payment.plan_requested, payment.billing_cycle)}
                              disabled={isProcessing === payment.id}
                            >
                              {isProcessing === payment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>Approve Access <ExternalLink className="w-4 h-4 ml-2" /></>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
