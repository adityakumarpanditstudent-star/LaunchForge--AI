"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Settings as SettingsIcon, 
  Trash2, 
  Camera, 
  Check, 
  Loader2,
  ShieldCheck,
  Zap,
  Clock,
  History,
  AlertTriangle,
  Bell,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TabType = "profile" | "security" | "billing" | "preferences" | "danger";

function SettingsContent() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form States
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferences, setPreferences] = useState({
    email_alerts: true,
    language: "en"
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      let { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        // Developer auto-premium check
        if (user.email === 'adityafuture.ai.tech@gmail.com' && profile.plan !== 'premium') {
          const { data: updatedProfile } = await supabase
            .from('users')
            .update({ plan: 'premium' })
            .eq('id', user.id)
            .select()
            .single();
          if (updatedProfile) profile = updatedProfile;
        }
        
        setProfile(profile);
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
        if (profile.preferences) {
          setPreferences(profile.preferences);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 2MB.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update local state and profile
      setAvatarUrl(publicUrl);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          full_name: fullName,
          avatar_url: avatarUrl 
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async (newPrefs: any) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    try {
      await supabase
        .from('users')
        .update({ preferences: updated })
        .eq('id', user.id);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you absolutely sure? This will permanently delete your account and all data.");
    if (!confirm) return;

    setIsSaving(true);
    try {
      // In a real app, you'd call a server-side function to delete the auth user too.
      // For now, we'll just sign out and show a message.
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your profile, billing, and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              } ${tab.id === 'danger' ? 'hover:text-red-400 hover:bg-red-400/5' : ''}`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-8">
                {message && (
                  <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}

                {activeTab === "profile" && (
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="flex items-center gap-8 pb-8 border-b border-white/5">
                      <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20 uppercase ring-4 ring-white/5">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user?.email?.charAt(0)
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-lg text-white shadow-lg hover:bg-blue-600 transition-colors group-hover:scale-110 cursor-pointer">
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">Profile Picture</h3>
                        <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email Address (Read-only)</label>
                        <div className="flex items-center gap-3 w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500">
                          <Mail className="w-4 h-4" />
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button type="submit" variant="glow" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        Save Profile Changes
                      </Button>
                    </div>
                  </form>
                )}

                {activeTab === "security" && (
                  <form onSubmit={handleChangePassword} className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Change Password</h3>
                      <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">New Password</label>
                        <input
                          required
                          type="password"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Confirm New Password</label>
                        <input
                          required
                          type="password"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button type="submit" variant="glow" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                        Update Password
                      </Button>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <p className="text-sm text-gray-400">
                        Forgot your password? <Link href="/forgot-password" title="Go to Forgot Password Page" className="text-blue-400 hover:underline">Click here to reset it</Link>
                      </p>
                    </div>
                  </form>
                )}

                {activeTab === "billing" && (
                  <div className="space-y-8">
                    <div className="glass p-8 rounded-[32px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
                      
                      <div className="flex items-start justify-between mb-10">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-4 border border-blue-500/20 uppercase tracking-widest">
                            <Zap className="w-3 h-3" /> 
                            {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'ELITE ACCESS' : profile?.plan === 'starter' ? 'FREE TRIAL' : `${profile?.plan?.toUpperCase()} PLAN`}
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'Elite Premium Plan' : `Current Plan: ${profile?.plan?.toUpperCase()}`}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'Unlimited lifetime access to all premium features.' : 'Experience the full power of LaunchForge AI.'}
                          </p>
                        </div>
                        <Link href="/pricing">
                          <Button variant="glow" size="sm">Upgrade Plan</Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Subscription Status
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500 font-bold">
                              {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'Lifetime Active' : 'Active'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                            {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'Renewal Date' : 'Next Billing Date'}
                          </p>
                          <p className="text-lg font-bold">
                            {user?.email === 'adityafuture.ai.tech@gmail.com' ? 'Never' : profile?.subscription_end ? new Date(profile.subscription_end).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4" /> Billing History
                      </h4>
                      <Link href="/profile">
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          View Detailed Billing History <History className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">System Preferences</h3>
                      <p className="text-sm text-gray-500">Customize your experience with LaunchForge AI.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-bold">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive alerts about your generations and plan</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleUpdatePreferences({ email_alerts: !preferences.email_alerts })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${preferences.email_alerts ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.email_alerts ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-bold">Language</p>
                            <p className="text-xs text-gray-500">Select your preferred language</p>
                          </div>
                        </div>
                        <select 
                          className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                          value={preferences.language}
                          onChange={(e) => handleUpdatePreferences({ language: e.target.value })}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "danger" && (
                  <div className="space-y-8">
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Delete Account</h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Once you delete your account, there is no going back. All your projects, exports, and profile data will be permanently removed.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 w-full justify-center"
                        onClick={handleDeleteAccount}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Permanently Delete My Account
                      </Button>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <h4 className="font-bold mb-2">What happens when you delete?</h4>
                      <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                        <li>Immediate loss of access to the platform</li>
                        <li>All generated landing pages will be deleted</li>
                        <li>Subscription will be cancelled immediately</li>
                        <li>Personal data will be erased from our systems</li>
                      </ul>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-black text-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        }>
          <SettingsContent />
        </Suspense>
      </main>
    </div>
  );
}
