"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";
import { X } from "lucide-react";

export default function Toast() {
  const { toastMessage, clearToast } = useDashboard();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-[100]"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 sm:min-w-[400px]">
            <div className="flex-1">
              <p className="text-sm sm:text-lg font-bold">{toastMessage}</p>
            </div>
            <button
              onClick={clearToast}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
