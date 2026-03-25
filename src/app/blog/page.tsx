"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <GlassCard className="p-12 text-center">
          <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
          <p className="text-xl text-gray-400 mb-12">
            The latest insights on AI design, SaaS building, and conversion optimization.
          </p>
          <div className="py-20 border-t border-white/5">
            <p className="text-gray-500 italic">No posts yet. We're busy building the future.</p>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
