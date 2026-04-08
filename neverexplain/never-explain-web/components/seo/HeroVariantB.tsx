import { ArrowRight } from "lucide-react";

export default function HeroVariantB() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Programmatic SEO
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-300">
            Made Simple
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Automatically generate 100+ SEO-friendly landing pages for niche questions. 
          Improve your search rankings and drive targeted traffic to your website with minimal effort.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-slate-900 font-medium rounded-md hover:bg-slate-100 transition-colors active:scale-95 flex items-center justify-center gap-2">
            Get Started
            <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 border border-white/30 text-white font-medium rounded-md hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-16 inline-block">
          <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Trusted by 1,000+ developers</span> – Generate pages in minutes, not weeks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}