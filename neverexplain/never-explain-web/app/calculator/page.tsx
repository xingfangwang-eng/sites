import WorkflowLossCalculator from "@/components/WorkflowLossCalculator";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Workflow Loss Calculator</h1>
          <p className="text-lg text-slate-600">
            Calculate how much time and money you're losing by manually entering context information
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Coding Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">For Developers</h2>
            <WorkflowLossCalculator category="coding" />
          </div>
          
          {/* Marketing Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">For Marketers</h2>
            <WorkflowLossCalculator category="marketing" />
          </div>
          
          {/* General Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">General</h2>
            <WorkflowLossCalculator category="general" />
          </div>
        </div>
      </div>
    </div>
  );
}
