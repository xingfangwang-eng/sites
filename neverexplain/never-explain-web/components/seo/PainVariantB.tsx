import { ArrowRight, MessageSquare, User } from "lucide-react";

export default function PainVariantB() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What Developers Are Saying</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See the pain points developers face with traditional SEO approaches
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reddit Post 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">dev_frustrated</p>
                <p className="text-sm text-slate-500">2 hours ago · r/webdev</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              I'm spending 10+ hours a week creating SEO landing pages
            </h3>
            <p className="text-slate-600 mb-4">
              "I need to create 50+ landing pages for my SaaS product, but it's taking forever. 
              Each page needs unique content, metadata, and testing. I'm burning out and 
              falling behind on other tasks. There has to be a better way!"
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                <MessageSquare size={14} />
                24 comments
              </button>
              <span>•</span>
              <span>128 upvotes</span>
            </div>
          </div>
          
          {/* Reddit Post 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">seo_wizard</p>
                <p className="text-sm text-slate-500">1 day ago · r/SEO</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              How do you scale SEO content creation?
            </h3>
            <p className="text-slate-600 mb-4">
              "I'm struggling to scale my SEO efforts. I know I need more landing pages 
              targeting long-tail keywords, but manually creating each one is unsustainable. 
              Any tools or strategies that can help automate this process?"
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                <MessageSquare size={14} />
                37 comments
              </button>
              <span>•</span>
              <span>215 upvotes</span>
            </div>
          </div>
          
          {/* Reddit Post 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">startup_foundr</p>
                <p className="text-sm text-slate-500">3 days ago · r/startups</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              SEO is killing my startup's productivity
            </h3>
            <p className="text-slate-600 mb-4">
              "As a solo founder, I can't afford to spend all my time on SEO. I need to focus on 
              product development and customer acquisition. But without good SEO, I can't get 
              organic traffic. It's a catch-22. Is there a way to automate SEO content creation 
              without sacrificing quality?"
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                <MessageSquare size={14} />
                56 comments
              </button>
              <span>•</span>
              <span>342 upvotes</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2 mx-auto">
            Our Solution
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}