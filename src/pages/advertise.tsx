import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Mail, Megaphone } from "lucide-react";

function useSeoMeta(title: string, description: string, canonical: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", canonical, true);
    setMeta("og:locale", "ar_MA", true);
    setMeta("og:site_name", "MAGHREB 24", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setLink("canonical", canonical);
  }, [title, description, canonical]);
}

export default function AdvertisePage() {
  useSeoMeta("الإعلانات | MAGHREB 24", "اعرض إعلانك على مغرب 24", "https://www.maghrib24.com/advertise");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse">
          <Link href="/" className="hover:text-emerald-600">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600">الإعلانات</span>
        </nav>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <Megaphone className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">الإعلانات والشراكات</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            للإعلان على موقع مغرب 24، يرجى التواصل معنا عبر البريد الإلكتروني
          </p>
          <a
            href="mailto:maghrib24com@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors"
          >
            <Mail className="w-5 h-5" />
            maghrib24com@gmail.com
          </a>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-emerald-600">الرئيسية</Link>
          <span className="mx-2"></span>
          <Link href="/about" className="hover:text-emerald-600">من نحن</Link>
          <span className="mx-2"></span>
          <Link href="/contact" className="hover:text-emerald-600">تواصل معنا</Link>
        </div>
      </div>
    </div>
  );
}
