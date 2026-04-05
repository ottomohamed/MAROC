import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Mail, Phone, MapPin, Clock, Send, Twitter, Facebook, Instagram, Youtube, Loader2, Check } from "lucide-react";

/* â”€â”€â”€ SEO Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    setMeta("og:site_name", "Ù…ØºØ±Ø¨ 24", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setLink("canonical", canonical);

    // JSON-LD LocalBusiness + ContactPage schema
    const schemaId = "contact-schema";
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) { script = document.createElement("script"); script.id = schemaId; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "Ù…ØºØ±Ø¨ 24",
      "url": "https://www.maghrib24.com",
      "logo": "https://www.maghrib24.com/favicon.svg",
      "contactPoint": [
        { "@type": "ContactPoint", "telephone": "+212-522-000-000", "contactType": "customer service", "areaServed": "MA", "availableLanguage": ["Arabic", "French"] },
        { "@type": "ContactPoint", "email": "contact@maghrib24.com", "contactType": "editorial", "availableLanguage": "Arabic" },
        { "@type": "ContactPoint", "email": "pub@maghrib24.com", "contactType": "sales", "availableLanguage": ["Arabic", "French"] },
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ø´Ø§Ø±Ø¹ Ù…Ø­Ù…Ø¯ Ø§Ù„Ø®Ø§Ù…Ø³ØŒ Ø±Ù‚Ù… 45",
        "addressLocality": "Ø§Ù„Ø¯Ø§Ø± Ø§Ù„Ø¨ÙŠØ¶Ø§Ø¡",
        "postalCode": "20000",
        "addressCountry": "MA"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://twitter.com/maghrib24",
        "https://www.facebook.com/maghrib24",
        "https://www.instagram.com/maghrib24",
        "https://www.youtube.com/@maghrib24"
      ]
    });
  }, [title, description, canonical]);
}

/* â”€â”€â”€ Contact info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CONTACTS = [
  {
    dept: "Ø§Ù„ØªØ­Ø±ÙŠØ± Ø§Ù„Ø¹Ø§Ù…",
    desc: "Ù„Ù„Ø£Ø®Ø¨Ø§Ø± ÙˆØ§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª ÙˆØ§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø§Ù„ØµØ­ÙÙŠØ©",
    email: "contact@maghrib24.com",
    phone: "+212 522 000 000",
    responseTime: "Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø©",
    color: "emerald",
  },
  {
    dept: "Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª",
    desc: "Ù„ØªÙ‚Ø¯ÙŠÙ… Ù…Ù‚Ø§Ù„Ø§ØªÙƒ ÙˆÙ…Ø³Ø§Ù‡Ù…Ø§ØªÙƒ Ø§Ù„ØµØ­ÙÙŠØ©",
    email: "submit@maghrib24.com",
    phone: null,
    responseTime: "Ø®Ù„Ø§Ù„ 48-72 Ø³Ø§Ø¹Ø©",
    color: "blue",
  },
  {
    dept: "Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª ÙˆØ§Ù„Ø´Ø±Ø§ÙƒØ§Øª",
    desc: "Ù„Ù„Ø´Ø±Ø§ÙƒØ§Øª Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†ÙŠØ© ÙˆØ¹Ø±ÙˆØ¶ Ø§Ù„ØªØ¹Ø§ÙˆÙ† Ø§Ù„ØªØ¬Ø§Ø±ÙŠ",
    email: "pub@maghrib24.com",
    phone: "+212 522 000 001",
    responseTime: "Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø© ÙÙŠ Ø£ÙŠØ§Ù… Ø§Ù„Ø¹Ù…Ù„",
    color: "amber",
  },
  {
    dept: "Ø§Ù„Ø´ÙƒØ§ÙˆÙ‰ ÙˆØ§Ù„ØªØµØ­ÙŠØ­Ø§Øª",
    desc: "Ù„Ù„Ø¥Ø¨Ù„Ø§Øº Ø¹Ù† Ø£Ø®Ø·Ø§Ø¡ Ø£Ùˆ Ø·Ù„Ø¨ ØªØµØ­ÙŠØ­ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",
    email: "corrections@maghrib24.com",
    phone: null,
    responseTime: "Ø®Ù„Ø§Ù„ 12 Ø³Ø§Ø¹Ø©",
    color: "rose",
  },
  {
    dept: "Ø§Ù„Ø®ØµÙˆØµÙŠØ© ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª",
    desc: "Ù„Ø·Ù„Ø¨Ø§Øª Ø­Ø°Ù Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø£Ùˆ Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø§Ù„Ø®ØµÙˆØµÙŠØ©",
    email: "maghrib24com@gmail.com",
    phone: null,
    responseTime: "Ø®Ù„Ø§Ù„ 5 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„",
    color: "violet",
  },
];

const SOCIAL = [
  { name: "ØªÙˆÙŠØªØ± / X", handle: "@maghrib24", url: "https://twitter.com/maghrib24", icon: Twitter, color: "hover:text-sky-500" },
  { name: "ÙÙŠØ³Ø¨ÙˆÙƒ", handle: "maghrib24", url: "https://www.facebook.com/maghrib24", icon: Facebook, color: "hover:text-blue-600" },
  { name: "Ø¥Ù†Ø³ØªØºØ±Ø§Ù…", handle: "@maghrib24", url: "https://www.instagram.com/maghrib24", icon: Instagram, color: "hover:text-pink-500" },
  { name: "ÙŠÙˆØªÙŠÙˆØ¨", handle: "Ù…ØºØ±Ø¨ 24", url: "https://www.youtube.com/@maghrib24", icon: Youtube, color: "hover:text-red-600" },
];

const colorBorder: Record<string, string> = {
  emerald: "border-emerald-500 dark:border-emerald-600",
  blue:    "border-blue-500 dark:border-blue-600",
  amber:   "border-amber-500 dark:border-amber-600",
  rose:    "border-rose-500 dark:border-rose-600",
  violet:  "border-violet-500 dark:border-violet-600",
};
const colorText: Record<string, string> = {
  emerald: "text-emerald-700 dark:text-emerald-400",
  blue:    "text-blue-700 dark:text-blue-400",
  amber:   "text-amber-700 dark:text-amber-400",
  rose:    "text-rose-700 dark:text-rose-400",
  violet:  "text-violet-700 dark:text-violet-400",
};
const colorBg: Record<string, string> = {
  emerald: "bg-emerald-50 dark:bg-emerald-900/10",
  blue:    "bg-blue-50 dark:bg-blue-900/10",
  amber:   "bg-amber-50 dark:bg-amber-900/10",
  rose:    "bg-rose-50 dark:bg-rose-900/10",
  violet:  "bg-violet-50 dark:bg-violet-900/10",
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACT PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function ContactPage() {
  useSeoMeta(
    "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ | Ù…ØºØ±Ø¨ 24 â€” Ø¬Ø±ÙŠØ¯Ø© Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ© Ù…ØºØ±Ø¨ÙŠØ© Ù…Ø³ØªÙ‚Ù„Ø©",
    "ØªÙˆØ§ØµÙ„ Ù…Ø¹ ÙØ±ÙŠÙ‚ ØªØ­Ø±ÙŠØ± Ù…ØºØ±Ø¨ 24: Ù„Ù„ØªØ­Ø±ÙŠØ± ÙˆØ§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª ÙˆØ¥Ø±Ø³Ø§Ù„ Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª ÙˆØ·Ù„Ø¨Ø§Øª Ø§Ù„ØªØµØ­ÙŠØ­. Ø§Ù„Ø¯Ø§Ø± Ø§Ù„Ø¨ÙŠØ¶Ø§Ø¡ØŒ Ø§Ù„Ù…ØºØ±Ø¨. contact@maghrib24.com | +212 522 000 000",
    "https://www.maghrib24.com/contact"
  );

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", dept: "contact@maghrib24.com" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Simulated send â€” replace with your actual API call
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setTimeout(() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "", dept: "contact@maghrib24.com" }); }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse" aria-label="breadcrumb">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600 dark:text-gray-300">ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§</span>
        </nav>

        {/* Header */}
        <header className="text-right mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Ù†Ø±Ø¯ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø©</span>
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
            ÙØ±ÙŠÙ‚ Ù…ØºØ±Ø¨ 24 ÙÙŠ Ø®Ø¯Ù…ØªÙƒ. Ø§Ø®ØªØ± Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ùƒ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø£Ø³Ø±Ø¹ Ø±Ø¯ Ù…Ù…ÙƒÙ†.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 text-right">Ø£Ø±Ø³Ù„ Ø±Ø³Ø§Ù„Ø©</h2>

              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„ØªÙƒ!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ø³ÙŠØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ ÙØ±ÙŠÙ‚Ù†Ø§ Ù‚Ø±ÙŠØ¨Ø§Ù‹.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">

                  {/* Dept selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ù…Ø¹Ù†ÙŠ</label>
                    <select
                      value={form.dept}
                      onChange={(e) => setForm({ ...form, dept: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                    >
                      <option value="contact@maghrib24.com">Ø§Ù„ØªØ­Ø±ÙŠØ± Ø§Ù„Ø¹Ø§Ù…</option>
                      <option value="submit@maghrib24.com">Ø¥Ø±Ø³Ø§Ù„ Ù…Ù‚Ø§Ù„</option>
                      <option value="pub@maghrib24.com">Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª ÙˆØ§Ù„Ø´Ø±Ø§ÙƒØ§Øª</option>
                      <option value="corrections@maghrib24.com">Ø´ÙƒÙˆÙ‰ / ØªØµØ­ÙŠØ­</option>
                      <option value="maghrib24com@gmail.com">Ø§Ù„Ø®ØµÙˆØµÙŠØ© ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª</option>
                    </select>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                        Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ù…Ø­Ù…Ø¯ Ø¨Ù† Ø¹Ù„ÙŠ"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                        Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="exemple@mail.com"
                        dir="ltr"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-left"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Ù…ÙˆØ¶ÙˆØ¹ Ø§Ù„Ø±Ø³Ø§Ù„Ø©</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Ø­ÙˆÙ„ Ù…Ø§Ø°Ø§ ØªØ±ÙŠØ¯ Ø§Ù„ØªØ­Ø¯Ø«ØŸ"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-right"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Ø§Ù„Ø±Ø³Ø§Ù„Ø© <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„ØªÙƒ Ù‡Ù†Ø§..."
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 dark:placeholder:text-zinc-600 resize-none text-right"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-900/50 text-white font-black rounded-xl text-sm transition-colors"
                  >
                    {status === "sending" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Ø¬Ø§Ø±Ù Ø§Ù„Ø¥Ø±Ø³Ø§Ù„...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø©</>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">
                    Ø¨Ø¥Ø±Ø³Ø§Ù„ Ù‡Ø°Ø§ Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ØŒ ØªÙˆØ§ÙÙ‚ Ø¹Ù„Ù‰{" "}
                    <Link href="/privacy" className="text-emerald-600 hover:underline">Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©</Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: Info panels */}
          <div className="lg:col-span-2 space-y-5">

            {/* Address & Hours */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-right" itemScope itemType="https://schema.org/NewsMediaOrganization">
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-5">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Ø§Ù„Ø¹Ù†ÙˆØ§Ù†</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200" itemProp="address">Ø´Ø§Ø±Ø¹ Ù…Ø­Ù…Ø¯ Ø§Ù„Ø®Ø§Ù…Ø³ØŒ Ø±Ù‚Ù… 45<br />Ø§Ù„Ø¯Ø§Ø± Ø§Ù„Ø¨ÙŠØ¶Ø§Ø¡ 20000ØŒ Ø§Ù„Ù…ØºØ±Ø¨</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Ø§Ù„Ù‡Ø§ØªÙ</p>
                    <a href="tel:+212522000000" className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline" dir="ltr" itemProp="telephone">+212 522 000 000</a>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¹Ø§Ù…</p>
                    <a href="mailto:contact@maghrib24.com" className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline" dir="ltr" itemProp="email">contact@maghrib24.com</a>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">Ø§Ù„Ø§Ø«Ù†ÙŠÙ† â€“ Ø§Ù„Ø¬Ù…Ø¹Ø©</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">09:00 â€“ 18:00 (GMT+1)</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-right">
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-4">ØªØ§Ø¨Ø¹Ù†Ø§ Ø¹Ù„Ù‰</h2>
              <div className="space-y-3">
                {SOCIAL.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-3 justify-end p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group`}>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{s.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{s.handle}</p>
                      </div>
                      <Icon className={`w-5 h-5 text-gray-400 transition-colors ${s.color} flex-shrink-0`} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Press inquiries */}
            <div className="bg-emerald-900 dark:bg-emerald-950 rounded-2xl p-6 text-right">
              <h2 className="text-base font-black text-white mb-2">Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø§Ù„ØµØ­ÙÙŠØ©</h2>
              <p className="text-sm text-emerald-200 mb-4">Ù„Ù„ØµØ­ÙÙŠÙŠÙ† Ø§Ù„Ø¨Ø§Ø­Ø«ÙŠÙ† Ø¹Ù† ØªØµØ±ÙŠØ­ Ø£Ùˆ Ù…Ø¹Ù„ÙˆÙ…Ø© Ù…Ù† Ù…ØºØ±Ø¨ 24:</p>
              <a href="mailto:press@maghrib24.com" className="flex items-center gap-2 justify-end text-emerald-300 hover:text-white transition-colors text-sm font-medium">
                press@maghrib24.com
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Department cards */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-8 justify-end">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ø£Ù‚Ø³Ø§Ù… Ø§Ù„ØªÙˆØ§ØµÙ„</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTACTS.map((c) => (
              <div key={c.dept}
                className={`bg-white dark:bg-zinc-900 rounded-2xl border border-r-4 border-gray-100 dark:border-zinc-800 ${colorBorder[c.color]} p-5 text-right`}>
                <div className={`text-xs font-black uppercase tracking-widest mb-1 ${colorText[c.color]}`}>{c.dept}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{c.desc}</p>
                <a href={`mailto:${c.email}`} className={`block text-sm font-medium hover:underline mb-1 ${colorText[c.color]}`} dir="ltr">{c.email}</a>
                {c.phone && (
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="block text-sm text-gray-600 dark:text-gray-400 mb-3" dir="ltr">{c.phone}</a>
                )}
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${colorBg[c.color]} ${colorText[c.color]}`}>
                  <Clock className="w-3 h-3" />
                  {c.responseTime}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap gap-4 justify-end text-xs text-gray-400">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</Link>
          <Link href="/about" className="hover:text-emerald-600 transition-colors">Ù…Ù† Ù†Ø­Ù†</Link>
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©</Link>
          <Link href="/submit" className="hover:text-emerald-600 transition-colors">Ø£Ø±Ø³Ù„ Ù…Ù‚Ø§Ù„Ùƒ</Link>
        </div>
      </div>
    </div>
  );
}

