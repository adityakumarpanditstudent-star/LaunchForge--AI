"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Sparkles, 
  Send, 
  Eye, 
  Download, 
  RefreshCcw,
  Layout,
  Type,
  Users,
  MessageSquare,
  Loader2,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { generateLandingPage, LandingPageBlueprint } from "@/lib/ai-generator";
import { LandingPagePreview } from "@/components/LandingPagePreview";
import { generateReactCode } from "@/lib/code-generator";

function DashboardContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [blueprint, setBlueprint] = useState<LandingPageBlueprint | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    targetAudience: "",
    tone: "professional",
    goal: "sales",
    features: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Preserve current URL for redirect after login
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profile);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const loadTemplate = async () => {
        try {
          console.log("Loading template:", templateId);
          const { data, error } = await supabase
            .from('templates')
            .select('*')
            .eq('id', templateId)
            .single();
          
          if (error) {
            console.error("Error loading template:", error.message);
            return;
          }

          if (data) {
            console.log("Template data loaded:", data.name);
            let content = data.content_json;
            
            // Handle cases where content_json might be a string
            if (typeof content === 'string') {
              try {
                content = JSON.parse(content);
              } catch (e) {
                console.error("Error parsing content_json:", e);
              }
            }

            const initialFormData = {
              businessName: data.name ? data.name.split(' ')[0] : "",
              description: content?.hero?.subheadline || "",
              targetAudience: data.category || "",
              tone: "professional",
              goal: "sales",
              features: ""
            };
            setFormData(initialFormData);
            
            // Auto-generate preview based on template data
            const initialBlueprint = await generateLandingPage(initialFormData);
            setBlueprint(initialBlueprint);
            localStorage.setItem("current_blueprint", JSON.stringify(initialBlueprint));
            setShowPreview(true);
          }
        } catch (err: any) {
          console.error("Failed to load template:", err.message);
        }
      };
      loadTemplate();
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateLandingPage(formData);
      // Artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBlueprint(result);
      localStorage.setItem("current_blueprint", JSON.stringify(result));
      setShowPreview(true);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCode = () => {
    if (!blueprint) return;
    const code = generateReactCode(blueprint);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.businessName.toLowerCase().replace(/\s+/g, '-')}-landing-page.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Generate Landing Page</h1>
            <p className="text-gray-400">Fill in the details below to create your high-converting landing page.</p>
          </div>
          <div className="flex gap-4">
            {showPreview && blueprint && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                onClick={() => window.open('/preview', '_blank')}
              >
                <ExternalLink className="w-4 h-4" /> Full Preview
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Layout className="w-4 h-4" /> Save as Template
            </Button>
            <Button 
              variant="glow" 
              size="sm"
              onClick={handleExportCode}
              disabled={!blueprint}
            >
              <Download className="w-4 h-4" /> Export Code
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Business Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. LaunchForge AI"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Description
                </label>
                <textarea 
                  rows={4}
                  placeholder="Describe what your business does..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Target Audience
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. SaaS Founders, Marketers"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tone of Voice</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="luxury">Luxury</option>
                  <option value="GenZ">GenZ</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold & Aggressive</option>
                  <option value="witty">Witty & Humorous</option>
                  <option value="empathetic">Empathetic</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Main Goal</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                >
                  <option value="sales">Sales</option>
                  <option value="leads">Leads</option>
                  <option value="signups">Signups</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Unique Selling Points (Optional)
                </label>
                <textarea 
                  rows={2}
                  placeholder="e.g. 24/7 support, free trial, etc."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                />
              </div>

              <Button 
                variant="glow" 
                className="w-full py-4 h-auto text-lg" 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.businessName}
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generate Now
                  </>
                )}
              </Button>
            </GlassCard>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8 space-y-4">
            {showPreview && blueprint && (
              <div className="flex items-center justify-between px-6 py-2 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
                    title="Desktop View"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
                    title="Tablet View"
                  >
                    <Tablet className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  Preview: {previewDevice.toUpperCase()}
                </div>
              </div>
            )}
            
            <div className="glass rounded-[32px] border border-white/10 h-[calc(100vh-250px)] relative overflow-hidden bg-black/40">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">AI is crafting your landing page...</h2>
                    <div className="max-w-md space-y-2">
                      <p className="text-gray-400 animate-pulse">Writing high-converting headlines...</p>
                      <p className="text-gray-500 text-sm">Analyzing target audience segments...</p>
                    </div>
                  </motion.div>
                ) : showPreview && blueprint ? (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col items-center"
                  >
                    <div className="sticky top-4 right-4 z-20 w-full flex justify-end p-4 pointer-events-none">
                      <Button 
                        variant="glow" 
                        size="sm" 
                        className="pointer-events-auto shadow-2xl"
                        onClick={() => window.open('/preview', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> Open Full Preview
                      </Button>
                    </div>
                    
                    <div 
                      className="transition-all duration-500 ease-in-out h-full"
                      style={{ 
                        width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                        maxWidth: '100%',
                        backgroundColor: '#000',
                        boxShadow: previewDevice !== 'desktop' ? '0 0 50px rgba(59, 130, 246, 0.1)' : 'none',
                        margin: '0 auto'
                      }}
                    >
                      <LandingPagePreview blueprint={blueprint} />
                    </div>
                  </motion.div>
                ) : (
                  <div key="empty" className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                      <Eye className="w-10 h-10 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">Live Preview Area</h2>
                    <p className="text-gray-500 max-w-sm">
                      Your generated landing page will appear here. Fill out the form and click "Generate Now" to begin.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
