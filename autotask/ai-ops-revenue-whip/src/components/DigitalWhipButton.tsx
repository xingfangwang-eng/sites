"use client";

import { Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";

export default function DigitalWhipButton() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { triggerWhipAnimation, tasks } = useDashboard();

  const handleClick = () => {
    setIsAnimating(true);
    
    const inProgressTasks = tasks.filter(t => t.status === "in-progress");
    const randomTask = inProgressTasks[Math.floor(Math.random() * inProgressTasks.length)];
    
    if (randomTask) {
      triggerWhipAnimation(randomTask.clientName);
    } else {
      triggerWhipAnimation("All Clients");
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-xs md:text-sm rounded-2xl shadow-lg hover:shadow-xl overflow-hidden"
      >
        <motion.div
          animate={isAnimating ? {
            rotate: [0, -15, 15, -15, 15, 0],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 md:gap-2 relative z-10"
        >
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline">Whip</span>
          <span className="sm:hidden">W</span>
        </motion.div>
        
        <motion.div
          className="absolute inset-0 bg-white"
          animate={isAnimating ? { opacity: [0, 0.3, 0] } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </motion.button>
    </motion.div>
  );
}
