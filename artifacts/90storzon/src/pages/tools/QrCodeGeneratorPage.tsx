import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, QrCode, Download } from "lucide-react";
import { useTrackToolUsage, useTrackPageView } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState("https://90storzon.com");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackTool = useTrackToolUsage();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "QR Code Generator — Create QR Codes Free | 90StorZon";
    trackPageView.mutate({ data: { page: "/tools/qr-code-generator" } });
  }, []);

  const generateQR = async () => {
    if (!text) return;
    try {
      const QRCode = await import("qrcode");
      const dataUrl = await QRCode.toDataURL(text, { width: 256, margin: 2, color: { dark: "#0f2027", light: "#ffffff" } });
      setQrDataUrl(dataUrl);
      trackTool.mutate({ data: { tool: "QR Code Generator" } });
    } catch {
      // fallback: use public QR API
      setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}`);
      trackTool.mutate({ data: { tool: "QR Code Generator" } });
    }
  };

  useEffect(() => { generateQR(); }, []);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <QrCode className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>QR Code Generator</h1>
          <p className="text-sm text-muted-foreground">Create QR codes for any URL or text</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card-border p-8">
        <label className="block text-sm font-medium text-foreground mb-2">URL or Text</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter URL or text..."
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          data-testid="qr-input"
        />
        <Button onClick={generateQR} className="w-full mb-6" data-testid="qr-generate-btn">Generate QR Code</Button>

        {qrDataUrl && (
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-xl border border-border shadow-sm">
              <img src={qrDataUrl} alt="QR Code" className="w-56 h-56" data-testid="qr-code-image" />
            </div>
            <div className="mt-4">
              <button
                onClick={download}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                data-testid="qr-download"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
