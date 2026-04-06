import { BookOpen, ShoppingCart, Menu, Target, Users, Lightbulb, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We are dedicated to empowering the next generation of thinkers, creators, and entrepreneurs 
            with cutting-edge knowledge on finance, technology, and personal development.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              In an era of rapid technological change and economic transformation, we believe knowledge 
              is the most valuable currency. Our mission is to democratize access to high-quality, 
              actionable insights that help individuals navigate the complexities of modern life.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From understanding Gen Z's financial nihilism to mastering AI-powered workflows, 
              we curate content that matters for the forward-thinking creator.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-muted rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Readers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Premium Books</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard 
              icon={<Target className="h-8 w-8" />}
              title="Precision"
              description="Every book is meticulously researched and crafted to deliver maximum value."
            />
            <ValueCard 
              icon={<Users className="h-8 w-8" />}
              title="Community"
              description="We build connections among forward-thinking creators worldwide."
            />
            <ValueCard 
              icon={<Lightbulb className="h-8 w-8" />}
              title="Innovation"
              description="We stay ahead of trends to bring you tomorrow's insights today."
            />
            <ValueCard 
              icon={<Award className="h-8 w-8" />}
              title="Excellence"
              description="Quality is non-negotiable in everything we create."
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're looking to understand the new economic landscape, master micro-finance, 
            or leverage AI for productivity, we're here to guide you every step of the way.
          </p>
          <a 
            href="/books"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Explore Our Books
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl border border-border/20 bg-white/50 backdrop-blur-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
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
              <li><a href="/about" class