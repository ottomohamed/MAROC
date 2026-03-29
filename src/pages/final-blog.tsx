import { useState, useEffect } from "react";
import { Loader2, Trash2, Upload, ImageIcon } from "lucide-react";

// ==================== إعدادات API ====================
const CLOUDINARY_NAME = "dvjnppif6";
const CLOUDINARY_UPLOAD = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;

const JSONBIN_ID = "459973159591136";
const JSONBIN_KEY = "HQyLYeSUymIwoQBXJsabhoxz_hU";

// ==================== دوال API ====================
const getArticles = async () => {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
    headers: { "X-Master-Key": JSONBIN_KEY }
  });
  const data = await res.json();
  return data.record?.articles || [];
};

const saveArticles = async (articles: any[]) => {
  await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_KEY
    },
    body: JSON.stringify({ articles })
  });
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");
  
  const res = await fetch(CLOUDINARY_UPLOAD, {
    method: "POST",
    body: formData
  });
  
  const data = await res.json();
  return data.secure_url;
};

// ==================== الموقع ====================
export default function FinalBlog() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const publish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("العنوان والمحتوى مطلوبان");
      return;
    }
    
    setSaving(true);
    
    let imageUrl = "";
    if (image) {
      setUploading(true);
      try {
        imageUrl = await uploadImageToCloudinary(image);
      } catch (err) {
        alert("فشل رفع الصورة");
        setSaving(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    const newArticle = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      image: imageUrl,
      date: new Date().toLocaleString("ar", { dateStyle: "full", timeStyle: "short" })
    };
    
    const newArticles = [newArticle, ...articles];
    await saveArticles(newArticles);
    setArticles(newArticles);
    
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview("");
    alert("✅ تم نشر المقال بنجاح!");
    setSaving(false);
  };

  const deleteArticle = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      const newArticles = articles.filter(a => a.id !== id);
      await saveArticles(newArticles);
      setArticles(newArticles);
    }
  };

  // صفحة الدخول
  if (!auth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 rounded-2xl w-96">
          <h1 className="text-2xl text-emerald-500 text-center mb-6">مدونتي</h1>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-zinc-800 p-3 rounded-xl mb-4 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="كلمة المرور"
            onKeyPress={(e: any) => e.key === "Enter" && pass === "admin123" && setAuth(true)}
          />
          <button
            onClick={() => pass === "admin123" && setAuth(true)}
            className="w-full bg-emerald-600 p-3 rounded-xl font-bold hover:bg-emerald-500 transition"
          >
            دخول
          </button>
          <p className="text-center text-zinc-500 text-sm mt-4">كلمة المرور: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-500 text-center mb-8">مدونتي</h1>
        
        {/* نموذج إضافة مقال */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-800">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="عنوان المقال"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mb-4 text-white focus:outline-none focus:border-emerald-500"
          />
          
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="محتوى المقال"
            rows={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mb-4 text-white focus:outline-none focus:border-emerald-500"
          />
          
          {/* رفع الصورة */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer bg-zinc-800 p-3 rounded-xl border border-zinc-700 hover:border-emerald-500 transition">
              <Upload className="w-5 h-5" />
              <span>{image ? "تم اختيار صورة" : "اختر صورة للمقال"}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="معاينة" className="mt-3 w-full max-h-48 object-cover rounded-xl" />
            )}
          </div>
          
          <button
            onClick={publish}
            disabled={saving || uploading}
            className="w-full bg-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {saving || uploading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "نشر المقال"
            )}
          </button>
        </div>
        
        {/* قائمة المقالات */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">لا توجد مقالات بعد</p>
            <p className="text-zinc-600 text-sm mt-2">أضف أول مقال الآن!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map(article => (
              <div key={article.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition">
                {article.image && (
                  <img src={article.image} alt={article.title} className="w-full max-h-80 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-zinc-500">{article.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3">{article.title}</h2>
                  <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{article.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
