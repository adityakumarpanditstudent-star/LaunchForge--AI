"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
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
  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <Navbar />
      <AnimatedBackground />
      
      <main className="relative pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 border border-blue-500/20">
              <Zap className="w-4 h-4" /> 
              <span>V2.0 is now live with AI Page Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Launch Your Next Idea <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                In Seconds, Not Weeks
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The AI-powered landing page builder for developers and founders. 
              Modern design, lightning-fast performance, and conversion-ready code.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login?mode=signup">
                <Button variant="glow" className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-blue-500/20">
                  Build Your Page Free
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" className="h-16 px-10 text-lg rounded-2xl border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5">
                  View Templates
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 grayscale opacity-70">
              <div className="flex items-center gap-2 font-bold text-xl"><Star className="w-6 h-6 fill-current" /> Trustpilot</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6 fill-current" /> Product Hunt</div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-gray-500 dark:text-gray-400">Ship faster with pre-built components and AI-driven design.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="group p-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Layout className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Design Engine</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Describe your business and our AI generates a custom, high-converting layout instantly.
              </p>
            </GlassCard>

            <GlassCard className="group p-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Performance</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Pages optimized for Core Web Vitals, ensuring your users get the fastest experience possible.
              </p>
            </GlassCard>

            <GlassCard className="group p-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Export-Ready Code</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Download clean React/Next.js and Tailwind CSS code ready to be deployed anywhere.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="glass p-16 rounded-[48px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px] -z-10" />
            
            <h2 className="text-5xl font-bold mb-8">Ready to Build Something Great?</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Join 10,000+ founders and developers building their future with LaunchForge AI.
            </p>
            <Link href="/login?mode=signup">
              <Button variant="glow" className="h-16 px-12 text-xl rounded-2xl">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-gray-200 dark:border-white/5 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logo />
        </div>
        <p>© 2026 LaunchForge AI. Built with ❤️ for the future of the web.</p>
      </footer>
    </div>
  );
}
