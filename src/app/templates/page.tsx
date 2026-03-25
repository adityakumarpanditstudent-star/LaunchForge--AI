"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Sparkles, 
  Search, 
  Layout, 
  ArrowRight,
  Eye,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const categories = ["All", "SaaS", "Startup", "E-commerce", "Personal Brand", "Agency", "App"];

export default function Templates() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        console.log("Fetching templates from Supabase...");
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Supabase error:", error.message);
          alert(`Error fetching templates: ${error.message}`);
        } else {
          console.log("Templates fetched successfully:", data?.length);
          setTemplates(data || []);
        }
      } catch (err: any) {
        console.error("Fetch error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-black text-white transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Templates Library</h1>
              <p className="text-gray-500 dark:text-gray-400">Choose a high-converting foundation and let AI customize it for you.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search templates..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" 
                    : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Library...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group"
                >
                  <GlassCard className="p-0 overflow-hidden border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 group-hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-white/5">
                      {/* Mock Landing Page Preview */}
                      <div className="absolute inset-0 p-4 transform group-hover:scale-105 transition-transform duration-700">
                        <div className="w-full h-full bg-white dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/5 p-4 space-y-3 relative overflow-hidden">
                          <div className="flex justify-between items-center opacity-40">
                            <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-yellow-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
                            <div className="w-12 h-2 bg-gray-300 dark:bg-white/20 rounded"/>
                          </div>
                          <div className="space-y-2 pt-4">
                            <div className="h-4 bg-gray-200 dark:bg-white/20 rounded-md w-3/4" />
                            <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-md w-full" />
                            <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-md w-5/6" />
                          </div>
                          <div className="pt-4 grid grid-cols-3 gap-2">
                            <div className="h-12 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5" />
                            <div className="h-12 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5" />
                            <div className="h-12 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5" />
                          </div>
                          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white dark:from-black/80 to-transparent" />
                        </div>
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 px-6">
                        <Button 
                          variant="glow" 
                          className="w-full py-3 h-auto"
                          onClick={() => router.push(`/dashboard?template=${template.id}`)}
                        >
                          <Zap className="w-4 h-4" /> Use Template
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full py-3 h-auto"
                          onClick={() => router.push(`/templates/preview?id=${template.id}`)}
                        >
                          <Eye className="w-4 h-4" /> Live Preview
                        </Button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {template.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{template.name}</h3>
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        Professional, high-converting layout for {template.category.toLowerCase()} brands.
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
