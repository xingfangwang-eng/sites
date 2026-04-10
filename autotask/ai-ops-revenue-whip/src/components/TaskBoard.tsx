"use client";

import { CheckCircle2, Clock, Database, Workflow, BarChart3, FileText } from "lucide-react";
import { motion, easeInOut } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";

const iconMap: Record<string, React.ReactNode> = {
  database: <Database className="w-4 h-4" />,
  workflow: <Workflow className="w-4 h-4" />,
  chart: <BarChart3 className="w-4 h-4" />,
  "file-text": <FileText className="w-4 h-4" />,
};

export default function TaskBoard() {
  const { tasks, whipAnimation, markTaskAsDone } = useDashboard();

  const shakeAnimation = {
    x: whipAnimation ? [0, -10, 10, -10, 10, 0] : 0,
    transition: {
      duration: 0.4,
      ease: easeInOut,
    },
  };

  const getPunctualityColor = (score: number) => {
    if (score === 100) return "bg-green-500";
    if (score < 80) return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Client Ops</h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Active tasks and their progress</p>
      </div>

      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            animate={shakeAnimation}
            className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">
                  {iconMap[task.icon] || <Database className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                    {task.taskName}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">{task.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
                {task.status === "done" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Done
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">In Progress</span>
                      <span className="sm:hidden">Active</span>
                    </span>
                    <button
                      onClick={() => markTaskAsDone(task.id)}
                      className="px-2 md:px-3 py-1 md:py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-colors whitespace-nowrap"
                    >
                      Mark Done
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 ml-11">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-gray-600">Punctuality Score</span>
                <span className="font-semibold text-gray-900">{task.punctualityScore}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 md:h-2.5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${getPunctualityColor(task.punctualityScore)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${task.punctualityScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
