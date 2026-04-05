# إنشاء ملف layout.tsx جديد بالكامل
@'
import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Search, Radio } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "الرئيسية", href: "/" },
  { name: "سياسة", href: "/section/politics" },
  { name: "اقتصاد", href: "/section/economics" },
  { name: "مجتمع", href: "/section/society" },
  { name: "رياضة", href: "/section/sports" },
  { name: "ثقافة", href: "/section/culture" },
  { name: "علوم", href: "/section/science" },
  { name: "مغاربة العالم", href: "/section/diaspora" },
  { name: "القبائل", href: "/section/tribes" },
  { name: "الفلاح", href: "/section/agriculture" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      {/* Top Bar */}
      <div className="bg-emerald-950 text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-emerald-300/60 uppercase">
            <span>{new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-[10px] font-bold tracking-widest text-emerald-300/60 uppercase hover:text-white transition-colors">
              أرسل مقالك
            </Link>
            <span className="text-emerald-700">|</span>
            <Link href="/newsroom" className="text-[10px] font-bold tracking-widest text-emerald-300/60 uppercase hover:text-white transition-colors">
              غرفة الأخبار
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <span className="font-black text-2xl text-emerald-700 dark:text-emerald-500 tracking-tighter">MAGHREB</span>
              <span className="font-black text-2xl text-red-600 tracking-tighter">24</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.slice(0, 7).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-xs font-bold transition-colors rounded-lg",
                    location === item.href
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                      : "text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black tracking-widest rounded-full">
                <Radio className="w-3 h-3 animate-pulse" />
                مباشر
              </div>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4">
              <input
                type="search"
                placeholder="ابحث في مغرب24..."
                autoFocus
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Secondary Nav */}
        <div className="hidden lg:block border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
              {navigation.slice(7).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-bold whitespace-nowrap transition-colors rounded-lg",
                    location === item.href
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/submit"
                className="mr-auto px-3 py-1.5 text-[11px] font-bold text-red-600 hover:text-red-500 transition-colors whitespace-nowrap"
              >
                + أرسل مقالك
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-zinc-800">
            <div className="grid grid-cols-3 gap-1 p-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-2 py-2 text-xs font-bold text-center rounded-lg transition-colors",
                    location === item.href
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-emerald-800">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-1 mb-4">
                <span className="font-black text-3xl text-white tracking-tighter">MAGHREB</span>
                <span className="font-black text-3xl text-red-500 tracking-tighter">24</span>
              </div>
              <p className="text-emerald-300/60 text-sm leading-relaxed max-w-sm">
                صحيفة رقمية مغربية مستقلة، تعنى بنقل الخبر بكل موضوعية ومهنية، وتسليط الضوء على القضايا الجوهرية التي تهم المواطن المغربي.
              </p>
              <div className="mt-6">
                <svg viewBox="0 0 200 200" className="w-16 h-16 opacity-30">
                  <polygon points="100,10 123,79 196,79 137,122 159,190 100,148 41,190 63,122 4,79 77,79" fill="none" stroke="#e60000" strokeWidth="8" />
                </svg>
              </div>
            </div>

            {/* الأقسام */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-6">الأقسام</h4>
              <ul className="space-y-3">
                {navigation.slice(0, 6).map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* المؤسسة */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-6">المؤسسة</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    فريق العمل
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link href="/advertise" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    الإعلانات
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="text-sm text-emerald-300/60 hover:text-white transition-colors">
                    أرسل مقالك
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
            <p>© {new Date().getFullYear()} مغرب24 — جميع الحقوق محفوظة</p>
            <p className="text-emerald-800">صُنع بـ ❤️ في المغرب</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'@ | Out-File -FilePath src\components\layout.tsx -Encoding UTF8