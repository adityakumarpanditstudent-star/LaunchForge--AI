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
  };
  sections: Section[];
  conversionStrategy: {
    urgency: string;
    trustElements: string;
    ctaStrategy: string;
  };
}

export const generateLandingPage = async (formData: {
  businessName: string;
  description?: string;
  targetAudience: string;
  tone: string;
  goal: string;
  features: string;
}): Promise<LandingPageBlueprint> => {
  // In a real app, this would be a call to an LLM API.
  // For now, we simulate a sophisticated AI generation logic based on the inputs.
  
  const getThemeByTone = (tone: string) => {
    switch (tone) {
      case 'luxury':
        return {
          colors: { primary: '#D4AF37', secondary: '#1A1A1A', background: '#000000', accent: '#D4AF37' },
          typography: { heading: 'serif', body: 'sans-serif' }
        };
      case 'GenZ':
        return {
          colors: { primary: '#FF00E5', secondary: '#00F0FF', background: '#0A0A0A', accent: '#FFFF00' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
      case 'minimalist':
        return {
          colors: { primary: '#FFFFFF', secondary: '#A1A1AA', background: '#000000', accent: '#3B82F6' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
      case 'bold':
        return {
          colors: { primary: '#EF4444', secondary: '#F97316', background: '#000000', accent: '#FFFFFF' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
      case 'witty':
        return {
          colors: { primary: '#FACC15', secondary: '#A855F7', background: '#000000', accent: '#FACC15' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
      case 'empathetic':
        return {
          colors: { primary: '#10B981', secondary: '#3B82F6', background: '#000000', accent: '#10B981' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
      case 'technical':
        return {
          colors: { primary: '#6366F1', secondary: '#4F46E5', background: '#000000', accent: '#6366F1' },
          typography: { heading: 'monospace', body: 'sans-serif' }
        };
      default:
        return {
          colors: { primary: '#3B82F6', secondary: '#8B5CF6', background: '#000000', accent: '#3B82F6' },
          typography: { heading: 'sans-serif', body: 'sans-serif' }
        };
    }
  };

  const theme = getThemeByTone(formData.tone);

  // Helper to generate content based on tone
  const generateContent = (base: string, tone: string) => {
    const tones: Record<string, Record<string, string>> = {
      GenZ: {
        headline: `Fr, ${formData.businessName} is the main character 💅`,
        subheadline: `Stop sleeping on your potential. No cap, this is the only tool you need to revolutionize your ${formData.description}. It's giving main character energy.`,
        cta: "Bet. Let's Go 🚀",
        featuresTitle: "The Vibe Check",
        benefitsTitle: "Why We're Different",
        pricingTitle: "Pick Your Player"
      },
      luxury: {
        headline: `The Absolute Pinnacle of ${formData.description}: ${formData.businessName}`,
        subheadline: `An unparalleled, bespoke experience meticulously crafted for the most discerning ${formData.targetAudience}. Elevate your standards to the extraordinary.`,
        cta: "Request Exclusive Access",
        featuresTitle: "The Artisanal Collection",
        benefitsTitle: "The Distinction of Quality",
        pricingTitle: "Investment Tiers"
      },
      witty: {
        headline: `Finally, ${formData.description} that doesn't make you want to cry.`,
        subheadline: `We built ${formData.businessName} because we were tired of the "industry leaders" who clearly forgot how humans work. Your sanity will thank you.`,
        cta: "Do the Thing (Safely)",
        featuresTitle: "Cool Stuff We Actually Do",
        benefitsTitle: "Your Life, But Better",
        pricingTitle: "The 'Not-A-Scam' Pricing"
      },
      bold: {
        headline: `DOMINATE ${formData.description.toUpperCase()} WITH UNRIVALED POWER.`,
        subheadline: `${formData.businessName} is engineered for the high-performers who refuse to settle for mediocrity. Stop waiting. Start leading.`,
        cta: "SEIZE CONTROL NOW",
        featuresTitle: "The Arsenal",
        benefitsTitle: "Strategic Advantage",
        pricingTitle: "Choose Your Power"
      },
      minimalist: {
        headline: `${formData.businessName}. Perfectly Refined.`,
        subheadline: `The essential tools for ${formData.description}, simplified. No clutter. Just pure performance for ${formData.targetAudience}.`,
        cta: "Begin the Journey",
        featuresTitle: "Core Essentials",
        benefitsTitle: "Pure Value",
        pricingTitle: "Simple Plans"
      },
      technical: {
        headline: `${formData.businessName}: The Advanced Infrastructure for ${formData.description}`,
        subheadline: `A high-performance, low-latency framework designed specifically for ${formData.targetAudience}. Scale your operations with sub-millisecond precision.`,
        cta: "Deploy Now",
        featuresTitle: "Technical Specifications",
        benefitsTitle: "Operational Efficiency",
        pricingTitle: "Resource Allocation"
      }
    };

    const defaultContent = {
      headline: `Elevate Your ${formData.description} with ${formData.businessName}`,
      subheadline: `The most advanced, comprehensive solution for ${formData.targetAudience} looking to master ${formData.description} with unprecedented ease.`,
      cta: "Start Your Free Trial",
      featuresTitle: "Premium Features",
      benefitsTitle: "Unmatched Benefits",
      pricingTitle: "Flexible Pricing"
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
        layout: formData.tone === 'minimalist' ? 'centered' : 'split',
        visualHierarchy: 'High - Large headline with glowing accents',
        buttonStyle: formData.tone === 'luxury' ? 'Elegant outline' : 'Glow effect with scaling'
      },
      animations: {
        onScroll: 'Fade in and scale up',
        special: 'Typing animation for the headline'
      },
      responsive: {
        mobileLayout: 'Centered stack',
        stacking: 'Vertical'
      }
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
        layout: 'grid',
        visualHierarchy: 'Medium - Icon-led feature cards',
        cardStyle: 'Glassmorphism with hover lift'
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
          layout: 'split',
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
          layout: 'grid',
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
          items: [
            { title: 'Growth', price: '$29', features: ['10 Generations/mo', 'Standard Analytics', 'Email Support', '1 Team Member'] },
            { title: 'Scale', price: '$99', features: ['Unlimited Generations', 'Advanced Insights', '24/7 Priority Support', '5 Team Members', 'Custom Branding'] }
          ]
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

  return {
    businessName: formData.businessName,
    tone: formData.tone,
    goal: formData.goal,
    theme,
    sections,
    conversionStrategy: {
      urgency: 'Add limited time offer badge in hero',
      trustElements: 'Show verified by badge next to CTA',
      ctaStrategy: 'Use contrasting colors for the main button'
    }
  };
};
