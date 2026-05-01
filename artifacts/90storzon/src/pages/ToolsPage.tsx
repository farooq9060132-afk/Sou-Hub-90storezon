import { useEffect } from "react";
import { Link } from "wouter";
import { Calculator, Weight, DollarSign, Percent, FileText, Key, QrCode, RefreshCw, Globe, ArrowRight } from "lucide-react";
import { useTrackPageView } from "@workspace/api-client-react";

const tools = [
  { name: "Age Calculator", href: "/tools/age-calculator", icon: Calculator, desc: "Calculate your exact age in years, months, and days from your date of birth.", category: "Math" },
  { name: "BMI Calculator", href: "/tools/bmi-calculator", icon: Weight, desc: "Determine your Body Mass Index and understand your health category.", category: "Health" },
  { name: "Loan Calculator", href: "/tools/loan-calculator", icon: DollarSign, desc: "Calculate monthly payments, total interest, and loan schedules.", category: "Finance" },
  { name: "Percentage Calculator", href: "/tools/percentage-calculator", icon: Percent, desc: "Calculate percentages, percentage change, and percentage of amounts.", category: "Math" },
  { name: "Word Counter", href: "/tools/word-counter", icon: FileText, desc: "Count words, characters, sentences, and paragraphs in any text.", category: "Writing" },
  { name: "Password Generator", href: "/tools/password-generator", icon: Key, desc: "Generate strong, secure passwords with customizable parameters.", category: "Security" },
  { name: "QR Code Generator", href: "/tools/qr-code-generator", icon: QrCode, desc: "Create QR codes for URLs, text, contact info, and more.", category: "Utility" },
  { name: "Unit Converter", href: "/tools/unit-converter", icon: RefreshCw, desc: "Convert between length, weight, temperature, volume, and more.", category: "Utility" },
  { name: "Domain Authority Checker", href: "/tools/domain-authority-checker", icon: Globe, desc: "Check the authority score of any website domain.", category: "SEO" },
];

export default function ToolsPage() {
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Free Online Tools — 90StorZon";
    trackPageView.mutate({ data: { page: "/tools", referrer: document.referrer || undefined } });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Free Online Tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful, fast, and completely free utilities for everyday tasks. No signup required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="group bg-card rounded-xl border border-card-border p-6 hover:border-primary/50 hover:shadow-lg transition-all"
            data-testid={`tool-card-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                <tool.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">{tool.category}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium">
                  Use tool <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
