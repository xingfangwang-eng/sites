import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © 2026 NeverExplain. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/solutions" className="text-slate-500 hover:text-slate-700 text-sm">
              Browse All Solutions
            </Link>
            <Link href="/sitemap" className="text-slate-500 hover:text-slate-700 text-sm">
              Sitemap
            </Link>
            <a href="mailto:457239850@qq.com" className="text-slate-500 hover:text-slate-700 text-sm">
              Support: 457239850@qq.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
