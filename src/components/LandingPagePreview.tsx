"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { LandingPageBlueprint, Section } from "@/lib/ai-generator";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Quote
} from "lucide-react";

interface LandingPagePreviewProps {
  blueprint: LandingPageBlueprint;
}

export const LandingPagePreview = ({ blueprint }: LandingPagePreviewProps) => {
  const { theme, sections } = blueprint;

  const renderSection = (section: Section) => {
    const sectionVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };

    const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
      }
    };

    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 50, 0],
                  y: [0, -50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, -30, 0],
                  y: [0, 60, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" 
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider text-blue-400 uppercase backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{blueprint.businessName} AI Powered v2.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-balance leading-[1.05] max-w-5xl"
              style={{ fontFamily: theme.typography.heading }}
            >
              {section.content.title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              {section.content.subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
            >
              <Button variant="glow" size="lg" className="px-10 h-16 text-xl rounded-2xl group">
                {section.content.cta?.text} 
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-gray-700 to-gray-900" />
                ))}
                <span className="ml-4 text-sm text-gray-500 font-medium">Joined by 10k+ users</span>
              </div>
            </motion.div>

            {/* Visual Filler */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-20 w-full max-w-6xl aspect-[21/9] bg-gradient-to-t from-blue-500/10 to-transparent rounded-t-[40px] border-t border-x border-white/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="flex p-4 gap-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
            </motion.div>
          </section>
        );

      case 'features':
        return (
          <section key={section.id} className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="text-center mb-24 space-y-4"
              >
                <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: theme.typography.heading }}>{section.content.title}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Engineered for excellence, designed for impact. Everything you need to scale your operations.
                </p>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {section.content.items?.map((item, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <GlassCard className="p-10 h-full group hover:bg-white/[0.04] transition-all duration-500 border-white/5 hover:border-blue-500/30">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Zap className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-base">
                        {item.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'benefits':
        return (
          <section key={section.id} className="py-32 px-6 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-12"
              >
                <motion.h2 variants={itemVariants} className="text-5xl font-bold leading-tight" style={{ fontFamily: theme.typography.heading }}>{section.content.title}</motion.h2>
                <div className="space-y-8">
                  {section.content.items?.map((item, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <Check className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{item.title}</h4>
                        <p className="text-gray-400 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square rounded-[48px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 p-12"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-3xl" />
                <motion.div 
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm relative z-10 overflow-hidden"
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                   <div className="p-8 space-y-6">
                      <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-white/5 rounded-full" />
                        <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                        <div className="h-3 w-4/6 bg-white/5 rounded-full" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                        <div className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                      </div>
                   </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        );

      case 'social-proof':
        return (
          <section key={section.id} className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="text-center mb-24"
              >
                <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: theme.typography.heading }}>{section.content.title}</h2>
                <div className="flex justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {section.content.items?.map((item, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8 relative group hover:bg-white/[0.04] transition-all duration-500 h-full">
                      <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5 group-hover:text-blue-500/10 transition-colors duration-500" />
                      <p className="text-gray-300 italic text-xl leading-relaxed relative z-10">
                        "{item.quote}"
                      </p>
                      <div className="flex items-center gap-5 pt-4 border-t border-white/5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20" />
                        <div>
                          <h4 className="font-bold text-lg text-white">{item.author}</h4>
                          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'pricing':
        return (
          <section key={section.id} className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/[0.01] -z-10" />
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="text-center mb-24"
              >
                <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.typography.heading }}>{section.content.title}</h2>
                <p className="text-gray-400">Simple, transparent, and built to scale with you.</p>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
              >
                {section.content.items?.map((item, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <GlassCard className={`p-12 relative h-full group transition-all duration-500 ${idx === 1 ? 'border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-white/5'}`}>
                      {idx === 1 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/40">
                          Recommended
                        </div>
                      )}
                      <div className="mb-10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">{item.price}</span>
                          <span className="text-gray-500 font-medium">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-5 mb-12">
                        {item.features?.map((f, i) => (
                          <li key={i} className="flex items-center gap-4 text-gray-400 group-hover:text-gray-300 transition-colors">
                            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant={idx === 1 ? 'glow' : 'outline'} className="w-full h-14 text-lg rounded-2xl">
                        Start with {item.title}
                      </Button>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={section.id} className="py-32 px-6">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto glass p-20 md:p-32 rounded-[60px] border border-white/10 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-3xl" 
              />
              
              <div className="relative z-10 space-y-10">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: theme.typography.heading }}>{section.content.title}</h2>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                  {section.content.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button variant="glow" size="lg" className="px-16 h-20 text-2xl rounded-3xl shadow-2xl shadow-blue-500/40">
                    {section.content.cta?.text}
                  </Button>
                  <p className="text-gray-500 font-medium">No credit card required • Cancel anytime</p>
                </div>
              </div>
            </motion.div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-0 bg-black text-white selection:bg-blue-500/30">
      {/* Design Guidance Sidebar (Optional view) */}
      <div className="bg-blue-500/10 border-y border-blue-500/20 px-8 py-4 flex flex-wrap gap-6 text-xs font-medium text-blue-400 uppercase tracking-widest">
        <span>🎨 Layout: {sections[0].design.layout}</span>
        <span>✨ Theme: {blueprint.tone}</span>
        <span>🎯 Strategy: {blueprint.conversionStrategy.urgency}</span>
        <span>📱 Mobile: {sections[0].responsive.mobileLayout}</span>
      </div>

      <div className="p-4">
        {sections.map(renderSection)}
      </div>
    </div>
  );
};
