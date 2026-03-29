import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// جلب المقالات حسب القسم
export function useListMAGHREB24Articles({ section, limit = 20 }: { section?: string; limit?: number }) {
  return useQuery({
    queryKey: ['articles', section, limit],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (section && section !== 'all') {
        query = query.eq('section', section);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching articles:', error);
        return { articles: [] };
      }
      
      return { articles: data || [] };
    },
  });
}

// جلب قائمة الكتاب
export function useListMAGHREB24Authors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      // إذا كان لديك جدول authors في Supabase
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching authors:', error);
        // بيانات تجريبية إذا لم يكن الجدول موجوداً
        return [
          { id: 1, slug: 'ahmed-alami', name: 'أحمد العلمي', title: 'كاتب ومحلل سياسي' },
          { id: 2, slug: 'fatima-zahra', name: 'فاطمة الزهراء', title: 'صحفية وباحثة' },
          { id: 3, slug: 'youssef-benali', name: 'يوسف بنعلي', title: 'أكاديمي ومفكر' },
        ];
      }
      
      return data || [];
    },
  });
}

// جلب مقال واحد
export function useGetMAGHREB24Article(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// جلب المقالات الأخيرة
export function useLatestMAGHREB24Articles(limit: number = 5) {
  return useQuery({
    queryKey: ['latest-articles', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    },
  });
}


