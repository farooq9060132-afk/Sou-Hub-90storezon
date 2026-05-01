import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Loan Calculator — Monthly Payment Calculator | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/loan-calculator" } });
  }, []);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(months, 10);
    if (!p || !n) return;
    let monthly: number;
    if (r === 0) {
      monthly = p / n;
    } else {
      monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const total = monthly * n;
    setResult({ monthly: Math.round(monthly * 100) / 100, total: Math.round(total * 100) / 100, interest: Math.round((total - p) * 100) / 100 });
    trackTool.mutate({ data: { tool: "Loan Calculator" } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Loan Calculator</h1>
          <p className="text-sm text-muted-foreground">Calculate monthly payments and total cost</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <div className="space-y-4 mb-4">
          {[
            { label: "Loan Amount ($)", value: principal, set: setPrincipal, placeholder: "e.g. 10000", testId: "loan-principal" },
            { label: "Annual Interest Rate (%)", value: rate, set: setRate, placeholder: "e.g. 5.5", testId: "loan-rate" },
            { label: "Loan Term (months)", value: months, set: setMonths, placeholder: "e.g. 36", testId: "loan-months" },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
              <input type="number" value={field.value} onChange={e => field.set(e.target.value)} placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid={field.testId} />
            </div>
          ))}
        </div>
        <Button onClick={calculate} className="w-full" data-testid="loan-calculate-btn">Calculate</Button>

        {result && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: "Monthly Payment", value: `$${result.monthly.toFixed(2)}`, testId: "loan-monthly" },
              { label: "Total Payment", value: `$${result.total.toFixed(2)}`, testId: "loan-total" },
              { label: "Total Interest", value: `$${result.interest.toFixed(2)}`, testId: "loan-interest" },
            ].map(item => (
              <div key={item.label} className="bg-primary/5 rounded-xl border border-primary/20 p-4 text-center">
                <p className="text-xl font-bold text-primary" data-testid={item.testId}>{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
