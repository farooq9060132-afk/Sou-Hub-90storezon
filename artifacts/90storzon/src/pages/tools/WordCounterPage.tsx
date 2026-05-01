import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    document.title = "Word Counter — Count Words & Characters | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/word-counter" } });
  }, []);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (!tracked && e.target.value.length > 0) {
      trackTool.mutate({ data: { tool: "Word Counter" } });
      setTracked(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Word Counter</h1>
          <p className="text-sm text-muted-foreground">Count words, characters, sentences and more</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-card-border p-8">
        <textarea
          value={text}
          onChange={handleChange}
          rows={10}
          placeholder="Paste or type your text here..."
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
          data-testid="word-counter-input"
        />
        <button onClick={() => { setText(""); setTracked(false); }} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Clear</button>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {[
            { label: "Words", value: words, testId: "word-count" },
            { label: "Characters", value: chars, testId: "char-count" },
            { label: "No Spaces", value: charsNoSpace, testId: "char-no-space" },
            { label: "Sentences", value: sentences, testId: "sentence-count" },
            { label: "Paragraphs", value: paragraphs, testId: "paragraph-count" },
            { label: "Read Time", value: `${readTime}m`, testId: "read-time" },
          ].map(item => (
            <div key={item.label} className="bg-primary/5 rounded-lg border border-primary/20 p-3 text-center">
              <p className="text-2xl font-bold text-primary" data-testid={item.testId}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
