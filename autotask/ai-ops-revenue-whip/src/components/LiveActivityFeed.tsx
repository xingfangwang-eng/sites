"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Database, GitBranch, Cpu } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface ActivityItem {
  id: number;
  message: string;
  icon: React.ReactNode;
  timestamp: string;
}

const activityMessages = [
  { message: "Claude is parsing Notion DB...", icon: <Database className="w-3.5 h-3.5" /> },
  { message: "Agent optimized 42 workflows", icon: <GitBranch className="w-3.5 h-3.5" /> },
  { message: "Processing client data streams", icon: <Activity className="w-3.5 h-3.5" /> },
  { message: "AI model updated successfully", icon: <Cpu className="w-3.5 h-3.5" /> },
  { message: "Automated 15 task assignments", icon: <Zap className="w-3.5 h-3.5" /> },
  { message: "Syncing with external APIs", icon: <Database className="w-3.5 h-3.5" /> },
  { message: "Generated revenue forecast report", icon: <Activity className="w-3.5 h-3.5" /> },
  { message: "Optimized database queries", icon: <Cpu className="w-3.5 h-3.5" /> },
];

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const idCounterRef = useRef(0);

  useEffect(() => {
    const addActivity = () => {
      const randomActivity = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      const now = new Date();
      const timestamp = now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        second: "2-digit"
      });

      const newActivity: ActivityItem = {
        id: idCounterRef.current++,
        message: randomActivity.message,
        icon: randomActivity.icon,
        timestamp,
      };

      setActivities((prev) => [newActivity, ...prev].slice(0, 8));
    };

    addActivity();
    const interval = setInterval(addActivity, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900">Live Claude Activity</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">Real-time AI operations</p>
      </div>

      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
