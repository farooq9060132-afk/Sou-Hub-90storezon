import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Globe, Search } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

function simulateDA(domain: string): { da: number; pa: number; links: number; spam: number } {
  let hash = 0;
  for (const c of domain) hash = (hash * 31 + c.charCodeAt(0)) % 100;
  const da = 20 + (hash % 55);
  const pa = Math.max(10, da - 5 + (hash % 15));
  const links = Math.round(da * 150 + hash * 10);
  const spam = Math.round(hash % 25);
  return { da, pa, links, spam };
}

export default function DomainAuthorityPage() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<{ da: number; pa: number; links: number; spam: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Domain Authority Checker — Check DA Score | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/domain-authority-checker" } });
  }, []);

  const check = async () => {
    if (!domain) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1200));
    const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    setResult(simulateDA(clean));
    setLoading(false);
    trackTool.mutate({ data: { tool: "Domain Authority Checker" } });
  };

  const getDaColor = (da: number) => da >= 60 ? "text-green-500" : da >= 30 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Domain Authority Checker</h1>
          <p className="text-sm text-muted-foreground">Check the authority score of any website</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <label className="block text-sm font-medium text-foreground mb-2">Domain Name</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="example.com"
            className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="da-domain-input"
          />
          <Button onClick={check} disabled={loading || !domain} className="shrink-0" data-testid="da-check-btn">
            {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Note: Results are simulated for demonstration purposes.</p>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Domain Authority", value: result.da, max: 100, testId: "da-score" },
                { label: "Page Authority", value: result.pa, max: 100, testId: "pa-score" },
              ].map(item => (
                <div key={item.label} className="bg-primary/5 rounded-xl border border-primary/20 p-5 text-center">
                  <p className={`text-4xl font-bold ${getDaColor(item.value)}`} data-testid={item.testId}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  <div className="mt-3 bg-muted rounded-full h-2">
                    <div className={`h-full rounded-full ${item.value >= 60 ? "bg-green-500" : item.value >= 30 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground" data-testid="da-links">{result.links.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Backlinks (estimated)</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${result.spam < 15 ? "text-green-500" : "text-red-500"}`} data-testid="da-spam">{result.spam}%</p>
                <p className="text-xs text-muted-foreground mt-1">Spam Score</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
