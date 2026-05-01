import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Percent } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<0|1|2>(0);
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Percentage Calculator — Quick Percentage Math | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/percentage-calculator" } });
  }, []);

  const calculate = () => {
    const x = parseFloat(a), y = parseFloat(b);
    let r: number;
    if (mode === 0) r = (x / 100) * y;
    else if (mode === 1) r = (x / y) * 100;
    else r = y + (x / 100) * y;
    setResult(isNaN(r) ? "Invalid input" : mode === 1 ? `${Math.round(r * 100) / 100}%` : `${Math.round(r * 100) / 100}`);
    trackTool.mutate({ data: { tool: "Percentage Calculator" } });
  };

  const modes = [
    { label: "X% of Y", desc: "What is X% of Y?" },
    { label: "X is what % of Y", desc: "What percentage is X of Y?" },
    { label: "Y + X% increase", desc: "Y increased by X%" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Percent className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Percentage Calculator</h1>
          <p className="text-sm text-muted-foreground">Quick percentage calculations</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-card-border p-8">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {modes.map((m, i) => (
            <button key={i} onClick={() => { setMode(i as 0|1|2); setResult(null); }}
              className={`p-3 rounded-lg text-xs font-medium transition-colors text-center ${mode === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              data-testid={`pct-mode-${i}`}
            >{m.label}</button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{modes[mode].desc}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">X</label>
            <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="X value"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" data-testid="pct-x" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Y</label>
            <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="Y value"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" data-testid="pct-y" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full" data-testid="pct-calculate-btn">Calculate</Button>
        {result && (
          <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-4xl font-bold text-primary" data-testid="pct-result">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
