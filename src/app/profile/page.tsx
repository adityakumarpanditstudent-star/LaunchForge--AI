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
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 23, minutes: 59 });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profile);

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

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
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
                {/* User Info */}
                <div className="md:col-span-4 space-y-6">
                  <GlassCard className="text-center p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20 uppercase">
                      {user?.email?.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold mb-1">{user?.email?.split('@')[0]}</h2>
                    <p className="text-gray-500 text-sm mb-6">LaunchForge User</p>
                    
                    <div className="space-y-4 text-left border-t border-white/5 pt-6">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Mail className="w-4 h-4" /> {user?.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Security</h3>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      Change Password <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </GlassCard>
                </div>

                {/* Subscription & Usage */}
                <div className="md:col-span-8 space-y-6">
                  <div className="glass p-8 rounded-[32px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
                    
                    <div className="flex items-start justify-between mb-10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-4 border border-blue-500/20">
                          <Zap className="w-3 h-3" /> {profile?.plan === 'starter' ? 'FREE TRIAL' : 'PREMIUM'}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">You're on the {profile?.plan?.toUpperCase()} Plan</h3>
                        <p className="text-gray-400 text-sm">Experience the full power of LaunchForge AI.</p>
                      </div>
                      {profile?.plan === 'starter' && (
                        <Link href="/pricing">
                          <Button variant="glow" size="sm">Upgrade Now</Button>
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Time Remaining
                        </p>
                        <div className="flex items-baseline gap-1">
                          {profile?.plan === 'starter' ? (
                            <>
                              <span className="text-2xl font-bold">{timeLeft.days}d {timeLeft.hours}h</span>
                              <span className="text-gray-500 text-sm">{timeLeft.minutes}m</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold">Lifetime</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Generations Used</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold">0</span>
                          <span className="text-gray-500 text-sm">/ {profile?.plan === 'starter' ? '3' : '∞'}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Plan Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-green-500 font-bold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <GlassCard className="p-6">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <History className="w-4 h-4" /> Recent Activity
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center py-10">
                          <p className="text-gray-600 text-xs italic">No activity yet</p>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Billing History
                      </h3>
                      <div className="space-y-4">
                        {payments.length === 0 ? (
                          <div className="flex items-center justify-center py-10">
                            <p className="text-gray-600 text-xs italic">No billing history</p>
                          </div>
                        ) : (
                          payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                              <div className="space-y-1">
                                <p className="text-sm font-medium uppercase">{p.plan_requested} Plan</p>
                                <p className="text-[10px] text-gray-500">{new Date(p.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-white">₹{p.amount}</p>
                                <p className={`text-[8px] font-bold uppercase ${
                                  p.status === 'success' ? 'text-green-500' :
                                  p.status === 'failed' ? 'text-red-500' : 'text-blue-400'
                                }`}>{p.status}</p>
                              </div>
                            </div>
                          ))
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
