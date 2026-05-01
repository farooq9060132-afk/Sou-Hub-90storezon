type AdSlot = "header" | "sidebar" | "in-content" | "footer";

interface AdSenseProps {
  slot: AdSlot;
  className?: string;
}

const slotStyles: Record<AdSlot, { height: string; label: string }> = {
  header: { height: "90px", label: "Advertisement — Banner" },
  sidebar: { height: "250px", label: "Advertisement — Sidebar" },
  "in-content": { height: "120px", label: "Advertisement — In Content" },
  footer: { height: "90px", label: "Advertisement — Footer" },
};

export default function AdSense({ slot, className = "" }: AdSenseProps) {
  const style = slotStyles[slot];

  return (
    <div
      className={`w-full border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/20 text-muted-foreground text-xs font-medium ${className}`}
      style={{ minHeight: style.height }}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      <div className="text-center p-2">
        <p className="text-muted-foreground/60">{style.label}</p>
        <p className="text-[10px] text-muted-foreground/40 mt-0.5">Google AdSense — Insert ad code here</p>
      </div>
    </div>
  );
}
