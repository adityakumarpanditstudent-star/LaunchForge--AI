"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass"
    >
      <Link href="/" className="flex items-center gap-2">
        <Logo />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline" size="sm">Log in</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="glow" size="sm">Start Free Trial</Button>
        </Link>
      </div>
    </motion.nav>
  );
};
