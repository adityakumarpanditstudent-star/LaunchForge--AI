export interface Section {
  id: string;
  type: 'hero' | 'features' | 'benefits' | 'social-proof' | 'pricing' | 'cta';
  content: {
    title: string;
    subtitle?: string;
    description?: string;
    cta?: {
      text: string;
      link: string;
    };
    items?: Array<{
      title?: string;
      description?: string;
      icon?: string;
      quote?: string;
      author?: string;
      role?: string;
      price?: string;
      features?: string[];
    }>;
  };
  design: {
    layout: 'centered' | 'split' | 'grid' | 'asymmetric';
    visualHierarchy: string;
    cardStyle?: string;
    buttonStyle?: string;
  };
  animations: {
    onScroll?: string;
    transition?: string;
    hover?: string;
    special?: string;
  };
  responsive: {
    mobileLayout: string;
    stacking: string;
  };
  premium?: {
    variations?: {
      headlines: string[];
      ctas: string[];
    };
    uxSuggestions: string[];
    animations: {
      reveal: string;
      microInteractions: string;
    };
  };
}

export interface LandingPageBlueprint {
  businessName: string;
  tone: string;
  goal: string;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      accent: string;
    };
    typography: {
      heading: string;
      body: string;
    };
    visualSystem?: {
      gradients: string[];
      glowEffects: string;
    };
  };
  sections: Section[];
  conversionStrategy: {
    urgency: string;
    trustElements: string;
    ctaStrategy: string;
    premiumInsights?: string[];
  };
}

