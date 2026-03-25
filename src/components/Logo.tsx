import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative z-10"
        >
          <Rocket className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500 blur-xl -z-0"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1 -right-1 text-blue-400"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight leading-none">
          LaunchForge <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-0.5">
          Neural Engine v2.0
        </span>
      </div>
    </div>
  );
};
