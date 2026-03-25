"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <GlassCard className="p-12">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-gray-400">
            <p>Effective Date: March 25, 2026</p>
            <p>
              Your privacy is fundamental to us. This policy outlines how LaunchForge AI collects, uses, 
              and protects your data.
            </p>
            <h2 className="text-xl font-bold text-white mt-8">1. Data Collection</h2>
            <p>
              We collect information provided during account creation and landing page generation to 
              improve our AI models and user experience.
            </p>
            <h2 className="text-xl font-bold text-white mt-8">2. Data Usage</h2>
            <p>
              Your data is used to provide the core services of LaunchForge AI, including AI-driven 
              design, payment processing, and customer support.
            </p>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
