import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Mail, Send, Twitter, Facebook, Instagram, Youtube, Loader2, Check } from "lucide-react";

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

const CONTACTS = [
  { dept: "التحرير العام", desc: "للأخبار والمعلومات والاستفسارات الصحفية", email: "maghrib24com@gmail.com", responseTime: "خلال 24 ساعة", color: "emerald" },
  { dept: "إرسال المقالات", desc: "لتقديم مقالاتك ومساهماتك الصحفية", email: "maghrib24com@gmail.com", responseTime: "خلال 48-72 ساعة", color: "blue" },
  { dept: "الإعلانات والشراكات", desc: "للشراكات الإعلانية وعروض التعاون التجاري", email: "maghrib24com@gmail.com", responseTime: "خلال 24 ساعة", color: "amber" },
  { dept: "الشكاوى والتصحيحات", desc: "للإبلاغ عن أخطاء أو طلب تصحيح معلومات", email: "maghrib24com@gmail.com", responseTime: "خلال 12 ساعة", color: "rose" },
  { dept: "الخصوصية والبيانات", desc: "لطلبات حذف البيانات أو استفسارات الخصوصية", email: "maghrib24com@gmail.com", responseTime: "خلال 5 أيام عمل", color: "violet" },
];

const SOCIAL = [
  { name: "Twitter / X", handle: "@maghrib24", url: "https://twitter.com/maghrib24", icon: Twitter, color: "hover:text-sky-500" },
  { name: "Facebook", handle: "maghrib24", url: "https://www.facebook.com/maghrib24", icon: Facebook, color: "hover:text-blue-600" },
  { name: "Instagram", handle: "@maghrib24", url: "https://www.instagram.com/maghrib24", icon: Instagram, color: "hover:text-pink-500" },
  { name: "YouTube", handle: "MAGHREB 24", url: "https://www.youtube.com/@maghrib24", icon: Youtube, color: "hover:text-red-600" },
];

const colorBorder = { emerald: "border-emerald-500", blue: "border-blue-500", amber: "border-amber-500", rose: "border-rose-500", violet: "border-violet-500" };
const colorText = { emerald: "text-emerald-700 dark:text-emerald-400", blue: "text-blue-700 dark:text-blue-400", amber: "text-amber-700 dark:text-amber-400", rose: "text-rose-700 dark:text-rose-400", violet: "text-violet-700 dark:text-violet-400" };
const colorBg = { emerald: "bg-emerald-50 dark:bg-emerald-900/10", blue: "bg-blue-50 dark:bg-blue-900/10", amber: "bg-amber-50 dark:bg-amber-900/10", rose: "bg-rose-50 dark:bg-rose-900/10", violet: "bg-violet-50 dark:bg-violet-900/10" };

export default function ContactPage() {
  useSeoMeta("تواصل معنا | MAGHREB 24", "تواصل مع فريق تحرير مغرب 24 عبر البريد الإلكتروني", "https://www.maghrib24.com/contact");

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", dept: "maghrib24com@gmail.com" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setTimeout(() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "", dept: "maghrib24com@gmail.com" }); }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse">
          <Link href="/" className="hover:text-emerald-600">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600">تواصل معنا</span>
        </nav>

        <header className="text-right mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700">نرد خلال 24 ساعة</span>
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">تواصل معنا</h1>
          <p className="text-gray-600 dark:text-gray-400">فريق مغرب 24 في خدمتك. راسلنا على البريد الإلكتروني وسنرد عليك في أقرب وقت.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-6 md:p-8">
              <h2 className="text-xl font-black mb-6 text-right">أرسل رسالة</h2>
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-black">تم إرسال رسالتك!</h3>
                  <p className="text-sm text-gray-500">سنتواصل معك قريباً على بريدك الإلكتروني.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">
                  <div>
                    <label className="block text-xs font-bold mb-2">القسم المعني</label>
                    <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm">
                      <option value="maghrib24com@gmail.com">التحرير العام</option>
                      <option value="maghrib24com@gmail.com">إرسال مقال</option>
                      <option value="maghrib24com@gmail.com">الإعلانات والشراكات</option>
                      <option value="maghrib24com@gmail.com">شكوى / تصحيح</option>
                      <option value="maghrib24com@gmail.com">الخصوصية والبيانات</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" className="bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm" />
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="البريد الإلكتروني" dir="ltr" className="bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="موضوع الرسالة" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm" />
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="اكتب رسالتك هنا..." className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm resize-none" />
                  <button type="submit" disabled={status === "sending"} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl">
                    {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" /> جارٍ الإرسال...</> : <><Send className="w-4 h-4" /> إرسال الرسالة</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-6 text-right">
              <h2 className="text-base font-black mb-4">معلومات التواصل</h2>
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 mb-1">البريد الإلكتروني</p>
                  <a href="mailto:maghrib24com@gmail.com" className="text-sm text-emerald-700 hover:underline" dir="ltr">maghrib24com@gmail.com</a>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-6 text-right">
              <h2 className="text-base font-black mb-4">تابعنا على</h2>
              <div className="space-y-3">
                {SOCIAL.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 justify-end p-3 rounded-xl border hover:bg-gray-50">
                      <div className="text-right"><p className="text-sm font-bold">{s.name}</p><p className="text-xs text-gray-400">{s.handle}</p></div>
                      <Icon className={`w-5 h-5 text-gray-400 ${s.color}`} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-emerald-900 rounded-2xl p-6 text-right">
              <h2 className="text-base font-black text-white mb-2">الاستفسارات الصحفية</h2>
              <p className="text-sm text-emerald-200 mb-4">للصحفيين الباحثين عن تصريح أو معلومة</p>
              <a href="mailto:maghrib24com@gmail.com" className="flex items-center gap-2 justify-end text-emerald-300 hover:text-white">
                maghrib24com@gmail.com
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex items-center gap-3 mb-8 justify-end">
            <h2 className="text-2xl font-black">أقسام التواصل</h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTACTS.map((c) => (
              <div key={c.dept} className={`bg-white dark:bg-zinc-900 rounded-2xl border-r-4 ${colorBorder[c.color]} p-5 text-right`}>
                <div className={`text-xs font-bold uppercase mb-1 ${colorText[c.color]}`}>{c.dept}</div>
                <p className="text-xs text-gray-500 mb-4">{c.desc}</p>
                <a href={`mailto:${c.email}`} className={`block text-sm font-medium mb-2 ${colorText[c.color]}`} dir="ltr">{c.email}</a>
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${colorBg[c.color]} ${colorText[c.color]}`}>
                  {c.responseTime}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 pt-6 border-t flex flex-wrap gap-4 justify-end text-xs text-gray-400">
          <Link href="/">الرئيسية</Link>
          <Link href="/about">من نحن</Link>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/submit">أرسل مقالك</Link>
        </div>
      </div>
    </div>
  );
}
