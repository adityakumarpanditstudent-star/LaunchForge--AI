"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  useEffect(() => {
    const applyTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let themeToApply = localStorage.getItem("theme") || "dark";

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("theme")
          .eq("id", user.id)
          .single();

        if (profile?.theme) {
          themeToApply = profile.theme;
        }
      }

      if (themeToApply === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    };

    applyTheme();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("theme")
          .eq("id", session.user.id)
          .single();

        const newTheme = profile?.theme || localStorage.getItem("theme") || "dark";
        if (newTheme === "light") {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return <>{children}</>;
};
