import { Link } from "wouter";
import { ArticleCard } from "@/components/article-card";
import { AdBanner } from "@/components/ad-banner";
import { useListMAGHREB24Articles } from "@/hooks/use-articles";
import { Loader2, Search, TrendingUp, Newspaper, Users, Flame, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getTranslatedSection } from "@/lib/utils";

const SECTIONS = [
  { id: "politics", label: "سياسة", color: "bg-blue-600" },
  { id: "economics", label: "اقتصاد", color: "bg-emerald-600" },
  { id: "sports", label: "رياضة", color: "bg-orange-600" },
  { id: "culture", label: "ثقافة", color: "bg-purple-600" },
  { id: "society", label: "مجتمع", color: "bg-rose-600" },
  { id: "science", label: "علوم", color: "bg-cyan-600" },
];

export default function HomePage() {
  const { data: articlesData, isLoading } = useListMAGHREB24Articles({ limit: 20 });
  const { data: politicsData } = useListMAGHREB24Articles({ section: "politics", limit: 3 });
  const { data: economicsData } = useListMAGHREB24Articles({ section: "economics", limit: 3 });
  const { data: sportsData } = useListMAGHREB24Articles({ section: "sports", limit: 3 });
  const [tickerVisible, setTickerVisible] = useState(true);

  const articles = articlesData?.articles || [];
  const heroArticle = articles[0];
  const featuredArticles = articles.slice(1, 4);
  const remainingArticles = articles.slice(4);
  const politicsArticles = politicsData?.articles || [];
  const economicsArticles = economicsData?.articles || [];
  const sportsArticles = sportsData?.articles || [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
          <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500" dir="rtl">
      {/* Breaking News Ticker */}
      {tickerVisible && articles.length > 0 && (
        <div className="bg-red-600 text-white py-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-6 flex items-center gap-4 overflow-hidden">
          <span className="flex-shrink-0 bg-white text-red-600 text-[10px] font-black px-2 py-0.5 tracking-widest uppercase">عاجل</span>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-12 animate-[marquee_30s_linear_infinite]" style={{width: 'max-content'}}>
              {articles.slice(0, 5).map((a: any) => (
                <Link key={a.id} href={`/article/${a.slug || a.id}`} className="text-xs font-medium whitespace-nowrap hover:underline">
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
          <button onClick={() => setTickerVisible(false)} className="flex-shrink-0 text-white/60 hover:text-white text-lg leading-none">×</button>
        </div>
      )}

      {/* إعلان أعلى الصفحة */}
      <AdBanner position="header_home" className="mb-8" />

      {/* Hero Section */}
      {heroArticle && (
        <section className="mb-12">
          <Link href={`/article/${heroArticle.slug || heroArticle.id}`}>
            <div className="relative overflow-hidden rounded-2xl bg-emerald-950 group cursor-pointer min-h-[500px] flex items-end">
              {heroArticle.image_url ? (
                <img
                  src={heroArticle.image_url}
                  alt={heroArticle.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-950">
                  <svg viewBox="0 0 200 200" className="absolute top-8 left-8 w-32 h-32 opacity-10">
                    <polygon points="100,10 123,79 196,79 137,122 159,190 100,148 41,190 63,122 4,79 77,79" fill="none" stroke="white" strokeWidth="8" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 p-8 md:p-12 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase">
                    {getTranslatedSection(heroArticle.section)}
                  </span>
                  <span className="text-white/50 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(heroArticle.published_at).toLocaleDateString('ar-MA')}
                  </span>
                </div>
                <h2 className="font-black text-3xl md:text-5xl text-white leading-tight mb-4 group-hover:text-emerald-200 transition-colors">
                  {heroArticle.title}
                </h2>
                {heroArticle.excerpt && (
                  <p className="text-white/70 text-base md:text-lg leading-relaxed line-clamp-2 max-w-2xl">
                    {heroArticle.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-4 text-white/50 text-sm">
                  <span className="font-medium">{heroArticle.author_name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> {(heroArticle.views || 0).toLocaleString()} مشاهدة
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured Articles Grid */}
      {featuredArticles.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredArticles.map((article: any) => (
            <Link key={article.id} href={`/article/${article.slug || article.id}`}>
              <div className="group cursor-pointer h-full">
                <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800 aspect-video mb-3">
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-emerald-300 opacity-30" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 tracking-widest uppercase mb-2 block">
                  {getTranslatedSection(article.section)}
                </span>
                <h3 className="font-bold text-base leading-snug text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2">{article.author_name}</p>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-emerald-700 dark:border-emerald-500">
            <Flame className="w-5 h-5 text-red-600" />
            <h2 className="font-black text-lg tracking-wide">أحدث الأخبار</h2>
          </div>

          <div className="space-y-0 divide-y divide-gray-100 dark:divide-zinc-800">
            {remainingArticles.map((article: any, index: number) => (
              <div key={article.id}>
                <Link href={`/article/${article.slug || article.id}`}>
                  <div className="group flex gap-4 py-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50 -mx-3 px-3 rounded-lg transition-colors">
                    {article.image_url && (
                      <div className="flex-shrink-0 w-24 h-20 overflow-hidden rounded-lg">
                        <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          {getTranslatedSection(article.section)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(article.published_at).toLocaleDateString('ar-MA')}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm md:text-base leading-snug text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{article.author_name}</p>
                    </div>
                  </div>
                </Link>
                {/* إعلان بين المقالات */}
                {(index + 1) % 4 === 0 && (
                  <AdBanner position="between_articles" className="my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* الأكثر قراءة */}
          <div className={`p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-700 dark:border-emerald-500 pb-2 mb-5 inline-block">
              الأكثر قراءة
            </h3>
            <ul className="space-y-5">
              {articles.slice(0, 5).map((article: any, i: number) => (
                <li key={article.id}>
                  <Link href={`/article/${article.slug || article.id}`}>
                    <div className="flex gap-3 group cursor-pointer">
                      <span className="font-black text-3xl text-gray-100 dark:text-zinc-800 leading-none group-hover:text-emerald-200 dark:group-hover:text-zinc-700 transition-colors w-8 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {getTranslatedSection(article.section)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* النشرة الإخبارية */}
          <div className="p-6 rounded-xl bg-emerald-950 text-white">
            <h3 className="font-black text-xl mb-2">نشرة الحقيقة</h3>
            <p className="text-emerald-200/70 text-sm mb-5 leading-relaxed">
              أهم التحليلات والتقارير الحصرية في بريدك كل صباح.
            </p>
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="w-full bg-emerald-900/50 border border-emerald-700 text-white placeholder:text-emerald-500 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:border-emerald-400"
            />
            <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xs py-3 rounded-lg tracking-widest uppercase transition-colors">
              اشترك الآن
            </button>
          </div>

          {/* إعلان جانبي */}
          <AdBanner position="sidebar" />
        </aside>
      </div>

      {/* أقسام مخصصة */}
      {politicsArticles.length > 0 && (
        <SectionBlock title="السياسة" section="politics" articles={politicsArticles} color="border-blue-600" />
      )}
      {economicsArticles.length > 0 && (
        <SectionBlock title="الاقتصاد" section="economics" articles={economicsArticles} color="border-emerald-600" />
      )}
      {sportsArticles.length > 0 && (
        <SectionBlock title="الرياضة" section="sports" articles={sportsArticles} color="border-orange-600" />
      )}

      {/* إحصائيات */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-gray-100 dark:border-zinc-800 mt-8">
        {[
          { icon: Users, number: "+10K", label: "متابع نشط", desc: "يثقون في مصداقية مغرب24 يومياً", color: "text-emerald-600" },
          { icon: Newspaper, number: "+500", label: "تحقيق استقصائي", desc: "أرشيف من التحليلات والتقارير الحصرية", color: "text-red-600" },
          { icon: TrendingUp, number: "+50", label: "كاتب ومحلل", desc: "شبكة من الخبراء والمراسلين", color: "text-amber-600" },
        ].map(({ icon: Icon, number, label, desc, color }) => (
          <div key={label} className="group p-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-xl transition-all hover:-translate-y-1 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <Icon className={`w-8 h-8 ${color} opacity-30 group-hover:opacity-100 transition-opacity`} />
              <span className={`font-black text-4xl ${color}`}>{number}</span>
            </div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-2">{label}</h4>
            <p className="text-sm text-gray-400 dark:text-zinc-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* إعلان Footer */}
      <AdBanner position="footer" className="mt-8" />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function SectionBlock({ title, section, articles, color }: {
  title: string;
  section: string;
  articles: any[];
  color: string;
}) {
  return (
    <section className="mb-12">
      <div className={`flex items-center justify-between mb-6 pb-3 border-b-2 ${color}`}>
        <Link href={`/section/${section}`} className="text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-emerald-600 transition-colors">
          عرض الكل ←
        </Link>
        <h2 className="font-black text-xl">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article: any) => (
          <Link key={article.id} href={`/article/${article.slug || article.id}`}>
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800 aspect-video mb-3">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-700" />
                )}
              </div>
              <h3 className="font-bold text-sm leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{article.author_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
