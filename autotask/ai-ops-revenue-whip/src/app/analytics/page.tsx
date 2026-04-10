"use client";

import Sidebar from "@/components/Sidebar";
import { useDashboard } from "@/context/DashboardContext";
import { TrendingUp, DollarSign, Users, Activity, BarChart3, PieChart } from "lucide-react";

export default function AnalyticsPage() {
  const { tasks, revenue, isFounderView } = useDashboard();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  const avgPunctuality = Math.round(
    tasks.reduce((sum, t) => sum + t.punctualityScore, 0) / totalTasks
  );

  // Calculate revenue metrics
  const revenuePerTask = Math.round(revenue / totalTasks);
  const estimatedMonthlyRevenue = revenue * 2.5; // Assuming 2.5x multiplier for monthly

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Track performance metrics and business insights
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${revenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {completionRate}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTasks}/{totalTasks}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Avg
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Punctuality Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgPunctuality}%</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    Est.
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(estimatedMonthlyRevenue).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Performance Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Task Performance</h2>
                </div>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                          {task.taskName}
                        </span>
                        <span className="text-sm text-gray-500">{task.punctualityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            task.punctualityScore === 100
                              ? "bg-green-500"
                              : task.punctualityScore < 80
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${task.punctualityScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Distribution</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Revenue per Task</p>
                        <p className="text-xs text-gray-500">Average earnings</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${revenuePerTask.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Growth Rate</p>
                        <p className="text-xs text-gray-500">Month over month</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-600">+18.2%</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Active Clients</p>
                        <p className="text-xs text-gray-500">Current month</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Set(tasks.map(t => t.clientName)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">🎉 High Performance</p>
                  <p className="text-xs text-green-700">
                    {tasks.filter(t => t.punctualityScore >= 90).length} tasks with punctuality above 90%
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">⚠️ Needs Attention</p>
                  <p className="text-xs text-yellow-700">
                    {tasks.filter(t => t.punctualityScore < 80).length} tasks need improvement
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">📈 Growth Potential</p>
                  <p className="text-xs text-blue-700">
                    Revenue can increase by {(revenue * 0.15).toLocaleString()} with 15% improvement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}