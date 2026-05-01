import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, Key, Copy, RefreshCw, Check } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Password Generator — Create Secure Passwords | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/password-generator" } });
  }, []);

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword("Select at least one character type"); return; }
    let pwd = "";
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
    trackTool.mutate({ data: { tool: "Password Generator" } });
  }, [length, upper, lower, numbers, symbols]);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = [upper, lower, numbers, symbols].filter(Boolean).length + (length >= 16 ? 1 : 0) + (length >= 20 ? 1 : 0);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Key className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Password Generator</h1>
          <p className="text-sm text-muted-foreground">Generate strong, secure passwords</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        {/* Password display */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-sm text-foreground break-all" data-testid="password-output">{password}</div>
          <button onClick={copy} className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0" data-testid="password-copy">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={generate} className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0" data-testid="password-regenerate">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Strength bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Password Strength</span>
            <span>{strength <= 2 ? "Weak" : strength <= 4 ? "Good" : "Strong"}</span>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= strength ? (strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500") : "bg-muted"}`} />
            ))}
          </div>
        </div>

        {/* Length */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-foreground mb-2">
            <label>Length</label><span className="text-primary">{length}</span>
          </div>
          <input type="range" min={6} max={50} value={length} onChange={e => setLength(parseInt(e.target.value))}
            className="w-full accent-primary" data-testid="password-length" />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Uppercase (A-Z)", checked: upper, set: setUpper, testId: "opt-upper" },
            { label: "Lowercase (a-z)", checked: lower, set: setLower, testId: "opt-lower" },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers, testId: "opt-numbers" },
            { label: "Symbols (!@#)", checked: symbols, set: setSymbols, testId: "opt-symbols" },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)}
                className="rounded border-border accent-primary" data-testid={opt.testId} />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        <Button onClick={generate} className="w-full" data-testid="password-generate-btn">Generate New Password</Button>
      </div>
    </div>
  );
}
