"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Star, Zap, Layout, MessageSquare, Download, Code } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface TemplateContent {
  hero: { headline: string; subheadline: string; cta: string };
  features: { title: string; description: string; icon: string }[];
  testimonials: { quote: string; author: string; role: string }[];
  cta_section: { title: string; subtitle: string; button: string };
}

function PreviewContent() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!templateId) {
      router.push('/templates');
      return;
    }

    const fetchTemplate = async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (data) {
        setTemplate(data);
      }
      setIsLoading(false);
    };

    fetchTemplate();
  }, [templateId, router]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Preview...</div>;
  if (!template) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Template not found</div>;

  // Handle cases where content_json might be a string
  let content: TemplateContent;
  try {
    content = typeof template.content_json === 'string' 
      ? JSON.parse(template.content_json) 
      : template.content_json;
  } catch (e) {
    console.error("Error parsing template content:", e);
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Error loading template content</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Floating Toolbar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/50 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="h-10">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Button>
        <div className="w-px h-6 bg-white/10" />
        <div className="text-sm font-medium">
          Previewing: <span className="text-blue-400">{template.name}</span>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <Button variant="glow" size="sm" className="h-10" onClick={() => router.push(`/dashboard?template=${template.id}`)}>
          <Zap className="w-4 h-4" /> Use Template
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400"
          >
            <Layout className="w-4 h-4" />
            <span>{template.category} Premium Template</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]"
          >
            {content.hero.headline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium"
          >
            {content.hero.subheadline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-8"
          >
            <Button variant="glow" size="lg" className="h-16 px-10 text-xl rounded-2xl">
              {content.hero.cta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {content.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <CheckCircle2 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold">Trusted by Industry Leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-gray-300 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass rounded-[60px] p-20 text-center space-y-10 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-[100px] -z-10" />
          <h2 className="text-5xl font-bold">{content.cta_section.title}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {content.cta_section.subtitle}
          </p>
          <Button variant="glow" size="lg" className="h-16 px-12 text-xl rounded-2xl">
            {content.cta_section.button}
          </Button>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm italic">This is a preview of the {template.name} template.</p>
      </footer>
    </div>
  );
}

export default function TemplatePreview() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
