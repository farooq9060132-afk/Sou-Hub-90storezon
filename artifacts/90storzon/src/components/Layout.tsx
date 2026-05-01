import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Wrench, User } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube, SiX } from "react-icons/si";
import { useGetCurrentUser } from "@workspace/api-client-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { icon: SiFacebook, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram", color: "#E4405F" },
  { icon: SiTiktok, href: "https://tiktok.com", label: "TikTok", color: "#000000" },
  { icon: SiYoutube, href: "https://youtube.com", label: "YouTube", color: "#FF0000" },
  { icon: SiX, href: "https://x.com", label: "X (Twitter)", color: "#000000" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { data: user } = useGetCurrentUser({ query: { queryKey: ["getCurrentUser"] } });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Wrench className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                90<span className="text-primary">Stor</span>Zon
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  data-testid="nav-dashboard"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="nav-login"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                    data-testid="nav-register"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="nav-mobile-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex gap-2">
                {user ? (
                  <Link href="/dashboard" className="flex-1 text-center px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1 text-center px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" className="flex-1 text-center px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md" onClick={() => setMobileOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  90StorZon
                </span>
              </div>
              <p className="text-sm text-background/70 leading-relaxed">
                Your all-in-one digital hub for tools, products, and knowledge.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3 text-background">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/70">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-3 text-background">Popular Tools</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/tools/age-calculator" className="hover:text-primary transition-colors">Age Calculator</Link></li>
                <li><Link href="/tools/bmi-calculator" className="hover:text-primary transition-colors">BMI Calculator</Link></li>
                <li><Link href="/tools/loan-calculator" className="hover:text-primary transition-colors">Loan Calculator</Link></li>
                <li><Link href="/tools/password-generator" className="hover:text-primary transition-colors">Password Generator</Link></li>
                <li><Link href="/tools/qr-code-generator" className="hover:text-primary transition-colors">QR Code Generator</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3 text-background">Legal</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>&copy; {new Date().getFullYear()} 90StorZon. All rights reserved.</p>
            <p>Built with passion for tools and productivity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
