"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Star,
  ZapOff,
  ChevronRight,
  ShieldCheck,
  QrCode as QrIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "7-day free trial to explore the AI engine.",
    features: [
      "7-day full access",
      "3 AI generations",
      "Standard templates",
      "Community support"
    ],
    buttonText: "Start 7-Day Trial",
    variant: "outline"
  },
  {
    name: "Pro",
    price: { monthly: 199, yearly: 1990 },
    description: "Best for startups and growing businesses.",
    features: [
      "Unlimited AI generations",
      "All premium templates",
      "Export React/HTML code",
      "Priority AI queue",
      "Remove branding",
      "Email support"
    ],
    buttonText: "Buy Pro Plan",
    variant: "glow",
    popular: true
  },
  {
    name: "Premium",
    price: { monthly: 399, yearly: 3990 },
    description: "Advanced tools for teams and agencies.",
    features: [
      "Everything in Pro",
      "Custom branding engine",
      "Multi-page generation",
      "Advanced SEO tools",
      "24/7 Priority support",
      "API access"
    ],
    buttonText: "Buy Premium Plan",
    variant: "secondary"
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [baseUrl, setBaseUrl] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    
    // Get current user email for developer check
    const checkUser = async () => {
      const { data: { user } } = await createClient().auth.getUser();
      if (user) setUserEmail(user.email ?? null);
    };
    checkUser();
  }, []);

  const isDev = userEmail === 'adityafuture.ai.tech@gmail.com';

  return (
    <div className="flex min-h-screen bg-black text-white transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20"
          >
            {isDev ? "Developer Access Enabled" : "Pricing Plans"}
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {isDev ? "Premium Features Unlocked" : "Simple, Transparent Pricing"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {isDev 
              ? "As the developer, you have full administrative access to all premium features and tools." 
              : "Choose the plan that fits your needs. Scale your business with AI-powered design."
            }
          </p>

          <div className="flex items-center justify-center gap-4 mt-12">
            <span className={billingCycle === "monthly" ? "text-black dark:text-white font-medium" : "text-gray-500"}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="w-16 h-8 bg-gray-200 dark:bg-white/10 rounded-full p-1 relative transition-colors hover:bg-gray-300 dark:hover:bg-white/20"
            >
              <motion.div 
                animate={{ x: billingCycle === "monthly" ? 0 : 32 }}
                className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" 
              />
            </button>
            <span className={billingCycle === "yearly" ? "text-black dark:text-white font-medium" : "text-gray-500"}>Yearly</span>
            <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-lg border border-green-500/20">Save 20%</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <GlassCard className={`h-full flex flex-col p-8 border ${plan.popular ? "border-blue-500/30 bg-blue-500/5 shadow-2xl shadow-blue-500/10" : "border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5"}`}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">₹{billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-4 mb-8">
                  <Link 
                    href={plan.name === "Starter" ? "/dashboard" : `/payment?plan=${plan.name.toLowerCase()}&billing=${billingCycle}`} 
                    className="flex-1"
                  >
                    <Button 
                      variant={plan.variant as any} 
                      className="w-full h-12"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                  {plan.name !== "Starter" && (
                    <div className="group relative">
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center cursor-help hover:bg-white/10 transition-colors">
                        <QrIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                      </div>
                      {/* Hover QR Preview */}
                      <div className="absolute bottom-full right-0 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl w-48 text-center">
                          <div className="bg-white p-2 rounded-xl mb-3">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${baseUrl}/payment?plan=${plan.name.toLowerCase()}&billing=${billingCycle}`}
                              alt="Scan to Pay"
                              className="w-full aspect-square"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scan to Pay on Mobile</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* FAQ Preview */}
        <section className="mt-24 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <span className="font-medium">Can I cancel my subscription at any time?</span>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-all" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
