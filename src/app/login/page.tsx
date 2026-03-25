"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Navbar } from "@/components/Navbar";
import { 
  Mail, 
  Lock, 
  Github, 
  Chrome, 
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const urlError = searchParams.get('error');
  
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(urlError);

  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      if (isLogin) {
        // 1. Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) {
          if (signInError.message.toLowerCase().includes("email not confirmed")) {
            setError("Email not confirmed. Please check your inbox for a verification link.");
          } else if (signInError.message.toLowerCase().includes("invalid login credentials")) {
            setError("Incorrect email or password. Please try again.");
          } else {
            setError(signInError.message);
          }
          throw signInError;
        }
        router.push(redirectUrl);
      } else {
        // 2. Sign Up
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (signupError) {
          if (signupError.message.toLowerCase().includes("user already registered")) {
            setError("Account already exists. Please sign in instead.");
            setIsLogin(true); // Switch to login automatically
          } else if (signupError.message.includes("Email rate limit exceeded")) {
            setError("Rate limit exceeded. Please try again in an hour.");
          } else {
            setError(signupError.message);
          }
          throw signupError;
        }

        // The DB trigger now handles profile creation.
        if (data.session) {
          router.push(redirectUrl);
        } else {
          setIsSuccess(true);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error.message);
      // Error is now set directly in the try block, so no alert needed here.
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
                    We've sent you a confirmation link to {formData.email}. Please verify your account to continue.
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => {
                  setIsSuccess(false);
                  setIsLogin(true);
                }}>
                  Back to Login
                </Button>
              </motion.div>
            ) : (
              <GlassCard className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                  <p className="text-gray-400 text-sm">
                    {isLogin ? "Enter your credentials to access your dashboard." : "Join LaunchForge AI and start building today."}
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                        {isLogin && <Link href="/forgot-password" title="Forgot Password" className="text-xs text-blue-400 hover:underline">Forgot password?</Link>}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          required
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button variant="glow" className="w-full py-4 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </div>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Sign Up"} <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/50 px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Chrome className="w-4 h-4" /> Google
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-400">
                  {isLogin ? (
                    <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-400 hover:underline">Create account</button></>
                  ) : (
                    <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-400 hover:underline">Sign In</button></>
                  )}
                </p>
              </GlassCard>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
