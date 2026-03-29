import { supabase } from '../lib/supabase';

const PUBLISH_KEY = "pK_9w$1tYvQ2!mN7rTz4#sP5";

export async function publishArticle(articleData: any) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        ...articleData,
        status: 'published',
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      }], {
        headers: {
          'x-publish-key': PUBLISH_KEY
        }
      })
      .select();

    if (error) {
      console.error('خطأ في النشر:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('فشل في النشر:', error);
    return { success: false, error: String(error) };
  }
}

// نشر مساهمة القارئ كمقال
export async function publishSubmissionAsArticle(submission: any, editorNote?: string) {
  try {
    // تحديث حالة المساهمة
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        status: 'approved',
        editor_note: editorNote,
        approved_at: new Date().toISOString()
      }, {
        headers: {
          'x-publish-key': PUBLISH_KEY
        }
      })
      .eq('id', submission.id);

    if (updateError) throw updateError;

    // إنشاء المقال من المساهمة
    const articleData = {
      title: submission.title,
      body: submission.body,
      excerpt: submission.excerpt || submission.body.slice(0, 200),
      section: submission.section || 'opinion',
      author_slug: submission.author_slug || 'guest',
      author_name: submission.authorName || 'ضيف',
      status: 'published',
      image_url: submission.authorPhotoUrl || null,
      source: 'reader_submission',
      original_submission_id: submission.id,
    };

    const result = await publishArticle(articleData);
    return result;
  } catch (error) {
    console.error('خطأ في نشر المساهمة:', error);
    return { success: false, error: String(error) };
  }
}

// تحديث مقال
export async function updateArticle(id: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      }, {
        headers: {
          'x-publish-key': PUBLISH_KEY
        }
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('خطأ في التحديث:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('فشل في التحديث:', error);
    return { success: false, error: String(error) };
  }
}

// حذف مقال
export async function deleteArticle(id: string) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete({
        headers: {
          'x-publish-key': PUBLISH_KEY
        }
      })
      .eq('id', id);

    if (error) {
      console.error('خطأ في الحذف:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('فشل في الحذف:', error);
    return { success: false, error: String(error) };
  }
}
