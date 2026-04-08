import { ArrowRight, Check, X } from "lucide-react";

export default function PainVariantA() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">The Problem with Traditional SEO</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See how our solution compares to the old way of creating landing pages
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-4 px-6 text-left font-semibold">Aspect</th>
                <th className="py-4 px-6 text-left font-semibold">Before</th>
                <th className="py-4 px-6 text-left font-semibold">After</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 bg-white">
                <td className="py-4 px-6 font-medium text-slate-900">Page Creation Time</td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <X size={16} className="text-red-500" />
                  <span>Hours per page</span>
                </td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Minutes for 100+ pages</span>
                </td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-6 font-medium text-slate-900">SEO Optimization</td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <X size={16} className="text-red-500" />
                  <span>Manual, error-prone</span>
                </td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Automated, consistent</span>
                </td>
              </tr>
              <tr className="border-b border-slate-200 bg-white">
                <td className="py-4 px-6 font-medium text-slate-900">Scalability</td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <X size={16} className="text-red-500" />
                  <span>Limited by manual labor</span>
                </td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Unlimited pages</span>
                </td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-6 font-medium text-slate-900">Performance</td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <X size={16} className="text-red-500" />
                  <span>Dynamic pages, slow</span>
                </td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Static pages, fast</span>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="py-4 px-6 font-medium text-slate-900">Maintenance</td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <X size={16} className="text-red-500" />
                  <span>Time-consuming updates</span>
                </td>
                <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Update once, propagate everywhere</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
            See How It Works
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}