import { Metadata } from "next";
import { use } from "react";
import { ChevronRight } from "lucide-react";

// 读取关键词数据
import keywords from "@/data/keywords.json";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const keyword = keywords.find(k => k.slug === params.slug);
  
  if (!keyword) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    };
  }
  
  return {
    title: keyword.title,
    description: keyword.how_to_solve.substring(0, 160),
    openGraph: {
      title: keyword.title,
      description: keyword.how_to_solve.substring(0, 160),
      type: 'article'
    }
  };
}

export async function generateStaticParams() {
  return keywords.map(keyword => ({
    slug: keyword.slug
  }));
}

// 导入客户端组件
import SlugPageContent from "./SlugPageContent";

export default function SlugPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const keyword = keywords.find(k => k.slug === resolvedParams.slug);
  
  if (!keyword) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-slate-600 mb-8">The page you are looking for does not exist.</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors active:scale-95"
          >
            Go Home
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    );
  }
  
  return <SlugPageContent keyword={keyword} />;
}
