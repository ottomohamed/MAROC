import { Link } from "wouter";
import { formatDateTime } from "@/lib/utils";
import { Eye, Heart, Share2, Clock } from "lucide-react";

interface Article {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  section: string;
  author_name: string;
  image_url?: string | null;
  views: number;
  likes: number;
  shares: number;
  reading_time?: number;
  published_at: string;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const href = `/article/${article.slug || article.id}`;

  return (
    <Link href={href}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <span className="text-xs text-emerald-500 font-medium uppercase tracking-wider">
            {article.section}
          </span>
          <h3 className="text-lg font-bold mt-1 mb-2 line-clamp-2 text-gray-900 dark:text-zinc-100">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-600 mt-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes}</span>
              <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {article.shares}</span>
              {article.reading_time && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.reading_time} د</span>
              )}
            </div>
            <span>{article.author_name}</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-zinc-600 mt-1">
            {formatDateTime(article.published_at)}
          </div>
        </div>
      </div>
    </Link>
  );
}
