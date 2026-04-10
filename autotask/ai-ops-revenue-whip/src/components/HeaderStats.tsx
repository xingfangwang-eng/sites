"use client";

import { DollarSign, Percent, Clock, TrendingUp } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";

export default function HeaderStats() {
  const { revenue, isFounderView } = useDashboard();

  const profitMargin = Math.round((revenue * 0.35) / 100) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            +12.5%
          </span>
        </div>
        <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">
          Active Client Revenue
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900">${revenue.toLocaleString()}</p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            {isFounderView ? (
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            ) : (
              <Percent className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            )}
          </div>
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            {isFounderView ? "Profit" : "Your Share"}
          </span>
        </div>
        <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">
          {isFounderView ? "Total Profit Margin" : "Your Current Share"}
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900">
          {isFounderView ? `$${profitMargin.toLocaleString()}` : "15%"}
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm sm:col-span-2 lg:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Excellent
          </span>
        </div>
        <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">
          Avg. Punctuality
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900">98%</p>
      </motion.div>
    </div>
  );
}
