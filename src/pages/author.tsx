import { useParams, Link } from "wouter";
import { useListMAGHREB24Articles } from "@/hooks/use-articles";
import { ArticleCard } from "@/components/article-card";
import { Loader2, User, Mail, Calendar } from "lucide-react";

export default function AuthorPage() {
  const { slug } = useParams();
  const { data: articlesData, isLoading } = useListMAGHREB24Articles({ limit: 20 });
  const articles = articlesData?.articles || [];

  const authorArticles = articles.filter((a: any) => a.author_slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 text-right" dir="rtl">
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-8 mb-12 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2">{slug?.replace(/-/g, ' ')}</h1>
            <p className="text-emerald-100">كاتب في MAGHREB24</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-black mb-6">مقالات الكاتب</h2>
        {authorArticles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl">
            <p className="text-gray-400">لا توجد مقالات منشورة لهذا الكاتب</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorArticles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
