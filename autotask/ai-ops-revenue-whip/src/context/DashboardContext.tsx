"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Task {
  id: string;
  taskName: string;
  clientName: string;
  status: "in-progress" | "done";
  punctualityScore: number;
  icon: string;
}

interface DashboardContextType {
  tasks: Task[];
  revenue: number;
  isFounderView: boolean;
  whipAnimation: boolean;
  toastMessage: string | null;
  markTaskAsDone: (taskId: string) => void;
  toggleFounderView: () => void;
  triggerWhipAnimation: (clientName: string) => void;
  clearToast: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "1",
    taskName: "Notion-Claude Sync Automation",
    clientName: "6-Figure Agency X",
    status: "in-progress",
    punctualityScore: 85,
    icon: "database",
  },
  {
    id: "2",
    taskName: "AI Content Pipeline Setup",
    clientName: "Tech Startup Y",
    status: "done",
    punctualityScore: 100,
    icon: "workflow",
  },
  {
    id: "3",
    taskName: "Revenue Dashboard Integration",
    clientName: "E-commerce Brand Z",
    status: "in-progress",
    punctualityScore: 72,
    icon: "chart",
  },
  {
    id: "4",
    taskName: "Automated Reporting System",
    clientName: "Consulting Firm A",
    status: "in-progress",
    punctualityScore: 94,
    icon: "file-text",
  },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [revenue, setRevenue] = useState(12400);
  const [isFounderView, setIsFounderView] = useState(false);
  const [whipAnimation, setWhipAnimation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const markTaskAsDone = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId && task.status === "in-progress"
          ? { ...task, status: "done" as const, punctualityScore: 100 }
          : task
      )
    );
    setRevenue((prev) => prev + 200);
  };

  const toggleFounderView = () => {
    setIsFounderView((prev) => !prev);
  };

  const triggerWhipAnimation = (clientName: string) => {
    setWhipAnimation(true);
    setToastMessage(`CRACK! ⚡ Claude is now working 2.5x faster for ${clientName}`);
    
    setTimeout(() => {
      setWhipAnimation(false);
    }, 600);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  return (
    <DashboardContext.Provider
      value={{
        tasks,
        revenue,
        isFounderView,
        whipAnimation,
        toastMessage,
        markTaskAsDone,
        toggleFounderView,
        triggerWhipAnimation,
        clearToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
