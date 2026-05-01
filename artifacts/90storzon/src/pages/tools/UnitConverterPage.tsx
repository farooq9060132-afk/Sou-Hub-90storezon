import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";

type Category = "length" | "weight" | "temperature" | "volume";

const units: Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: "Millimeters (mm)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: "Centimeters (cm)", toBase: v => v / 100, fromBase: v => v * 100 },
    { label: "Meters (m)", toBase: v => v, fromBase: v => v },
    { label: "Kilometers (km)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: "Inches (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: "Feet (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: "Miles (mi)", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
  ],
  weight: [
    { label: "Milligrams (mg)", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    { label: "Grams (g)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: "Kilograms (kg)", toBase: v => v, fromBase: v => v },
    { label: "Pounds (lbs)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: "Ounces (oz)", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  temperature: [
    { label: "Celsius (°C)", toBase: v => v, fromBase: v => v },
    { label: "Fahrenheit (°F)", toBase: v => (v - 32) / 1.8, fromBase: v => v * 1.8 + 32 },
    { label: "Kelvin (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  volume: [
    { label: "Milliliters (ml)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: "Liters (L)", toBase: v => v, fromBase: v => v },
    { label: "Cups", toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    { label: "Pints", toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    { label: "Gallons", toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
  ],
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(2);
  const [toIdx, setToIdx] = useState(0);
  const [value, setValue] = useState("1");
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Unit Converter — Convert Length, Weight & More | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/unit-converter" } });
  }, []);

  const currentUnits = units[category];
  const fromUnit = currentUnits[fromIdx];
  const toUnit = currentUnits[toIdx];
  const inputVal = parseFloat(value);
  const result = !isNaN(inputVal) ? Math.round(toUnit.fromBase(fromUnit.toBase(inputVal)) * 1000000) / 1000000 : null;

  const handleCategoryChange = (c: Category) => {
    setCategory(c); setFromIdx(0); setToIdx(1); setValue("1");
    trackTool.mutate({ data: { tool: "Unit Converter" } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Unit Converter</h1>
          <p className="text-sm text-muted-foreground">Convert between units of measurement</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(["length", "weight", "temperature", "volume"] as Category[]).map(c => (
            <button key={c} onClick={() => handleCategoryChange(c)}
              className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              data-testid={`unit-cat-${c}`}
            >{c}</button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">From</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={value} onChange={e => setValue(e.target.value)}
                className="col-span-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="unit-value-input" />
              <select value={fromIdx} onChange={e => setFromIdx(parseInt(e.target.value))}
                className="col-span-2 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="unit-from-select">
                {currentUnits.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={() => { setFromIdx(toIdx); setToIdx(fromIdx); }}
              className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              data-testid="unit-swap">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">To</label>
            <select value={toIdx} onChange={e => setToIdx(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-3"
              data-testid="unit-to-select">
              {currentUnits.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="mt-4 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">{value} {currentUnits[fromIdx].label} =</p>
            <p className="text-4xl font-bold text-primary" data-testid="unit-result">{result}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentUnits[toIdx].label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
