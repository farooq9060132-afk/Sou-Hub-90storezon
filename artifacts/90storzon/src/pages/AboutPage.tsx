import { useEffect } from "react";
import { Wrench, Target, Users, Zap } from "lucide-react";
import { useTrackPageView } from "@workspace/api-client-react";

export default function AboutPage() {
  const trackPageView = useTrackPageView();
  useEffect(() => {
    document.title = "About Us — 90StorZon";
    trackPageView.mutate({ data: { page: "/about" } });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About 90StorZon</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're building the most useful all-in-one digital hub — where tools, products, and knowledge come together.
        </p>
      </div>

      <div className="prose max-w-none text-foreground mb-10">
        <p className="text-lg text-muted-foreground leading-relaxed">
          90StorZon was founded with a single mission: make everyday digital tasks simpler. Whether you need to calculate your BMI, generate a secure password, or find quality kitchen tools — we've got you covered.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Our platform combines free productivity tools, a curated product shop, and expert knowledge through our blog — all in one place, with no subscription required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Target, title: "Our Mission", desc: "To provide accessible, free tools that help people accomplish everyday tasks with ease and confidence." },
          { icon: Users, title: "Our Community", desc: "We serve thousands of users daily — students, professionals, and everyday people who want to get things done faster." },
          { icon: Zap, title: "Our Approach", desc: "Everything we build is fast, free, and focused. No bloat. No paywalls. Just genuinely useful tools." },
        ].map(item => (
          <div key={item.title} className="bg-card rounded-xl border border-card-border p-6 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">What We Offer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          {["9 Free Tools", "Quality Products", "Expert Blog", "User Dashboard"].map(item => (
            <div key={item} className="bg-background/50 rounded-lg p-3 font-medium text-foreground">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
