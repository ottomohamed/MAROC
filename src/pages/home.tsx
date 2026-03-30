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
      {/* Hero Section - قسم الواجهة الرئيسي */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 z-10">
            <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight">
              مرحباً بكم في <span className="text-emerald-400">MAGHREB24</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-2xl max-w-2xl leading-relaxed mb-8">
              بوابتكم الرائدة لأخبار المغرب والعالم العربي. نقدم لكم تغطية شاملة، تحليلات معمقة، وآراء متنوعة تلامس حاضركم وتستشرف مستقبلكم.
            </p>
            <div className="flex gap-4">
              <div className="bg-emerald-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
                #أخبار_المغرب
              </div>
              <div className="bg-emerald-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
                #تحليلات_حصرية
              </div>
            </div>
          </div>

          {/* النجمة المغربية المتوهجة الاحترافية */}
          <div className="flex-shrink-0 relative group">
            {/* هالة الضوء الخلفية */}
            <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-25 group-hover:opacity-40 transition-opacity animate-pulse"></div>
            
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 md:w-64 md:h-64 relative z-10 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              <polygon
                points="100,10 123,79 196,79 137,122 159,190 100,148 41,190 63,122 4,79 77,79"
                fill="none"
                stroke="#ff1a1a"
                strokeWidth="10"
                strokeLinejoin="round"
                className="animate-pulse"
                style={{
                  filter: "drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 30px #ff4500)",
                }}
              />
              {/* خط داخلي دقيق لتعزيز التفاصيل */}
              <polygon
                points="100,10 123,79 196,79 137,122 159,190 100,148 41,190 63,122 4,79 77,79"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                className="opacity-20"
              />
            </svg>
          </div>
        </div>
        
        {/* زخرفة خلفية باهتة لإعطاء طابع مغربي */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl"></div>
      </div>

      <AdBanner position="header_home" className="mb-8" />

      {/* Latest Articles - أحدث المقالات */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-emerald-700" />
            <h2 className="text-3xl font-black">أحدث المقالات</h2>
          </div>
          <Link href="/articles" className="text-emerald-700 font-bold hover:underline">عرض الكل</Link>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
            <p className="text-gray-400 text-xl">نحن نجهز لكم محتوى مميزاً، انتظرونا قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any, index: number) => (
              <>
                <ArticleCard key={article.id} article={article} />
                {(index + 1) % 3 === 0 && index !== articles.length - 1 && (
                  <div className="col-span-full">
                    <AdBanner position="between_articles" />
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section - إحصائيات المنصة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-2">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">+10K</h3>
          <p className="text-gray-500 font-medium">متابع وفيّ للمنصة</p>
        </div>
        
        <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-2">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <Newspaper className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">+500</h3>
          <p className="text-gray-500 font-medium">تحليل ومقال رصين</p>
        </div>

        <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-2">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">+50</h3>
          <p className="text-gray-500 font-medium">من نخبة الكُتّاب</p>
        </div>
      </div>

      {/* التذييل الإعلاني - تم وضعه داخل الحاوية الرئيسية لتجنب أخطاء Vercel */}
      <AdBanner position="footer" className="mt-12" />
    </div>
  );
}

