import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Calculator, Weight, DollarSign, Percent, FileText, Key, QrCode, RefreshCw, Globe, ExternalLink, Star, TrendingUp } from "lucide-react";
import { useListBlogPosts, useListProducts, useTrackPageView, getListBlogPostsQueryKey, getListProductsQueryKey } from "@workspace/api-client-react";

const tools = [
  { name: "Age Calculator", href: "/tools/age-calculator", icon: Calculator, desc: "Find your exact age" },
  { name: "BMI Calculator", href: "/tools/bmi-calculator", icon: Weight, desc: "Check your body mass index" },
  { name: "Loan Calculator", href: "/tools/loan-calculator", icon: DollarSign, desc: "Calculate loan payments" },
  { name: "Percentage", href: "/tools/percentage-calculator", icon: Percent, desc: "Quick percentage math" },
  { name: "Word Counter", href: "/tools/word-counter", icon: FileText, desc: "Count words and characters" },
  { name: "Password Gen", href: "/tools/password-generator", icon: Key, desc: "Generate secure passwords" },
  { name: "QR Code", href: "/tools/qr-code-generator", icon: QrCode, desc: "Create QR codes instantly" },
  { name: "Unit Converter", href: "/tools/unit-converter", icon: RefreshCw, desc: "Convert any unit" },
  { name: "Domain Checker", href: "/tools/domain-authority-checker", icon: Globe, desc: "Check domain authority" },
];

const externalLinks = [
  { name: "Our Store", href: "https://example.com/store", desc: "Visit our main store" },
  { name: "Instagram Shop", href: "https://instagram.com", desc: "Follow us on Instagram" },
  { name: "YouTube Channel", href: "https://youtube.com", desc: "Watch our tutorials" },
  { name: "Facebook Page", href: "https://facebook.com", desc: "Join our community" },
];

export default function HomePage() {
  const { data: blogPosts, isLoading: blogLoading } = useListBlogPosts({ query: { queryKey: getListBlogPostsQueryKey() } });
  const { data: products, isLoading: productsLoading } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "90StorZon — Tools, Shop & Knowledge Hub";
    trackPageView.mutate({ data: { page: "/", referrer: document.referrer || undefined } });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              All-in-one digital hub
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tools, Shop &amp;<br />
              <span className="text-primary">Knowledge</span> in One Place
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              90StorZon brings you free productivity tools, quality products, and expert blog content — everything your digital life needs, right here.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/tools" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg" data-testid="hero-cta-tools">
                Explore Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-background border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all" data-testid="hero-cta-shop">
                Visit Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Free Tools</h2>
            <p className="text-muted-foreground mt-1">Powerful utilities, completely free to use</p>
          </div>
          <Link href="/tools" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm" data-testid="home-view-all-tools">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group p-4 bg-card rounded-xl border border-card-border hover:border-primary/40 hover:shadow-md transition-all text-center"
              data-testid={`home-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <tool.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{tool.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Highlights */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Latest Articles</h2>
              <p className="text-muted-foreground mt-1">Expert guides and insights</p>
            </div>
            <Link href="/blog" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm" data-testid="home-view-all-blog">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {blogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-xl border border-card-border p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-6 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(blogPosts || []).slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-card rounded-xl border border-card-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
                  data-testid={`home-blog-${post.id}`}
                >
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">{post.category}</span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Featured Products</h2>
            <p className="text-muted-foreground mt-1">Self Defense Kitchen Tools &amp; More</p>
          </div>
          <Link href="/shop" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm" data-testid="home-view-all-products">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl border border-card-border p-6 animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products || []).filter(p => p.featured).slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group bg-card rounded-xl border border-card-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                data-testid={`home-product-${product.id}`}
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Star className="w-12 h-12 text-primary/40" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
                  <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      View details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* YouTube Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Watch Our Videos</h2>
            <p className="text-muted-foreground mt-2">Tutorials, product reviews, and tips</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-foreground/5 rounded-2xl border border-border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Subscribe to Our Channel</h3>
              <p className="text-muted-foreground mb-6">Get the latest tutorials, tool demos, and product reviews delivered to you.</p>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                data-testid="youtube-subscribe"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* External Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Find Us Everywhere</h2>
          <p className="text-muted-foreground mt-2">Connect with us across all platforms</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {externalLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-card rounded-xl border border-card-border text-center hover:border-primary/40 hover:shadow-md transition-all"
              data-testid={`external-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ExternalLink className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-foreground">{link.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
