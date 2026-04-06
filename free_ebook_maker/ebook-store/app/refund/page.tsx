import { BookOpen, ShoppingCart, Menu, CheckCircle, Clock, Mail, Shield } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: April 2, 2026</p>

          {/* Hero Section */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-muted mb-12">
            <h2 className="text-2xl font-semibold mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              We stand behind the quality of our ebooks. If you're not completely satisfied with 
              your purchase, we offer a full refund within 30 days of your purchase date. No questions asked.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Eligibility for Refund</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are eligible for a full refund if:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Your refund request is made within 30 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">You can provide your order confirmation or PayPal transaction ID</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">The ebook has not been shared or redistributed</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-white/50">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Contact Us</h3>
                    <p className="text-sm text-muted-foreground">Send an email to xingfang.wang@gmail.com with your refund request</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-white/50">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Provide Details</h3>
                    <p className="text-sm text-muted-foreground">Include your PayPal transaction ID and the email used for purchase</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-white/50">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Receive Refund</h3>
                    <p className="text-sm text-muted-foreground">Refunds are processed within 5-7 business days to your original payment method</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl border border-border/20 bg-white/50">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Request Review</div>
                  <div className="text-sm text-muted-foreground">24-48 hours</div>
                </div>
                <div className="text-center p-4 rounded-xl border border-border/20 bg-white/50">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Confirmation</div>
                  <div className="text-sm text-muted-foreground">Within 48 hours</div>
                </div>
                <div className="text-center p-4 rounded-xl border border-border/20 bg-white/50">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Refund Issued</div>
                  <div className="text-sm text-muted-foreground">5-7 business days</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Purchases made more than 30 days ago</li>
                <li>Ebooks that have been shared or redistributed</li>
                <li>Bulk purchases (more than 10 copies of the same ebook)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our refund policy, please contact us at:
                <br /><br />
                <strong>Email:</strong> xingfang.wang@gmail.com
              </p>
            </section>
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
