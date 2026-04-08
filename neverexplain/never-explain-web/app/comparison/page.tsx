import DeepComparisonTable from "@/components/DeepComparisonTable";

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Deep Comparison Table</h1>
          <p className="text-lg text-slate-600">
            Compare different approaches for managing context information
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Coding Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">For Developers</h2>
            <DeepComparisonTable category="coding" />
          </div>
          
          {/* Copywriting Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">For Copywriters</h2>
            <DeepComparisonTable category="copywriting" />
          </div>
          
          {/* General Category */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">General</h2>
            <DeepComparisonTable category="general" />
          </div>
        </div>
      </div>
    </div>
  );
}
