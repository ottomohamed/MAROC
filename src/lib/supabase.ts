import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود المفاتيح
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing! Check your .env file');
}

// التصدير الرئيسي
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hook لجلب المقالات
export function useListMAGHREB24Articles({ limit = 12 } = {}) {
  return useQuery({
    queryKey: ['articles', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
}

// Hook لجلب المؤلفين
export function useListMAGHREB24Authors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}