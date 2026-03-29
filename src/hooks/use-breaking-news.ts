import { useState, useEffect } from "react";

export interface BreakingNews {
  id: string;
  text: string;
  active: boolean;
  urgent: boolean;
}

const DEFAULT_BREAKING: BreakingNews[] = [
  { id: "1", text: "جلالة الملك محمد السادس يترأس مجلساً وزارياً بالقصر الملكي بالرباط", active: true, urgent: true },
  { id: "2", text: "المغرب يسجل نمواً اقتصادياً ملحوظاً في الربع الأول من السنة", active: true, urgent: false },
  { id: "3", text: "انطلاق فعاليات مهرجان موازين الدولي في دورته الجديدة", active: true, urgent: false },
  { id: "4", text: "المنتخب الوطني يستعد لمواجهة حاسمة في التصفيات الأفريقية", active: true, urgent: false },
];

export function useBreakingNews() {
  const [items, setItemsState] = useState<BreakingNews[]>(() => {
    try {
      const stored = localStorage.getItem("maghrib24_breaking");
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_BREAKING;
  });

  const [tickerEnabled, setTickerEnabledState] = useState<boolean>(() => {
    try {
      return localStorage.getItem("maghrib24_ticker_enabled") !== "false";
    } catch {}
    return true;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem("maghrib24_breaking");
        if (stored) setItemsState(JSON.parse(stored));
        setTickerEnabledState(localStorage.getItem("maghrib24_ticker_enabled") !== "false");
      } catch {}
    };
    window.addEventListener("breaking_updated", handleUpdate);
    return () => window.removeEventListener("breaking_updated", handleUpdate);
  }, []);

  const persist = (data: BreakingNews[]) => {
    localStorage.setItem("maghrib24_breaking", JSON.stringify(data));
    window.dispatchEvent(new Event("breaking_updated"));
  };

  const setItems = (fn: BreakingNews[] | ((p: BreakingNews[]) => BreakingNews[])) => {
    setItemsState((prev: any) => {
      const updated = typeof fn === "function" ? fn(prev) : fn;
      persist(updated);
      return updated;
    });
  };

  const setTickerEnabled = (val: boolean) => {
    setTickerEnabledState(val);
    localStorage.setItem("maghrib24_ticker_enabled", val ? "true" : "false");
    window.dispatchEvent(new Event("breaking_updated"));
  };

  const addItem = (text: string, urgent = false) => {
    setItems((prev: any) => [...prev, { id: Date.now().toString(), text, active: true, urgent }]);
  };

  const deleteItem = (id: string) => {
    setItems((prev: any) => prev.filter((i: any) => i.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems((prev: any) => prev.map((i: any) => (i.id === id ? { ...i, active: !i.active } : i)));
  };

  const updateItem = (id: string, text: string) => {
    setItems((prev: any) => prev.map((i: any) => (i.id === id ? { ...i, text } : i)));
  };

  return { items, tickerEnabled, setTickerEnabled, addItem, deleteItem, toggleItem, updateItem };
}
