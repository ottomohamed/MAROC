import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Author {
  slug: string;
  name: string;
  beat: string;
  section: string;
  title: string;
  emoji: string;
  color: string;
  border: string;
  bg: string;
  persona: string;
  topics: string[];
  isActive?: boolean;
  lastActive?: string;
  articlesCount?: number;
}

// جلب جميع المؤلفين
export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Author[];
    },
  });
};

// جلب مؤلف محدد
export const useAuthor = (slug: string) => {
  return useQuery({
    queryKey: ['author', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Author;
    },
    enabled: !!slug,
  });
};

// جلب مقالات المؤلف
export const useAuthorArticles = (slug: string) => {
  return useQuery({
    queryKey: ['author-articles', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_slug', slug)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

// جلب إحصائيات المؤلف
export const useAuthorStats = (slug: string) => {
  return useQuery({
    queryKey: ['author-stats', slug],
    queryFn: async () => {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('views, likes, shares')
        .eq('author_slug', slug)
        .eq('status', 'published');
      
      if (error) throw error;
      
      const stats = {
        totalArticles: articles?.length || 0,
        totalViews: articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0,
        totalLikes: articles?.reduce((sum, a) => sum + (a.likes || 0), 0) || 0,
        totalShares: articles?.reduce((sum, a) => sum + (a.shares || 0), 0) || 0,
      };
      
      return stats;
    },
    enabled: !!slug,
  });
};
