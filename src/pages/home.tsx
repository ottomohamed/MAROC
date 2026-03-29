import { Link } from "wouter";
import { ArticleCard } from "@/components/article-card";
import { AdBanner } from "@/components/ad-banner";
import { useListMAGHREB24Articles } from "@/hooks/use-articles";
import { Loader2, TrendingUp, Newspaper, Users } from "lucide-react";

export default function HomePage() {
  const { data: articlesData, isLoading } = useListMAGHREB24Articles({ limit: 10 });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
      </div>
    );
  }

  const articles = articlesData?.articles || [];

  return (
    <div className="animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black mb-4">مرحباً بكم في MAGHREB24</h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl">
              بوابتكم لأخبار المغرب والعالم العربي. تغطية شاملة، تحليلات معمقة، وآراء متنوعة.
            </p>
          </div>
          <div className="hidden md:block flex-shrink-0 mr-8">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" style={{animation: "glow 2s ease-in-out infinite alternate"}}>
              <defs>
                <style>{`
                  @keyframes glow {
                    from { filter: drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 20px #ff4500); transform: scale(1); }
                    to { filter: drop-shadow(0 0 20px #ff0000) drop-shadow(0 0 40px #ff8c00); transform: scale(1.05); }
                  }
                `}</style>
              </defs>
              <polygon
                points="100,10 123,79 196,79 137,122 159,190 100,148 41,190 63,122 4,79 77,79"
                fill="none"
                stroke="#e60000"
                strokeWidth="8"
                strokeLinejoin="round"
                style={{filter: "drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 20px #ff4500)", animation: "glow 2s ease-in-out infinite alternate"}}
              />
            </svg>
          </div>
        </div>
      </div>

      <AdBanner position="header_home" className="mb-6" />
      {/* Latest Articles */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Newspaper className="w-6 h-6 text-emerald-700" />
          <h2 className="text-2xl font-black">أحدث المقالات</h2>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl">
            <p className="text-gray-400">لا توجد مقالات منشورة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-gray-100 dark:border-slate-800">
          <TrendingUp className="w-8 h-8 text-emerald-700 mx-auto mb-3" />
          <h3 className="text-2xl font-black">+10K</h3>
          <p className="text-gray-500">متابع نشط</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-gray-100 dark:border-slate-800">
          <Newspaper className="w-8 h-8 text-emerald-700 mx-auto mb-3" />
          <h3 className="text-2xl font-black">+500</h3>
          <p className="text-gray-500">مقال منشور</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-gray-100 dark:border-slate-800">
          <Users className="w-8 h-8 text-emerald-700 mx-auto mb-3" />
          <h3 className="text-2xl font-black">+50</h3>
          <p className="text-gray-500">كاتب ومحرر</p>
        </div>
      </div>
    </div>
      <AdBanner position="footer" className="mt-8" />
  );
}


