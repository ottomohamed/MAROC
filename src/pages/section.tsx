import { useParams, Link } from "wouter";
import { ArticleCard } from "@/components/article-card";
import { useListMAGHREB24Articles } from "@/hooks/use-articles";
import { Loader2, PenBox, MessageSquare, Sparkles } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";
import { getTranslatedSection } from "@/lib/utils";

export default function SectionPage() {
  const { section } = useParams();
  const { data: articlesData, isLoading } = useListMAGHREB24Articles({ section: section, limit: 20 });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
      </div>
    );
  }

  const articles = articlesData?.articles || [];
  const translatedSection = getTranslatedSection(section || "");

  return (
    <div className="animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Header Section */}
      <header className="bg-white dark:bg-slate-950 py-16 mb-16 border-b border-gray-100 dark:border-slate-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black mb-6 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              قسم {translatedSection}
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-sans text-gray-900 dark:text-white mb-6 tracking-tighter">
              {translatedSection}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 font-medium">
              نقدم لكم أحدث التقارير والتحليلات المعمقة والحصرية من قلب الأحداث في قسم {translatedSection} عبر شبكة مراسلينا.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/submit" className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-700/20 transition-all active:scale-95">
                <PenBox className="w-4 h-4" />
                تواصل مع القسم
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gold-600 mb-10 flex items-center gap-3">
            <div className="h-0.5 w-8 bg-gold-500"></div>
            أحدث المنشورات
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
              <MessageSquare className="w-12 h-12 text-gray-200 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-gray-400 font-sans italic text-lg">لا توجد مقالات منشورة في هذا القسم حالياً.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Submission Guidelines */}
          <section className="bg-emerald-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">هل لديك رأي؟</h3>
              <p className="text-sm text-emerald-100/70 mb-8 leading-relaxed font-medium">
                نرحب بالمقالات العميقة والمكتوبة في السياسة والاقتصاد والثقافة والمجتمع. شارك صوتك مع جمهورنا الواسع.
              </p>
              <ul className="text-xs space-y-4 mb-10 text-emerald-200 font-bold italic">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> عدد الكلمات: 600 - 1000 كلمة</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> محتوى أصلي وغير منشور سابقاً</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> نبرة مهنية وموضوعية</li>
              </ul>
              <Link href="/submit" className="block w-full bg-gold-500 hover:bg-gold-600 text-white font-black py-4 rounded-2xl text-center shadow-lg active:scale-95 text-[10px] uppercase tracking-widest transition-all">
                ابدأ عملية النشر الآن
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <PenBox className="w-20 h-20" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

