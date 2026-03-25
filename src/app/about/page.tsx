import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <GlassCard className="p-12">
          <h1 className="text-4xl font-bold mb-8">About LaunchForge AI</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-gray-400">
            <p className="text-xl text-white">
              We're on a mission to democratize premium design for every founder and developer.
            </p>
            <p>
              LaunchForge AI was born from the frustration of spending weeks on landing pages instead of building the actual product. 
              Our AI engine understands design psychology, conversion triggers, and modern aesthetics to give you a head start in seconds.
            </p>
            <p>
              Founded in 2026, we've helped thousands of startups launch with confidence. Our neural engine v2.0 is just the beginning 
              of how we're reimagining the future of web development.
            </p>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
