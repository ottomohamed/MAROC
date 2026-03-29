import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

// تهيئة React Query مع إعدادات متقدمة
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// تسجيل Service Worker للتحديثات (اختياري)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(console.error);
}

// إضافة مستمع لأخطاء JavaScript
window.addEventListener("error", (event: any) => {
  console.error("Global error:", event.error);
});

// إضافة مستمع لأخطاء الـ Promise
window.addEventListener("unhandledrejection", (event: any) => {
  console.error("Unhandled promise rejection:", event.reason);
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "12px",
          direction: "rtl",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
    <App />
  </QueryClientProvider>
);
