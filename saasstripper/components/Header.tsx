"use client";

export default function Header() {
  const scrollToSection = (id: string) => {
    if (id === "pricing") {
      // 滚动到页面底部（Footer 区域）
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else if (id === "features") {
      // 滚动到 Features 区域（Footer 中的功能网格）
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    } else if (id === "") {
      // Get Started 按钮 - 滚动到输入区域
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // 如果没有 textarea，滚动到页面顶部
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // 尝试滚动到指定 ID 的元素
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              SaaSStripper
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-slate-600 hover:text-indigo-500 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-slate-600 hover:text-indigo-500 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("")}
              className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-500/20"
            >
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
