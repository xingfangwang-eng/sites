'use client';

import { BookOpen, ShoppingCart, Menu, X, CheckCircle, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    image: "/images/book1-deep-sleep.jpg"
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
    image: "/images/book2-micro-finance.jpg"
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
    image: "/images/book3-ai-workflows.jpg"
  }
];

const faqs = [
  {
    question: "What formats are the ebooks available in?",
    answer: "All our ebooks are available in both EPUB and PDF formats, ensuring compatibility with all major e-readers and devices."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, contact us for a full refund."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Absolutely! Contact us for special pricing on orders of 5 or more ebooks, perfect for teams and educational institutions."
  },
  {
    question: "How do I access my purchased ebooks?",
    answer: "After purchase, you'll receive an instant download link. Your ebooks will also be available in your account dashboard for anytime access."
  }
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);
  const [email, setEmail] = useState("");

  const openModal = (book: typeof books[0]) => {
    setSelectedBook(book);
    setEmail("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedBook) return;
    
    try {
      let orderId = '';
      
      // 尝试插入订单数据到 Supabase
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            email,
            book_name: selectedBook.title,
            status: 'pending'
          })
          .select('id')
          .single();
        
        if (error) {
          console.warn('Warning: Failed to save order to Supabase:', error);
        } else if (data) {
          orderId = data.id;
          console.log('Order saved to Supabase successfully! Order ID:', orderId);
        }
      } catch (supabaseError) {
        console.warn('Warning: Supabase connection error:', supabaseError);
      }
      
      // Get PayPal URL with custom field (order_id)
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=xingfang.wang@gmail.com&item_name=${encodeURIComponent(selectedBook.title)}&amount=9.90&currency_code=USD&custom=${encodeURIComponent(orderId)}&return=${encodeURIComponent(window.location.origin + '/success?order_id=' + orderId)}&cancel_return=${encodeURIComponent(window.location.origin)}`;
      
      // Open PayPal in new tab
      window.open(paypalUrl, '_blank');
      
      // Close modal
      closeModal();
    } catch (error) {
      console.error('Error processing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <BooksGallery books={books} onBuyClick={openModal} />
      <FAQ faqs={faqs} />
      <Footer />
      
      <EmailCollectionModal 
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        book={selectedBook}
      />
    </div>
  );
}

function EmailCollectionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  email, 
  setEmail, 
  book 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  book: typeof books[0] | null;
}) {
  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-2xl border border-border/20 bg-white/95 backdrop-blur-xl shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-6">
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Where should we send your PDF?</h3>
              <p className="text-muted-foreground">
                We'll send your ebook download link to this email address
              </p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
                  I agree to receive email updates and marketing communications
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Proceed to Payment
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                By proceeding, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Ebook Store</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
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

function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Master the New
            <br />
            <span className="text-primary">Economic Logic</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            A Trilogy on Financial Nihilism, Micro-Finance, and AI Sovereignty
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse Collection
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-muted border border-border p-8">
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-8xl">📚</div>
                <p className="text-xl font-semibold">Start Your Journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BooksGallery({ books, onBuyClick }: { books: typeof books; onBuyClick: (book: typeof books[0]) => void }) {
  return (
    <section id="books" className="container mx-auto px-4 py-20 md:py-32">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Featured Books</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our most popular titles
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onBuyClick={onBuyClick} />
        ))}
      </div>
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-primary/5 px-6 py-3 border border-primary/10">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-muted border-2 border-background flex items-center justify-center text-xs">👤</div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-muted border-2 border-background flex items-center justify-center text-xs">👤</div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-muted border-2 border-background flex items-center justify-center text-xs">👤</div>
          </div>
          <p className="text-sm font-medium text-primary">Already read by 1000+ forward-thinking creators</p>
        </div>
      </div>
    </section>
  );
}

function BookCard({ book, onBuyClick }: { book: typeof books[0]; onBuyClick: (book: typeof books[0]) => void }) {
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
          <button 
            onClick={() => onBuyClick(book)}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function FAQ({ faqs }: { faqs: typeof faqs }) {
  return (
    <section id="faq" className="container mx-auto px-4 py-20 md:py-32">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about our ebooks
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg p-6 font-medium transition-colors hover:bg-muted/50">
        {question}
        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 text-muted-foreground">
        {answer}
      </div>
    </details>
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
