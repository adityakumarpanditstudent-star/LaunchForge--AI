"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { Sparkles, ArrowLeft, Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo />
      </motion.div>

      <div className="relative mb-8">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[12rem] font-black text-white/5 leading-none select-none"
        >
          404
        </motion.h1>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Ghost className="w-24 h-24 text-blue-400 opacity-80" />
        </motion.div>
      </div>

      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-3xl font-bold mb-4"
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-gray-400 max-w-md mb-12"
      >
        The page you are looking for doesn't exist or has been moved to a different universe.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link href="/">
          <Button variant="outline" className="h-12 px-8 rounded-xl border-white/10 hover:bg-white/5">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="glow" className="h-12 px-8 rounded-xl">
            <Sparkles className="w-4 h-4 mr-2" /> Go to Dashboard
          </Button>
        </Link>
      </motion.div>

      <footer className="mt-20 text-gray-600 text-sm">
        <p>© 2026 LaunchForge AI. Lost but not forgotten.</p>
      </footer>
    </div>
  );
}
