"use client";

import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";

export default function FounderToggle() {
  const { isFounderView, toggleFounderView } = useDashboard();

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={`text-sm font-medium ${!isFounderView ? "text-gray-900" : "text-gray-500"}`}>
        Employee View
      </span>
      <button
        onClick={toggleFounderView}
        className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ backgroundColor: isFounderView ? "#3b82f6" : "#e5e7eb" }}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: isFounderView ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      <span className={`text-sm font-medium ${isFounderView ? "text-gray-900" : "text-gray-500"}`}>
        Founder View
      </span>
    </div>
  );
}
