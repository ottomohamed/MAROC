import { useParams, Link } from "wouter";
import { useGetMAGHREB24Article } from "@/hooks/use-articles";
import { Loader2, Calendar, User, ArrowRight, Share2 } from "lucide-react";
import { formatDate, getTranslatedSection } from "@/lib/utils";

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useGetMAGHREB24Article(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">عذراً، المقال غير موجود</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">لم نتمكن من العثور على المقال الذي تبحث عنه</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 text-right" dir="rtl">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/section/${article.section}`}
              className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 hover:underline"
            >
              {getTranslatedSection(article.section)}
            </Link>
            <span className="text-gray-300 dark:text-gray-700"></span>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-700 dark:text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{article.author_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">كاتب في MAGHREB24</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-emerald-700 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-4">شارك المقال</h3>
          <div className="flex gap-3">
            <button className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
