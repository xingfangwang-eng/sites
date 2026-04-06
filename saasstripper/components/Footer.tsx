export default function Footer() {
  const features = [
    {
      title: "Low-cost API wrapper",
      description: "Affordable solutions for API integration without breaking the bank"
    },
    {
      title: "Tiny SaaS tools for founders",
      description: "Lightweight tools designed for startup founders and indie hackers"
    },
    {
      title: "JSON simplifier for developers",
      description: "Transform complex JSON structures into clean, usable data formats"
    },
    {
      title: "Affordable API integration tool",
      description: "Cost-effective API management tools for startups and indie developers"
    }
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              SaaSStripper
            </span>
          </div>
          
          <p className="text-sm text-slate-500 text-center">
            Solo founder productivity hacks - Streamline your workflow with powerful API data processing tools
          </p>
          
          <div className="text-sm text-slate-500">
            Support: <a href="mailto:457239850@qq.com" className="text-indigo-500 hover:text-indigo-600 transition-colors">457239850@qq.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
