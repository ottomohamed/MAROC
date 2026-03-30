import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Home, Newspaper, Users, PenBox } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navigation = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "أخبار", href: "/section/news", icon: Newspaper },
    { name: "اقتصاد", href: "/section/economy", icon: Newspaper },
    { name: "ثقافة", href: "/section/culture", icon: Newspaper },
    { name: "رياضة", href: "/section/sports", icon: Newspaper },
    { name: "رأي", href: "/section/opinion", icon: Newspaper },
    { name: "مغاربة العالم", href: "/section/diaspora", icon: Users },
    { name: "القبائل المغربية", href: "/section/tribes", icon: Users },
    { name: "شؤون الفلاح", href: "/section/agriculture", icon: Newspaper },
    { name: "إرسال مقال", href: "/submit", icon: PenBox },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950" dir="rtl">
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-black text-emerald-700 dark:text-emerald-500">
                MAGHREB<span className="text-gray-900 dark:text-white">24</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-bold transition-colors hover:text-emerald-700 dark:hover:text-emerald-500",
                    location === item.href
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-bold transition-colors",
                  location === item.href
                    ? "text-emerald-700 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{theme === "dark" ? "فاتح" : "داكن"}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 dark:text-gray-400"> {new Date().getFullYear()} MAGHREB24. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}


