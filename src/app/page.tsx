"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";
import { 
  Zap, 
  Layout, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Layers,
  Sparkles,
  QrCode as QrIcon
} from "lucide-react";
import Link from "next/link";

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <span>{displayText}</span>;
};

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-blue-400 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Design Engine v2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] text-balance"
          >
            Generate High-Converting <br />
            <span className="neon-text">Landing Pages</span> in Seconds
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium"
          >
            <TypewriterText text="The ultimate AI design partner for startups, SaaS, and creators. Build, preview, and launch your next big idea instantly." />
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard">
              <Button variant="glow" size="lg" className="h-16 px-10 text-xl">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="h-16 px-10 text-xl">
                View Templates
              </Button>
            </Link>
            
            <div className="group relative hidden lg:block">
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center cursor-help hover:bg-white/10 transition-all border border-white/5">
                <QrIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-400" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl w-48 text-center bg-black/80 backdrop-blur-xl">
                  <div className="bg-white p-2 rounded-xl mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${baseUrl}/pricing`}
                      alt="Quick Access"
                      className="w-full aspect-square"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Scan to Open Payments on Phone</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Elements Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative mt-20 max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
            <div className="glass rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden aspect-[16/9]">
              <div className="w-full h-full rounded-2xl bg-black/40 border border-white/5 flex flex-col p-6 space-y-6">
                 {/* Mock Editor UI */}
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 h-4 bg-white/5 rounded" />
                      <div className="w-16 h-4 bg-white/5 rounded" />
                    </div>
                 </div>
                 <div className="flex-1 grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-4">
                      <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                      <div className="h-4 bg-white/5 rounded-lg w-full" />
                      <div className="h-4 bg-white/5 rounded-lg w-5/6" />
                      <div className="h-12 bg-blue-500/20 rounded-xl w-1/2" />
                    </div>
                    <div className="col-span-8 bg-white/5 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl" />
                      <div className="space-y-4">
                        <div className="h-4 bg-white/10 rounded w-1/4" />
                        <div className="h-20 bg-white/5 rounded-xl w-full" />
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-white/5 rounded-xl" />
                          <div className="h-24 bg-white/5 rounded-xl" />
                          <div className="h-24 bg-white/5 rounded-xl" />
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Why Choose LaunchForge?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built for speed, designed for conversions. The only AI tool you need for landing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard delay={0.1}>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Content</h3>
              <p className="text-gray-400">
                Our AI writes high-converting copy tailored specifically to your target audience and business niche.
              </p>
            </GlassCard>

            <GlassCard delay={0.2}>
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Layout className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Preview</h3>
              <p className="text-gray-400">
                See changes in real-time as the AI generates sections. No more waiting or refreshing pages.
              </p>
            </GlassCard>

            <GlassCard delay={0.3}>
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                <Code className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Export Ready Code</h3>
              <p className="text-gray-400">
                Download clean, production-ready React or HTML code with one click. Ready to deploy anywhere.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Founders</h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="space-y-6">
                <p className="text-gray-300 italic">
                  "LaunchForge AI saved us weeks of work. We launched our SaaS landing page in literally 5 minutes and saw a 20% conversion rate increase immediately."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  <div>
                    <h4 className="font-bold">Alex Rivera</h4>
                    <p className="text-sm text-gray-500">CEO, TechFlow</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto glass p-12 rounded-[40px] text-center border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-3xl -z-10" />
          <h2 className="text-4xl font-bold mb-6">Ready to launch?</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join 1,000+ founders using LaunchForge AI to build their dreams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <Button variant="glow" size="lg">View Pricing Plans</Button>
            </Link>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
