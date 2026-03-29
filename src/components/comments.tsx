import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Comment {
  id: string;
  article_id: string;
  parent_id: string | null;
  author_name: string;
  content: string;
  likes: number;
  created_at: string;
  replies?: Comment[];
}

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (data) {
      const topLevel = data.filter(c => !c.parent_id);
      const withReplies = topLevel.map(comment => ({
        ...comment,
        replies: data.filter(c => c.parent_id === comment.id)
      }));
      setComments(withReplies);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) {
      toast.error("الرجاء إدخال الاسم والتعليق");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      author_name: name.trim(),
      content: content.trim(),
      status: "approved",
    });
    if (error) {
      toast.error("خطأ في إرسال التعليق");
    } else {
      toast.success("تم إرسال تعليقك بنجاح!");
      setName("");
      setContent("");
      loadComments();
    }
    setSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!replyName.trim() || !replyContent.trim()) {
      toast.error("الرجاء إدخال الاسم والرد");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      parent_id: parentId,
      author_name: replyName.trim(),
      content: replyContent.trim(),
      status: "approved",
    });
    if (error) {
      toast.error("خطأ في إرسال الرد");
    } else {
      toast.success("تم إرسال ردك بنجاح!");
      setReplyTo(null);
      setReplyName("");
      setReplyContent("");
      loadComments();
    }
    setSubmitting(false);
  };

  const handleLike = async (commentId: string, currentLikes: number) => {
    if (likedComments.has(commentId)) return;
    const { error } = await supabase
      .from("comments")
      .update({ likes: currentLikes + 1 })
      .eq("id", commentId);
    if (!error) {
      setLikedComments(prev => new Set([...prev, commentId]));
      loadComments();
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800" dir="rtl">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-emerald-500" />
        التعليقات ({comments.length})
      </h3>

      {/* نموذج التعليق */}
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 mb-8">
        <h4 className="text-sm font-bold mb-3 text-gray-700 dark:text-zinc-300">أضف تعليقاً</h4>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="اسمك"
          className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg p-2 text-sm mb-2 focus:outline-none focus:border-emerald-500"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="اكتب تعليقك هنا..."
          rows={3}
          className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg p-2 text-sm mb-2 focus:outline-none focus:border-emerald-500 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
        </button>
      </div>

      {/* قائمة التعليقات */}
      {loading ? (
        <p className="text-center text-gray-400 text-sm">جاري التحميل...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">لا توجد تعليقات بعد. كن أول من يعلق!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    {comment.author_name[0]}
                  </div>
                  <span className="font-bold text-sm">{comment.author_name}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDateTime(comment.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-zinc-300 mb-3">{comment.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(comment.id, comment.likes)}
                  className={`flex items-center gap-1 text-xs ${likedComments.has(comment.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"} transition-colors`}
                >
                  <Heart className="w-3 h-3" fill={likedComments.has(comment.id) ? "currentColor" : "none"} />
                  {comment.likes}
                </button>
                <button
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  رد
                  {replyTo === comment.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* نموذج الرد */}
              {replyTo === comment.id && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <input
                    type="text"
                    value={replyName}
                    onChange={e => setReplyName(e.target.value)}
                    placeholder="اسمك"
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs mb-2 focus:outline-none"
                  />
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="اكتب ردك..."
                    rows={2}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs mb-2 focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    disabled={submitting}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    إرسال الرد
                  </button>
                </div>
              )}

              {/* الردود */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-r-2 border-emerald-200 dark:border-emerald-900 pr-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 text-xs font-bold">
                            {reply.author_name[0]}
                          </div>
                          <span className="font-bold text-xs">{reply.author_name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{formatDateTime(reply.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-zinc-300">{reply.content}</p>
                      <button
                        onClick={() => handleLike(reply.id, reply.likes)}
                        className={`flex items-center gap-1 text-[10px] mt-1 ${likedComments.has(reply.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"} transition-colors`}
                      >
                        <Heart className="w-3 h-3" fill={likedComments.has(reply.id) ? "currentColor" : "none"} />
                        {reply.likes}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
