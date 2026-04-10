"use client";

import Sidebar from "@/components/Sidebar";
import { useDashboard } from "@/context/DashboardContext";
import { FolderKanban, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export default function ProjectsPage() {
  const { tasks } = useDashboard();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const avgPunctuality = Math.round(
    tasks.reduce((sum, t) => sum + t.punctualityScore, 0) / totalTasks
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Projects
              </h1>
              <p className="text-gray-600">
                Manage and track all your AI automation projects
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Projects</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-500">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Avg Punctuality</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{avgPunctuality}%</p>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Projects</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {task.taskName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{task.clientName}</p>
                        <div className="flex items-center gap-2">
                          {task.status === "done" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <Clock className="w-3.5 h-3.5" />
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Punctuality</p>
                        <p className={`text-lg font-semibold ${
                          task.punctualityScore === 100 
                            ? "text-green-600" 
                            : task.punctualityScore < 80 
                              ? "text-red-600" 
                              : "text-yellow-600"
                        }`}>
                          {task.punctualityScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
