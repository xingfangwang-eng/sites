import Sidebar from "@/components/Sidebar";
import HeaderStats from "@/components/HeaderStats";
import TaskBoard from "@/components/TaskBoard";
import DigitalWhipButton from "@/components/DigitalWhipButton";
import FounderToggle from "@/components/FounderToggle";
import Toast from "@/components/Toast";
import LiveActivityFeed from "@/components/LiveActivityFeed";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Welcome to AI-Ops Revenue Whip
              </p>
            </div>

            <FounderToggle />

            <HeaderStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TaskBoard />
              </div>
              <div className="lg:col-span-1">
                <LiveActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </main>

      <DigitalWhipButton />
      <Toast />
    </div>
  );
}
