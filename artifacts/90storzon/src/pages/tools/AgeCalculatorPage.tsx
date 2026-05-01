import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calculator } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Age Calculator — Find Your Exact Age | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/age-calculator" } });
  }, []);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    setResult({ years, months, days });
    trackTool.mutate({ data: { tool: "Age Calculator" } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Age Calculator</h1>
          <p className="text-sm text-muted-foreground">Find your exact age in years, months, and days</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          data-testid="age-calculator-input"
        />
        <Button onClick={calculate} className="w-full" data-testid="age-calculator-submit">Calculate Age</Button>

        {result && (
          <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center">Your Exact Age</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: result.years, label: "Years" },
                { value: result.months, label: "Months" },
                { value: result.days, label: "Days" },
              ].map(item => (
                <div key={item.label} className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-3xl font-bold text-primary" data-testid={`age-${item.label.toLowerCase()}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 prose max-w-none">
        <h2 className="text-xl font-semibold text-foreground mb-2">How to Use the Age Calculator</h2>
        <p className="text-muted-foreground">Simply enter your date of birth using the date picker above and click "Calculate Age". The tool will instantly show your exact age in years, months, and days.</p>
      </div>
    </div>
  );
}
