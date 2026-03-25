import Link from "next/link";

import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 px-6 glass mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-gray-400 leading-relaxed">
            Generate ultra-modern, high-converting landing pages in seconds with the power of AI.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Generate</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 LaunchForge AI. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
        </div>
      </div>
    </footer>
  );
};
