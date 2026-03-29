import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface Article {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  section: string;
  author_slug: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  views: number;
  shares: number;
  likes: number;
  reading_time?: number;
  tags?: string[];
}

// جلب جميع المقالات
export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });
};

// جلب مقال محدد
export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });
};

// إنشاء مقال جديد
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (article: Partial<Article>) => {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('تم إنشاء المقال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في إنشاء المقال: ' + error.message);
    },
  });
};

// تحديث مقال
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Article> & { id: string }) => {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      toast.success('تم تحديث المقال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في تحديث المقال: ' + error.message);
    },
  });
};

// حذف مقال
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('تم حذف المقال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في حذف المقال: ' + error.message);
    },
  });
};

// نشر مقال
export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('articles')
        .update({ 
          status: 'published', 
          published_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      toast.success('تم نشر المقال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في نشر المقال: ' + error.message);
    },
  });
};
