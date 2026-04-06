import { BookOpen, ShoppingCart, Menu, Brain, TrendingUp, Cpu } from "lucide-react";

const categories = [
  {
    id: "finance",
    title: "Finance & Economics",
    description: "Master the new economic logic with our finance-focused ebooks",
    icon: <TrendingUp className="h-8 w-8" />,
    books: 2,
    topics: ["Financial Nihilism", "Micro-Finance", "Investment Strategies", "Economic Trends"]
  },
  {
    id: "technology",
    title: "Technology & AI",
    description: "Leverage cutting-edge technology for productivity and growth",
    icon: <Cpu className="h-8 w-8" />,
    books: 1,
    topics: ["AI Automation", "Workflow Optimization", "Productivity Tools", "Future of Work"]
  },
  {
    id: "wellness",
    title: "Wellness & Lifestyle",
    description: "Improve your well-being with evidence-based programs",
    icon: <Brain className="h-8 w-8" />,
    books: 1,
    topics: ["Sleep Restoration", "Stress Management", "Mental Health", "Work-Life Balance"]
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of ebooks organized by topic. Find the perfect resource for your learning journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`/books?category=${category.id}`}
              className="group block p-8 rounded-2xl border border-border/20 bg-white/50 backdrop-blur-sm hover:border-primary/50 hover:bg-white/70 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary">{category.books} Books</span>
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">View All →</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.topics.map((topic, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/5 text-xs font-medium text-primary"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-muted">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground mb-6">
              Browse our complete collection of ebooks or contact us for recommendations tailored to your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/books"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Browse All Books
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-8 py-3 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Ebook Store</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </a>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <ShoppingCart className="h-4 w-4" />
            Cart (0)
          </button>
        </div>
        <button className="md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Ebook Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium digital books for the modern learner.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/books" className="hover:text-primary transition-colors">All Books</a></li>
              <li><a href="/books?filter=new" className="hover:text-primary transition-colors">New Releases</a></li>
              <li><a href="/books?filter=bestsellers" className="hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="/categories" className="hover:text-primary transition-colors">Categories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/refund" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center gap-4 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 6.294 0h8.424c1.26 0 2.233.358 2.905 1.037.672.679.679 1.647.679 2.913 0 2.735-1.727 4.896-4.637 4.896-.679 0-1.25-.14-1.727-.376l-.679 4.267zm2.925-12.677c-1.34 0-2.678.679-3.357 1.357-.679.679-1.018 1.698-1.018 3.016 0 1.318.339 2.337 1.018 3.016.679.679 2.017 1.357 3.357 1.357 1.34 0 2.678-.679 3.357-1.357.679-.679 1.018-1.698 1.018-3.016 0-1.318-.339-2.337-1.018-3.016-.679-.679-2.017-1.357-3.357-1.357z" fill="#003087"/>
                <path d="M15.5 21.337h-4.606a.641.641 0 0 1-.633-.74l3.107-19.696c.056-.357.36-.641.726-.641h4.606c1.26 0 2.233.358 2.905 1.037.672.679.679 1.647.679 2.913 0 2.735-1.727 4.896-4.637 4.896-.679 0-1.25-.14-1.727-.376l-.679 4.267z" fill="#009cde"/>
              </svg>
              <span className="text-sm font-medium text-muted-foreground">Secure Payment via PayPal</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2026 Ebook Store. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
