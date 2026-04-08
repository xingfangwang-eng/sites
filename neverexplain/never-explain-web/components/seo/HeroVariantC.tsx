import { ArrowRight, MessageSquare, Check } from "lucide-react";

export default function HeroVariantC() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              Automate Your SEO
              <br />
              <span className="text-red-600">Effortlessly</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Generate hundreds of SEO-friendly landing pages for niche questions. 
              Our platform handles the heavy lifting, so you can focus on growing your business.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-slate-700">Static page generation for better performance</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-slate-700">SEO-optimized metadata for higher rankings</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-slate-700">Easy integration with your existing Next.js app</span>
              </li>
            </ul>
            <button className="px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2">
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
          
          {/* Right Dialog Animation */}
          <div className="relative">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Alice Developer</p>
                  <p className="text-sm text-slate-500">2 minutes ago</p>
                </div>
              </div>
              <p className="text-slate-700 mb-4">
                "I used this tool to generate 100+ landing pages for my SaaS product. 
                My organic traffic increased by 300% in just 2 months!"
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Write a reply..." 
                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-100 rounded-full -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}