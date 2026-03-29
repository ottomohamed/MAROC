import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    excerpt: "",
    section: "opinion",
    author_name: "",
    author_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("submissions")
        .insert([{
          ...formData,
          status: "pending",
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "تم إرسال المقال بنجاح",
        description: "سيتم مراجعة مقالك من قبل فريق التحرير",
      });

      setTimeout(() => {
        setLocation("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting article:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال مقالك، حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-gray-500">سيتم مراجعة مقالك ونشره قريباً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-right" dir="rtl">
      <h1 className="text-3xl md:text-4xl font-black mb-4">إرسال مقال</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        شارك برأيك مع قراء MAGHREB24. نرحب بالمقالات الأصيلة والعميقة في مختلف المجالات.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">عنوان المقال *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="أدخل عنوان المقال"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">القسم *</label>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <option value="opinion">رأي</option>
            <option value="news">أخبار</option>
            <option value="economy">اقتصاد</option>
            <option value="culture">ثقافة</option>
            <option value="sports">رياضة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">الملخص</label>
          <textarea
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            placeholder="ملخص مختصر للمقال"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">محتوى المقال *</label>
          <textarea
            rows={12}
            required
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            placeholder="اكتب مقالك هنا..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">الاسم *</label>
            <input
              type="text"
              required
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              placeholder="اسم الكاتب"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={formData.author_email}
              onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              placeholder="example@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading ? "جاري الإرسال..." : "إرسال المقال"}
        </button>
      </form>
    </div>
  );
}
