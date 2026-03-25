"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Sparkles, 
  LayoutGrid, 
  CreditCard, 
  Settings, 
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Logo } from './Logo';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Sparkles, label: "Generate", href: "/dashboard" },
  { icon: LayoutGrid, label: "Templates", href: "/templates" },
  { icon: CreditCard, label: "Billing", href: "/pricing" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-white/5 h-screen sticky top-0 bg-black backdrop-blur-xl flex flex-col p-6 transition-colors duration-300">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Logo />
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
