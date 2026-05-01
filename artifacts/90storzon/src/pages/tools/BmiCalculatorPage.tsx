import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Weight } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
  return { label: "Obese", color: "text-red-500" };
}

export default function BmiCalculatorPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "BMI Calculator — Body Mass Index | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/bmi-calculator" } });
  }, []);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return;
    let bmi: number;
    if (unit === "metric") {
      bmi = w / ((h / 100) * (h / 100));
    } else {
      bmi = (703 * w) / (h * h);
    }
    setResult(Math.round(bmi * 10) / 10);
    trackTool.mutate({ data: { tool: "BMI Calculator" } });
  };

  const category = result ? getBmiCategory(result) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Weight className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>BMI Calculator</h1>
          <p className="text-sm text-muted-foreground">Calculate your Body Mass Index</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <div className="flex gap-2 mb-6">
          {(["metric", "imperial"] as const).map(u => (
            <button key={u} onClick={() => { setUnit(u); setResult(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${unit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              data-testid={`bmi-unit-${u}`}
            >
              {u === "metric" ? "Metric (kg, cm)" : "Imperial (lbs, in)"}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="bmi-weight-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Height ({unit === "metric" ? "cm" : "inches"})</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="bmi-height-input" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full" data-testid="bmi-calculate-btn">Calculate BMI</Button>

        {result && category && (
          <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-5xl font-bold text-primary mb-2" data-testid="bmi-result">{result}</p>
            <p className={`text-lg font-semibold ${category.color}`}>{category.label}</p>
            <div className="mt-4 text-xs text-muted-foreground grid grid-cols-4 gap-1">
              {[{ r: "< 18.5", l: "Underweight" }, { r: "18.5–24.9", l: "Normal" }, { r: "25–29.9", l: "Overweight" }, { r: "≥ 30", l: "Obese" }].map(c => (
                <div key={c.l} className="bg-background rounded p-2">
                  <p className="font-medium text-foreground">{c.r}</p>
                  <p>{c.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
