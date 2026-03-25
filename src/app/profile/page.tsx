"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  User, 
  Mail, 
  Calendar, 
  Zap, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  History,
  LogOut,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; label: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch profile
      let { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        // Developer auto-premium check
        if (user.email === 'adityafuture.ai.tech@gmail.com') {
          if (profile.plan !== 'premium') {
            const { data: updatedProfile } = await supabase
              .from('users')
              .update({ plan: 'premium' })
              .eq('id', user.id)
              .select()
              .single();
            if (updatedProfile) profile = updatedProfile;
          }
          setProfile(profile);
          setTimeLeft(null); // No timer for elite users
        } else {
          // Check for subscription expiry for regular users
          if (profile.plan !== 'starter' && profile.subscription_end) {
            const now = new Date();
            const expiry = new Date(profile.subscription_end);
            if (now > expiry) {
              const { data: revertedProfile } = await supabase
                .from('users')
                .update({ 
                  plan: 'starter',
                  subscription_end: null 
                })
                .eq('id', user.id)
                .select()
                .single();
              if (revertedProfile) profile = revertedProfile;
            }
          }
          setProfile(profile);

          // Timer logic for regular users
          const updateTimer = () => {
            const now = new Date().getTime();
            let targetDate: number;
            let label = "";

            if (profile.plan === 'starter' && profile.trial_start) {
              targetDate = new Date(profile.trial_start).getTime() + (7 * 24 * 60 * 60 * 1000);
              label = "Trial Ends In";
            } else if (profile.subscription_end) {
              targetDate = new Date(profile.subscription_end).getTime();
              label = "Subscription Ends In";
            } else {
              setTimeLeft(null);
              return;
            }

            const diff = targetDate - now;
            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              setTimeLeft({ days, hours, minutes, label });
            } else {
              setTimeLeft({ days: 0, hours: 0, minutes: 0, label });
            }
          };

          updateTimer();
          const interval = setInterval(updateTimer, 60000);
          return () => clearInterval(interval);
        }
      }

      // Fetch payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPayments(payments || []);
      
      setIsLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
          ) : (
            <>
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                  <p className="text-gray-400">Manage your account and subscription settings.</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/20 hover:bg-red-400/10" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* User Info & Security */}
                <div className="md:col-span-4 space-y-6">
                  <GlassCard className="p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-full mb-6 flex items-center justify-center text-3xl font-bold shadow-2xl shadow-blue-500/20 uppercase ring-4 ring-white/5">
                        {user?.email?.charAt(0)}
                      </div>
                      <h2 className="text-2xl font-bold mb-1 tracking-tight">{user?.email?.split('@')[0]}</h2>
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <ShieldCheck className="w-3 h-3" /> Verified User
                      </div>
                    </div>
                    
                    <div className="space-y-4 border-t border-white/5 pt-8">
                      <div className="group/item">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Email Address</p>
                        <div className="flex items-center gap-3 text-sm text-gray-300 group-hover/item:text-white transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-500" />
                          </div>
                          {user?.email}
                        </div>
                      </div>
                      
                      <div className="group/item">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Member Since</p>
                        <div className="flex items-center gap-3 text-sm text-gray-300 group-hover/item:text-white transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-gray-500" />
                          </div>
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Account Security</h3>
                    <div className="space-y-3">
                      <Link href="/forgot-password">
                        <Button variant="outline" size="sm" className="w-full justify-between h-11 bg-white/[0.02] border-white/5 hover:bg-white/5">
                          Reset Password <ArrowUpRight className="w-4 h-4 text-gray-500" />
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>

                {/* Subscription, Usage & History */}
                <div className="md:col-span-8 space-y-8">
                  <div className="glass p-10 rounded-[40px] border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[120px] -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/20">
                          <Zap className="w-3 h-3 animate-pulse" /> 
                          {user.email === 'adityafuture.ai.tech@gmail.com' ? 'Elite Premium Access' : profile?.plan === 'starter' ? 'Free Trial Active' : `${profile?.plan} Plan Active`}
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight">
                          {user.email === 'adityafuture.ai.tech@gmail.com' ? 'Elite Account' : 'Subscription Status'}
                        </h3>
                      </div>
                      {profile?.plan === 'starter' && user.email !== 'adityafuture.ai.tech@gmail.com' && (
                        <Link href="/pricing">
                          <Button variant="glow" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-blue-500/20">Upgrade to Pro</Button>
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-blue-400" /> {timeLeft?.label || 'Time Remaining'}
                        </p>
                        <div className="flex items-baseline gap-1">
                          {user.email === 'adityafuture.ai.tech@gmail.com' ? (
                            <span className="text-2xl font-bold text-green-400">Lifetime Elite</span>
                          ) : timeLeft ? (
                            <>
                              <span className="text-2xl font-bold text-white">{timeLeft.days}d {timeLeft.hours}h</span>
                              <span className="text-gray-500 text-xs font-medium">{timeLeft.minutes}m</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-500">N/A</span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Generations</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-white">0</span>
                          <span className="text-gray-500 text-xs font-medium">/ {profile?.plan === 'starter' ? '3' : '∞'}</span>
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Status</p>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                          <span className="text-green-500 font-bold text-lg">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GlassCard className="p-8 border-white/5">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2.5">
                        <History className="w-4 h-4 text-blue-400" /> Recent Activity
                      </h3>
                      <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-gray-700" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No generations yet</p>
                          <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">Start your first project from the dashboard</p>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-8 border-white/5">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-green-400" /> Billing History
                      </h3>
                      <div className="space-y-2">
                        {payments.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-4">
                              <History className="w-6 h-6 text-gray-700" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">No transactions found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {payments.map((p) => (
                              <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase">{p.plan_requested} Plan</p>
                                  <p className="text-[10px] text-gray-500 font-medium">{new Date(p.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-white">₹{p.amount}</p>
                                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                                    p.status === 'success' ? 'text-green-500' :
                                    p.status === 'failed' ? 'text-red-500' : 'text-blue-400'
                                  }`}>{p.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
