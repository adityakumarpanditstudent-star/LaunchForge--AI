"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Navbar } from "@/components/Navbar";
import { 
  Mail, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';

export default function ForgotPassword() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. If email field is empty
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    // 2. If email format is invalid
    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // 3. Optional: Quick check in public.users for faster precise feedback
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      // 4. Send reset link regardless, but provide precise feedback if possible
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        // If Supabase actually returns an error (rate limit, etc.)
        setError(resetError.message);
        throw resetError;
      }

      // If we didn't find the user in public.users AND Supabase didn't error
      // We still show success to prevent email enumeration, but we could warn if we're sure
      // However, per instructions: "Invalid email address" if NOT in system.
      // Since we can't check auth.users directly, we've enabled public.users check.
      if (!userData) {
        setError("Invalid email address. No account found with this email.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Reset error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full mx-auto flex items-center justify-center border-4 border-green-500/50 shadow-xl shadow-green-500/20">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Check your email!</h2>
                  <p className="text-gray-400">
                    Password reset link has been sent to your email <span className="text-white font-medium">{email}</span>. Please follow the instructions in the email.
                  </p>
                </div>
                <Link href="/login" className="block w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <GlassCard className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold">Forgot Password?</h1>
                  <p className="text-gray-400 text-sm">
                    No worries! Enter your email below and we'll send you a link to reset your password.
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl p-4 text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button variant="glow" className="w-full py-4 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Link...
                      </div>
                    ) : (
                      <>
                        Send Reset Link <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-400">
                  Remember your password? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
                </p>
              </GlassCard>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
