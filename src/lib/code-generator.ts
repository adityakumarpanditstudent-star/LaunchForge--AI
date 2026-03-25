import { LandingPageBlueprint, Section } from "./ai-generator";

export const generateReactCode = (blueprint: LandingPageBlueprint): string => {
  const { businessName, sections, theme } = blueprint;

  const generateSectionCode = (section: Section): string => {
    switch (section.type) {
      case 'hero':
        return `
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl opacity-30" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider text-blue-400 uppercase">
          <span>${businessName} AI Powered</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-balance leading-[1.05] max-w-5xl">
          ${section.content.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
          ${section.content.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-500/20">
            ${section.content.cta?.text}
          </button>
          <div className="flex -space-x-3 items-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800" />
            ))}
            <span className="ml-4 text-sm text-gray-500 font-medium">Joined by 10k+ users</span>
          </div>
        </div>
      </section>`;

      case 'features':
        return `
      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-24">${section.content.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${section.content.items?.map(item => `
            <div className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all text-left group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">${item.title}</h3>
              <p className="text-gray-400 leading-relaxed">${item.description}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`;

      case 'benefits':
        return `
      {/* Benefits Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">${section.content.title}</h2>
            <div className="space-y-6">
              ${section.content.items?.map(item => `
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">${item.title}</h4>
                  <p className="text-sm text-gray-400">${item.description}</p>
                </div>
              </div>`).join('')}
            </div>
          </div>
          <div className="aspect-square rounded-[40px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-white/5 rounded-3xl border border-white/5" />
          </div>
        </div>
      </section>`;

      case 'social-proof':
        return `
      {/* Testimonials Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-24">${section.content.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${section.content.items?.map(item => `
            <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 text-left space-y-8 relative group">
              <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5 group-hover:text-blue-500/10 transition-colors" />
              <p className="text-gray-300 italic text-xl leading-relaxed relative z-10">"${item.quote}"</p>
              <div className="flex items-center gap-5 pt-4 border-t border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600" />
                <div>
                  <h4 className="font-bold text-lg">${item.author}</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">${item.role}</p>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`;

      case 'pricing':
        return `
      {/* Pricing Section */}
      <section className="py-32 px-6 bg-blue-500/[0.02]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-24">${section.content.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            ${section.content.items?.map((item, idx) => `
            <div className="p-12 rounded-3xl bg-white/5 border ${idx === 1 ? 'border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-white/10'} relative">
              ${idx === 1 ? '<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-blue-500 text-xs font-bold uppercase tracking-widest">Recommended</div>' : ''}
              <h3 className="text-2xl font-bold mb-2">${item.title}</h3>
              <div className="flex items-baseline justify-center gap-2 mb-10">
                <span className="text-5xl font-bold text-white">${item.price}</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <ul className="space-y-5 mb-12 text-left">
                ${item.features?.map(f => `
                <li className="flex items-center gap-4 text-gray-400">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">${f}</span>
                </li>`).join('')}
              </ul>
              <button className="w-full py-4 rounded-2xl border border-blue-500/50 hover:bg-blue-500/10 transition-all text-lg font-bold">
                Choose ${item.title}
              </button>
            </div>`).join('')}
          </div>
        </div>
      </section>`;

      case 'cta':
        return `
      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-white/5 p-16 rounded-[48px] border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl -z-10" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">${section.content.title}</h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">${section.content.subtitle}</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all">
            ${section.content.cta?.text}
          </button>
        </div>
      </section>`;

      default:
        return '';
    }
  };

  return `
import React from 'react';
import { 
  Check, 
  Zap, 
  ArrowRight, 
  Star, 
  Quote, 
  Sparkles 
} from 'lucide-react';

/**
 * Generated by LaunchForge AI
 * Business: ${businessName}
 * Tone: ${blueprint.tone}
 * 
 * Instructions:
 * 1. Ensure 'lucide-react' is installed (npm install lucide-react)
 * 2. This component uses Tailwind CSS classes.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      ${sections.map(generateSectionCode).join('\n')}

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.
      </footer>
    </div>
  );
}
`;
};
