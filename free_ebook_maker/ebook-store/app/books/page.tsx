import { BookOpen, ShoppingCart, Menu, CheckCircle } from "lucide-react";
import Image from "next/image";

const books = [
  {
    id: 1,
    title: "21-Day Deep Sleep Restoration",
    subtitle: "A Systematic Program for High-Stress Individuals",
    price: "$9.90",
    description: "A comprehensive program designed for high-stress individuals to restore deep sleep patterns and improve overall well-being.",
    core: "Financial Nihilism & Gen Z's Investment Logic",
    tags: ["#EconomicPsychology", "#TrendAnalysis"],
    features: ["21-day program", "Sleep tracking templates", "Stress management techniques", "Audio guides"],
    image: "/images/book1-deep-sleep.jpg",
    category: "new"
  },
  {
    id: 2,
    title: "Micro-Finance",
    subtitle: "Gen Z's Fragmented Investment Logic",
    price: "$9.90",
    description: "Explore how micro-finance platforms are transforming global banking and empowering millions with financial access.",
    core: "The Rise of Micro-Finance & Decentralized Survival",
    tags: ["#FinTech", "#PracticalGuide"],
    features: ["Real-time analytics", "Investment strategies", "Case studies", "Community access"],
    image: "/images/book2-micro-finance.jpg",
    category: "bestseller"
  },
  {
    id: 3,
    title: "Efficient Workflows in the AI Era",
    subtitle: "Building Your Solo Company Architecture",
    price: "$9.90",
    description: "Learn how to leverage artificial intelligence and automation to build efficient workflows for your solo company.",
    core: "AI Automation Workflows & Solo Company Architecture",
    tags: ["#AIAutomation", "#Productivity"],
    features: ["AI tool integrations", "Workflow templates", "Productivity hacks", "Scaling strategies"],
    image: "/images/book3-ai-workflows.jpg",
    category: "new"
  }
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Books</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium ebooks on finance, technology, and personal growth.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function BookCard({ book }: { book: typeof books[0] }) {
  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=xingfang.wang@gmail.com&item_name=${encodeURIComponent(book.title)}&amount=9.90&currency_code=USD`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/20 bg-white/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50">
      <div className="h-[400px] bg-gradient-to-br from-primary/10 via-muted/20 to-muted/30 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image 
          src={book.image} 
          alt={book.title}
          width={300}
          height={400}
          className="object-contain w-auto h-full max-w-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-lg md:text-2xl font-bold text-primary leading-tight">{book.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground font-medium">{book.subtitle}</p>
        </div>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
            <p className="text-xs md:text-sm text-muted-foreground"><span className="font-semibold">Core:</span> {book.core}</p>
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {book.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-primary/10 text-[10px] md:text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{book.description}</p>
        <ul className="space-y-1 md:space-y-2">
          {book.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-xs md:text-sm">
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 md:pt-4 border-t border-border/50">
          <div className="space-y-0 md:space-y-1">
            <span className="text-2xl md:text-3xl font-bold text-primary">{book.price}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground block md:inline">Instant Download</span>
          </div>
          <a 
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto"
          >
            Buy Now
          </a>
        </div>
      </div>
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
