"use client";

import { useState, useEffect } from "react";
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
  const initialMode = searchParams.get('mode');
  
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(initialMode === 'signup' ? false : true);
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
    confirmPassword: "",
  });

  const validateInputs = () => {
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      if (isLogin) {
        // 1. Sign In first
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
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
          setIsLoading(false);
          return;
        }

        // 2. Now check if they are in the public.users whitelist
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', authData.user.id)
          .single();

        if (userError || !userData) {
          // Check if this is a "self-healing" case (e.g. dev user)
          if (formData.email === 'adityafuture.ai.tech@gmail.com') {
            router.push(redirectUrl);
            return;
          }
          
          await supabase.auth.signOut();
          setError("Access denied. Your email is not registered in our database.");
          setIsLoading(false);
          return;
        }

        router.push(redirectUrl);
      } else {
        // 1. Sign Up
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
          setIsLoading(false);
          return;
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
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
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
                  <p className="text-gray-500 dark:text-gray-400">
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
              <GlassCard className="p-8 space-y-8 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 shadow-2xl">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
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
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                        {isLogin && <Link href="/forgot-password" title="Forgot Password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input 
                          required
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>

                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <input 
                            required
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Button 
                    disabled={isLoading}
                    type="submit" 
                    variant="glow"
                    className="w-full h-14 text-lg rounded-xl shadow-xl shadow-blue-500/20"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      isLogin ? "Sign In" : "Create Account"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
                    </button>
                  </div>
                </form>
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