export const generateLandingPage = async (formData: {
  businessName: string;
  description: string;
  targetAudience: string;
  tone: string;
  goal: string;
  features: string;
}, userPlan: 'starter' | 'pro' | 'premium' = 'starter'): Promise<LandingPageBlueprint> => {
  const isPremiumUser = userPlan === 'pro' || userPlan === 'premium';
  const isEliteUser = userPlan === 'premium';

  const getThemeByTone = (tone: string) => {
    // ... existing theme switch ...
    let baseTheme;
    switch (tone) {
      case 'luxury':
        baseTheme = {
          colors: { primary: '#D4AF37', secondary: '#1A1A1A', background: '#000000', accent: '#D4AF37' },
          typography: { heading: 'serif', body: 'sans-serif' }
        };
        break;
      case 'GenZ':
        baseTheme = {
          colors: { primary: '#FF00E5', secondary: '#00F0FF', background: '#0A0A0A', accent: '#FFFF00' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
        break;
      case 'minimalist':
        baseTheme = {
          colors: { primary: '#FFFFFF', secondary: '#A1A1AA', background: '#000000', accent: '#3B82F6' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
        break;
      case 'bold':
        baseTheme = {
          colors: { primary: '#EF4444', secondary: '#F97316', background: '#000000', accent: '#FFFFFF' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
        break;
      case 'witty':
        baseTheme = {
          colors: { primary: '#FACC15', secondary: '#A855F7', background: '#000000', accent: '#FACC15' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
        break;
      case 'empathetic':
        baseTheme = {
          colors: { primary: '#10B981', secondary: '#3B82F6', background: '#000000', accent: '#10B981' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
        break;
      case 'technical':
        baseTheme = {
          colors: { primary: '#6366F1', secondary: '#4F46E5', background: '#000000', accent: '#6366F1' },
          typography: { heading: 'monospace', body: 'sans-serif' }
        };
        break;
      default:
        baseTheme = {
          colors: { primary: '#3B82F6', secondary: '#8B5CF6', background: '#000000', accent: '#3B82F6' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
    }

    if (isPremiumUser) {
      return {
        ...baseTheme,
        visualSystem: {
          gradients: [
            `linear-gradient(to right, ${baseTheme.colors.primary}, ${baseTheme.colors.secondary})`,
            `radial-gradient(circle at top left, ${baseTheme.colors.primary}20, transparent)`
          ],
          glowEffects: `0 0 40px ${baseTheme.colors.primary}30`
        }
      };
    }
    return baseTheme;
  };

  const theme = getThemeByTone(formData.tone);

  // Helper to generate content based on tone
  const generateContent = (base: string, tone: string) => {
    const tones: Record<string, any> = {
      GenZ: {
        headline: isPremiumUser ? `The absolute main character moment for ${formData.businessName} 💅` : `Fr, ${formData.businessName} is the main character 💅`,
        subheadline: isPremiumUser 
          ? `Stop sleeping on your potential. No cap, this is the only tool you need to revolutionise your ${formData.description}. Your digital aura is about to peak.`
          : `Stop sleeping on your potential. No cap, this is the only tool you need to revolutionize your ${formData.description}. It's giving main character energy.`,
        cta: "Bet. Let's Go 🚀",
        featuresTitle: "The Vibe Check",
        benefitsTitle: "Why We're Different",
        pricingTitle: "Pick Your Player",
        pricingPlans: [
          { title: 'The Main Character', price: '$0', features: ['All Basic Vibes', 'No Cap Support', 'Community Hype'] },
          { title: 'The Final Boss', price: '$49', features: ['Unlimited Aura', 'Priority Vibe Check', 'Exclusive Skins'] }
        ],
        variations: isEliteUser ? {
          headlines: ["Main Character Energy Only", "Digital Aura Maximized", "The Vibe Check Passed"],
          ctas: ["Secure the Bag", "Enter the Metaverse", "Join the Squad"]
        } : undefined
      },
      // ... (other tones would be updated similarly)
    };

    const defaultContent = {
      headline: isPremiumUser ? `Master your ${formData.description} with the power of ${formData.businessName}` : `Elevate Your ${formData.description} with ${formData.businessName}`,
      subheadline: isPremiumUser 
        ? `A production-ready solution engineered specifically for ${formData.targetAudience}. Achieve 10x results through conversion-optimized design systems.`
        : `The most advanced, comprehensive solution for ${formData.targetAudience} looking to master ${formData.description} with unprecedented ease.`,
      cta: "Start Your Free Trial",
      featuresTitle: "Premium Features",
      benefitsTitle: "Unmatched Benefits",
      pricingTitle: "Flexible Pricing",
      pricingPlans: [
        { title: 'Starter', price: '$29', features: ['Basic Features', 'Community Support', '1 Project'] },
        { title: 'Professional', price: '$99', features: ['All Features', 'Priority Support', 'Unlimited Projects', 'Custom Branding'] }
      ]
    };

    return tones[tone] || defaultContent;
  };

  const contentSet = generateContent(formData.description || "", formData.tone);

  const sections: Section[] = [
    {
      id: 'hero',
      type: 'hero',
      content: {
        title: contentSet.headline,
        subtitle: contentSet.subheadline,
        cta: { text: contentSet.cta, link: '#' }
      },
      design: {
        layout: isPremiumUser ? 'asymmetric' : (formData.tone === 'minimalist' ? 'centered' : 'split'),
        visualHierarchy: isPremiumUser ? 'Premium - Tiered layers with parallax depth' : 'High - Large headline with glowing accents',
        buttonStyle: isPremiumUser ? 'Magnetic glow with haptic hover' : (formData.tone === 'luxury' ? 'Elegant outline' : 'Glow effect with scaling')
      },
      animations: {
        onScroll: isPremiumUser ? 'Reveal with perspective shift' : 'Fade in and scale up',
        special: isPremiumUser ? 'Dynamic gradient text reveal' : 'Typing animation for the headline'
      },
      responsive: {
        mobileLayout: 'Centered stack',
        stacking: 'Vertical'
      },
      premium: isPremiumUser ? {
        variations: contentSet.variations,
        uxSuggestions: ["Use a secondary CTA below the fold", "Ensure 1.5x line-height for readability"],
        animations: { reveal: "3D Perspective", microInteractions: "Magnetic Button" }
      } : undefined
    },
    {
      id: 'features',
      type: 'features',
      content: {
        title: contentSet.featuresTitle,
        items: [
          { title: 'Intelligent Automation', description: `Leverage our proprietary AI models to automate 90% of your ${formData.description} workflow instantly.` },
          { title: 'Real-time Analytics', description: 'Monitor every metric that matters with our blazing-fast, sub-second latency dashboard.' },
          { title: 'Seamless Integration', description: `Connect ${formData.businessName} with your entire existing tech stack in just a few clicks.` },
          { title: 'Enterprise Security', description: 'Bank-grade encryption and SOC2 compliance to keep your most sensitive data protected.' },
          { title: 'Adaptive Learning', description: 'The more you use it, the smarter it gets. Custom-tailored to your unique business needs.' },
          { title: 'Global Infrastructure', description: 'Deploy anywhere with our distributed network, ensuring peak performance for all users.' }
        ]
      },
      design: {
        layout: isPremiumUser ? 'asymmetric' : 'grid',
        visualHierarchy: isPremiumUser ? 'Premium - Feature grid with focus states' : 'Medium - Icon-led feature cards',
        cardStyle: isPremiumUser ? 'Glassmorphism with dynamic glow' : 'Glassmorphism with hover lift'
      },
      animations: {
        onScroll: 'Staggered fade-in',
        hover: 'Lift and subtle glow'
      },
      responsive: {
        mobileLayout: 'Single column grid',
        stacking: 'Vertical'
      }
    },
    {
      id: 'benefits',
      type: 'benefits',
      content: {
        title: contentSet.benefitsTitle,
        items: [
          { title: 'Unprecedented Speed', description: `Finish tasks in minutes that used to take hours. ${formData.businessName} is the ultimate time-multiplier.` },
          { title: 'Maximum ROI', description: `Our conversion-focused architecture ensures that every ${formData.description} action contributes to your bottom line.` },
          { title: 'Collaborative Power', description: 'Built for teams of all sizes. Share, review, and deploy together without friction.' }
        ]
      },
      design: {
        layout: isPremiumUser ? 'asymmetric' : 'split',
        visualHierarchy: 'Medium - Image and text side-by-side'
      },
      animations: {
        onScroll: 'Slide in from left/right'
      },
      responsive: {
        mobileLayout: 'Vertical stack with image on top',
        stacking: 'Vertical'
      }
    },
    {
      id: 'social-proof',
      type: 'social-proof',
      content: {
        title: 'Trusted by Visionary Leaders',
        items: [
          { quote: `${formData.businessName} has completely redefined our approach to ${formData.description}. The results were immediate and massive.`, author: 'Sarah Chen', role: 'CTO at TechFlow' },
          { quote: 'The most intuitive, powerful platform we have ever used. It feels like magic.', author: 'Mark Rivera', role: 'Founder, Innovate AI' },
          { quote: 'We saw a 40% increase in efficiency within the first two weeks. Absolutely essential.', author: 'Elena Rodriguez', role: 'Product Lead, Nexus' }
        ]
      },
      design: {
        layout: isPremiumUser ? 'grid' : 'grid',
        visualHierarchy: 'Low - Clean testimonial cards'
      },
      animations: {
        onScroll: 'Fade in on scroll'
      },
      responsive: {
        mobileLayout: 'Carousel on mobile',
        stacking: 'Horizontal scroll'
      }
    },
    {
      id: 'pricing',
      type: 'pricing',
      content: {
        title: contentSet.pricingTitle,
        items: contentSet.pricingPlans
      },
      design: {
        layout: 'centered',
        visualHierarchy: 'High - Featured plan highlight'
      },
      animations: {
        onScroll: 'Pop-in effect'
      },
      responsive: {
        mobileLayout: 'Vertical stack',
        stacking: 'Vertical'
      }
    },
    {
      id: 'cta-final',
      type: 'cta',
      content: {
        title: 'Ready to Transform Your Business?',
        subtitle: 'Join thousands of founders who are already ahead.',
        cta: { text: 'Join the Beta', link: '#' }
      },
      design: {
        layout: 'centered',
        visualHierarchy: 'High - Large background gradient'
      },
      animations: {
        onScroll: 'Scale up on appearance'
      },
      responsive: {
        mobileLayout: 'Centered',
        stacking: 'Vertical'
      }
    }
  ];

  // Premium users get more sections
  if (isPremiumUser) {
    sections.splice(sections.length - 1, 0, {
      id: 'faq',
      type: 'features', // Reusing features type for now or could add new type
      content: {
        title: "Frequently Asked Questions",
        items: [
          { title: "How fast can I get started?", description: "Instant access. Deploy your first page in under 60 seconds." },
          { title: "Is there a custom API?", description: "Yes, our enterprise plan includes full API access for programmatic page generation." },
          { title: "Can I export the code?", description: "Pro and Premium users can export the full React/Tailwind source code." }
        ]
      },
      design: { layout: 'grid', visualHierarchy: 'Clean accordion style' },
      animations: { onScroll: 'Slide up' },
      responsive: { mobileLayout: 'Stack', stacking: 'Vertical' }
    });
  }

  return {
    businessName: formData.businessName,
    tone: formData.tone,
    goal: formData.goal,
    theme,
    sections,
    conversionStrategy: {
      urgency: isPremiumUser ? 'Psychological scarcity triggers in hero' : 'Add limited time offer badge in hero',
      trustElements: isPremiumUser ? 'Animated social proof ticker' : 'Show verified by badge next to CTA',
      ctaStrategy: isPremiumUser ? 'High-contrast focal point mapping' : 'Use contrasting colors for the main button',
      premiumInsights: isPremiumUser ? ["Conversion likely to increase by 24% with this layout", "A/B test the headline variations for optimal CTR"] : undefined
    }
  };
};

