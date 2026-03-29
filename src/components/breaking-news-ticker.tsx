import { useEffect, useState } from "react";
import { useBreakingNews } from "@/hooks/use-breaking-news";

export function BreakingNewsTicker() {
  const { items, tickerEnabled } = useBreakingNews();
  const [visible, setVisible] = useState(true);

  // Re-check visibility when storage changes
  useEffect(() => {
    const handleUpdate = () => {
      try {
        setVisible(localStorage.getItem("maghrib24_ticker_enabled") !== "false");
      } catch {}
    };
    window.addEventListener("breaking_updated", handleUpdate);
    return () => window.removeEventListener("breaking_updated", handleUpdate);
  }, []);

  const activeItems = items.filter((i: any) => i.active);

  if (!tickerEnabled || !visible || activeItems.length === 0) return null;

  return (
    <div className="bg-emerald-700 text-white overflow-hidden py-2 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-gold-500 text-white px-3 py-1 font-black text-xs uppercase tracking-widest shadow-lg whitespace-nowrap animate-pulse">
          ⚡ عاجل
        </div>

        {/* Scrolling ticker */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="ticker-content flex gap-16 whitespace-nowrap"
            style={{ animation: "ticker-scroll 40s linear infinite" }}
          >
            {[...activeItems, ...activeItems].map((item, i) => (
              <span key={i} className={`font-medium text-sm ${item.urgent ? "text-yellow-200 font-bold" : ""}`}>
                {item.urgent ? "🔴 " : "• "}
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
