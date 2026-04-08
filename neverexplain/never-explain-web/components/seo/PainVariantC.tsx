import { ArrowRight, AlertTriangle, Clock, Calendar, Users, Zap } from "lucide-react";

export default function PainVariantC() {
  return (
    <section className="py-20 bg-red-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            <AlertTriangle size={16} />
            Time Wasted
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">The Cost of Manual SEO</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See how much time and resources developers waste on manual SEO tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Stat 1 */}
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-red-600" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-2">10+</h3>
            <p className="text-slate-600">Hours per week spent on SEO</p>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-red-600" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-2">6+</h3>
            <p className="text-slate-600">Weeks to create 100 landing pages</p>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-red-600" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-2">3+</h3>
            <p className="text-slate-600">Team members needed for SEO</p>
          </div>
          
          {/* Stat 4 */}
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-red-600" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-2">70%</h3>
            <p className="text-slate-600">Productivity loss</p>
          </div>
        </div>
        
        <div className="mt-16 bg-white border border-red-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">The Opportunity Cost</h3>
          <p className="text-lg text-slate-600 mb-6">
            While developers are busy creating landing pages manually, they're missing out on:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-slate-700">Product development and innovation</span>
            </li>
            <li className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-slate-700">Customer acquisition and support</span>
            </li>
            <li className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-slate-700">Marketing and business development</span>
            </li>
            <li className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-slate-700">Personal time and work-life balance</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
            Stop Wasting Time
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}