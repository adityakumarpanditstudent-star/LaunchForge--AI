import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <GlassCard className="p-12">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-gray-400">
            <p>Effective Date: March 25, 2026</p>
            <p>
              By using LaunchForge AI, you agree to these terms. Please read them carefully.
            </p>
            <h2 className="text-xl font-bold text-white mt-8">1. User Account</h2>
            <p>
              You are responsible for maintaining the security of your account and for all activities 
              that occur under it.
            </p>
            <h2 className="text-xl font-bold text-white mt-8">2. Intellectual Property</h2>
            <p>
              LaunchForge AI provides a platform for you to generate landing pages. While you own the 
              content you provide, LaunchForge AI retains ownership of its underlying AI models 
              and design systems.
            </p>
            <h2 className="text-xl font-bold text-white mt-8">3. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate our terms or engage 
              in unauthorized activities.
            </p>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
