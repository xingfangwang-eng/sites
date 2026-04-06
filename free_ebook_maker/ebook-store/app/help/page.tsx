import { BookOpen, ShoppingCart, Menu, Search, FileText, Download, CreditCard, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I access my ebook after purchase?",
    answer: "After completing your purchase via PayPal, you will receive a download link via email within 5 minutes. You can also access all your purchased ebooks from your account dashboard."
  },
  {
    question: "What formats are the ebooks available in?",
    answer: "All our ebooks are available in PDF, EPUB, and MOBI formats, ensuring compatibility with all major e-readers including Kindle, iPad, Kobo, and Nook."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, simply contact us at xingfang.wang@gmail.com with your order details."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our support team via email at xingfang.wang@gmail.com or through our contact page. We typically respond within 24 hours during business days."
  }
];

const helpCategories = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Getting Started",
    description: "Learn how to purchase and download your first ebook",
    articles: ["How to create an account", "Making your first purchase", "Supported devices"]
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Downloads & Access",
    description: "Everything about accessing your purchased content",
    articles: ["Download instructions", "Accessing your library", "File formats explained"]
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Payments & Billing",
    description: "Information about payments, refunds, and billing",
    articles: ["Payment methods", "Refund policy", "Invoice requests"]
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Contact Support",
    description: "Get help from our dedicated support team",
    articles: ["Email support", "Response times", "Technical issues"]
  }
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {helpCategories.map((category, index) => (
            <div key={index} className="p-6 rounded-xl border border-border/20 bg-white/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-sm text-primary hover:underline">{article}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border border-border/20 bg-white/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Still need help?</p>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
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