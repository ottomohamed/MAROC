import { supabase } from '@/lib/supabase'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Loader2, Terminal, ShieldAlert, Play, RefreshCw, Activity, 
  Crosshair, Send, Mic, Inbox, Check, X, ChevronDown, ChevronUp, 
  TrendingUp, Zap, BarChart2, Eye, Megaphone, Image as ImageIcon, 
  Layout, ImagePlus, UserX, Settings, Save, Trash2, MessageSquare, 
  ShieldBan, Users, AlertCircle, PenLine, ToggleLeft, ToggleRight, Plus,
  Upload, Search, Filter, Star, Clock, Edit, Globe, Sparkles, 
  Brain, Database, Cloud, Lock, Unlock, Bell, Calendar, Newspaper,
  Video, Link, Hash, Flag, Heart, Share2, Bookmark, MoreVertical,
  Monitor, Smartphone, Tablet, Sun, Moon, Code, GitBranch, GitCommit,
  Bold, Italic, List, Quote, Link2, Image as ImageIcon2, Eye as EyeIcon,
  Calendar as CalendarIcon, Download, FileText, TrendingUp as TrendingIcon,
  Users as UsersIcon, MessageCircle, PieChart as PieChartIcon, Award, Menu
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useAds } from "@/hooks/use-ads";
import { useBreakingNews } from "@/hooks/use-breaking-news";
import { toast, Toaster } from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';

// ==================== دالة النشر الآمنة ====================
const ADMIN_KEY_HEADER = "meridian2024";
const SUPABASE_FN_URL = import.meta.env.VITE_SUPABASE_URL + "/functions/v1/publish-article";

async function articleAction(action: "insert" | "update" | "delete", data?: any, id?: string) {
  const res = await fetch(SUPABASE_FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY_HEADER,
    },
    body: JSON.stringify({ action, data, id }),
  });
  const json = await res.json();
  if (json.error) throw new Error(typeof json.error === "object" ? JSON.stringify(json.error) : json.error);
  return json;
}

// ==================== الثوابت ====================
const ADMIN_KEY = "meridian2024";
const PUBLISH_KEY = "pK_9w$1tYvQ2!mN7rTz4#sP5";

// ==================== أنواع البيانات المتقدمة ====================
interface Author {
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
  performance?: {
    views: number;
    likes: number;
    shares: number;
    avgReadingTime: number;
  };
}

interface Article {
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
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

interface Submission {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhotoUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  editorNote?: string;
  section?: string;
}

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'deleted';
  created_at: string;
  likes: number;
  parent_id: string | null;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  title: string;
  alt_text: string;
  uploaded_by: string;
  created_at: string;
  size: number;
  width?: number;
  height?: number;
}

interface AnalyticsData {
  views_today: number;
  views_week: number;
  views_month: number;
  articles_published: number;
  pending_comments: number;
  avg_reading_time: number;
  top_articles: Article[];
  daily_visits: { date: string; count: number }[];
  hourly_visits: { hour: number; count: number }[];
  author_performance: { author: string; views: number; articles: number }[];
  user_engagement: { likes: number; shares: number; comments: number };
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
}

// ==================== المراسلون الموسع ====================
export const JOURNALISTS: Author[] = [
  {
    slug: "amina-mansouri",
    name: "أمينة المنصوري",
    beat: "السياسة",
    section: "politics",
    title: "مراسلة الشؤون السياسية",
    emoji: "🏛️",
    color: "text-blue-400",
    border: "border-blue-900/40",
    bg: "bg-blue-900/10",
    persona: "محللة سياسية متخصصة في الشأن المغربي والعربي. حاصلة على دكتوراه في العلوم السياسية من جامعة محمد الخامس.",
    topics: ["البرلمان", "الحكومة", "الأحزاب", "السفارات", "الانتخابات", "السياسة الخارجية", "الدبلوماسية", "القانون الدستوري"],
    performance: { views: 125000, likes: 8500, shares: 3200, avgReadingTime: 4.2 }
  },
  {
    slug: "youssef-alami",
    name: "يوسف العلمي",
    beat: "الاقتصاد",
    section: "economics",
    title: "محرر الشؤون الاقتصادية",
    emoji: "📈",
    color: "text-emerald-400",
    border: "border-emerald-900/40",
    bg: "bg-emerald-900/10",
    persona: "اقتصادي متخصص في الأسواق المالية والاستثمار. عمل سابقاً في البنك الدولي.",
    topics: ["البورصة", "الاستثمار", "الميزانية", "التجارة", "البنوك", "الشركات", "العقارات", "الطاقة"],
    performance: { views: 98000, likes: 6200, shares: 2800, avgReadingTime: 5.1 }
  },
  {
    slug: "mariam-tahiri",
    name: "مريم الطاهري",
    beat: "الرياضة",
    section: "sports",
    title: "مراسلة الشؤون الرياضية",
    emoji: "⚽",
    color: "text-amber-400",
    border: "border-amber-900/40",
    bg: "bg-amber-900/10",
    persona: "صحفية رياضية متخصصة في كرة القدم المغربية. مقدمة برنامج 'المدرج' على قناة الرياضية.",
    topics: ["الوداد", "الرجاء", "المنتخب الوطني", "كأس العالم", "الدوري", "الألعاب الأولمبية", "الكرة النسوية"],
    performance: { views: 156000, likes: 12400, shares: 8900, avgReadingTime: 3.8 }
  },
  {
    slug: "omar-benjelloun",
    name: "عمر بنجلون",
    beat: "الثقافة",
    section: "culture",
    title: "محرر الشؤون الثقافية",
    emoji: "📚",
    color: "text-violet-400",
    border: "border-violet-900/40",
    bg: "bg-violet-900/10",
    persona: "ناقد ثقافي وأديب، صدرت له عدة مؤلفات في التراث المغربي والهوية.",
    topics: ["الأدب", "المسرح", "التراث", "المهرجانات", "الكتب", "الهوية المغربية", "الفلسفة", "الترجمة"],
    performance: { views: 72000, likes: 4800, shares: 2100, avgReadingTime: 6.2 }
  },
  {
    slug: "hassan-alaoui",
    name: "حسن العلوي",
    beat: "الفنون",
    section: "culture",
    title: "ناقد الفنون والإعلام",
    emoji: "🎭",
    color: "text-pink-400",
    border: "border-pink-900/40",
    bg: "bg-pink-900/10",
    persona: "ناقد فني متخصص في الموسيقى والسينما. عضو في نقاد السينما المغاربة.",
    topics: ["السينما", "الموسيقى", "المسرح", "التشكيل", "المعارض", "الفنانون", "الأفلام الوثائقية"],
    performance: { views: 54000, likes: 3900, shares: 1500, avgReadingTime: 4.5 }
  },
  {
    slug: "fatima-benali",
    name: "فاطمة بنعلي",
    beat: "المجتمع",
    section: "society",
    title: "مراسلة الشؤون الاجتماعية",
    emoji: "🏘️",
    color: "text-rose-400",
    border: "border-rose-900/40",
    bg: "bg-rose-900/10",
    persona: "صحفية اجتماعية متخصصة في قضايا الأسرة والمجتمع. حاصلة على جائزة الصحافة الاستقصائية.",
    topics: ["التعليم", "الصحة", "الأسرة", "الشباب", "المرأة", "السكن", "الهجرة", "ذوي الاحتياجات الخاصة"],
    performance: { views: 89000, likes: 6700, shares: 3400, avgReadingTime: 4.9 }
  },
  {
    slug: "karim-tazi",
    name: "كريم الطازي",
    beat: "العلوم والتقنية",
    section: "science",
    title: "محرر العلوم والتكنولوجيا",
    emoji: "🔬",
    color: "text-cyan-400",
    border: "border-cyan-900/40",
    bg: "bg-cyan-900/10",
    persona: "متخصص في العلوم والتكنولوجيا والبيئة. حاصل على ماجستير في الذكاء الاصطناعي.",
    topics: ["الذكاء الاصطناعي", "البيئة", "الفضاء", "الطاقة المتجددة", "الصحة الرقمية", "الابتكار", "التكنولوجيا الخضراء"],
    performance: { views: 112000, likes: 8400, shares: 4200, avgReadingTime: 5.5 }
  },
];

// ==================== محرر النصوص المتقدم ====================
function RichTextEditor({ content, onChange, darkMode, onImageUpload, imageUrl, onImageRemove }: { content: string; onChange: (content: string) => void; darkMode: boolean; onImageUpload?: (file: File) => void; imageUrl?: string; onImageRemove?: () => void }) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: true }),
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: content || '<p>اكتب محتوى المقال هنا...</p>',
    onUpdate: ({ editor }: any) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `min-h-[300px] p-4 focus:outline-none ${darkMode ? 'text-zinc-300' : 'text-gray-800'}`,
        dir: 'rtl',
      },
    },
  });

  const addImage = () => {
    const url = prompt('أدخل رابط الصورة:');
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt('أدخل الرابط:');
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  const TB = ({ onClick, active = false, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
    >
      {children}
    </button>
  );

  return (
    <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
      {/* شريط الأدوات */}
      <div className={`flex flex-wrap items-center gap-1 p-2 border-b ${darkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <TB onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="عنوان 1"><span className="text-xs font-bold">H1</span></TB>
        <TB onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="عنوان 2"><span className="text-xs font-bold">H2</span></TB>
        <TB onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="عنوان 3"><span className="text-xs font-bold">H3</span></TB>
        <div className={`w-px h-5 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        <TB onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="خط عريض"><Bold className="w-4 h-4" /></TB>
        <TB onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="خط مائل"><Italic className="w-4 h-4" /></TB>
        <div className={`w-px h-5 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        <TB onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="قائمة نقطية"><List className="w-4 h-4" /></TB>
        <TB onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="قائمة مرقمة"><span className="text-xs font-bold">1.</span></TB>
        <TB onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="اقتباس"><Quote className="w-4 h-4" /></TB>
        <TB onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="فاصل أفقي"><span className="text-xs">—</span></TB>
        <div className={`w-px h-5 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        <TB onClick={addImage} title="إضافة صورة"><ImageIcon2 className="w-4 h-4" /></TB>
        <TB onClick={() => imageInputRef.current?.click()} title="رفع صورة"><Upload className="w-4 h-4" /></TB>
        <TB onClick={addLink} active={editor?.isActive('link')} title="إضافة رابط"><Link2 className="w-4 h-4" /></TB>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && onImageUpload) onImageUpload(f); }} />
        <div className="flex-1" />
        <TB onClick={() => editor?.chain().focus().undo().run()} title="تراجع"><span className="text-xs">↩</span></TB>
        <TB onClick={() => editor?.chain().focus().redo().run()} title="إعادة"><span className="text-xs">↪</span></TB>
        <div className={`w-px h-5 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        <TB onClick={() => setIsPreview(!isPreview)} active={isPreview} title="معاينة"><EyeIcon className="w-4 h-4" /></TB>
      </div>

      {/* المحرر أو المعاينة */}
      {isPreview ? (
        <div
          className={`p-4 min-h-[300px] prose prose-lg max-w-none ${darkMode ? 'bg-black text-zinc-300 prose-invert' : 'bg-white text-gray-800'}`}
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
        />
      ) : (
        <div className={darkMode ? 'bg-black' : 'bg-white'}>
          <style>{`
            .ProseMirror h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror h3 { font-size: 1.2em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror ul { list-style-type: disc; padding-right: 1.5em; }
            .ProseMirror ol { list-style-type: decimal; padding-right: 1.5em; }
            .ProseMirror blockquote { border-right: 3px solid #10b981; padding-right: 1em; color: #6b7280; margin: 0.5em 0; }
            .ProseMirror strong { font-weight: bold; }
            .ProseMirror em { font-style: italic; }
            .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
            .ProseMirror hr { border-color: #374151; margin: 1em 0; }
            .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #6b7280; pointer-events: none; float: right; }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}

// ==================== نافذة إنشاء/تحرير المقال المتقدمة ====================
function ArticleEditorModal({ article, onClose, onSave, darkMode }: any) {
  const [title, setTitle] = useState(article?.title || '');
  const [body, setBody] = useState(article?.body || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [seoTitle, setSeoTitle] = useState(article?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(article?.seo_description || '');
  const [scheduleDate, setScheduleDate] = useState(article?.scheduled_for || '');
  const [isScheduled, setIsScheduled] = useState(!!article?.scheduled_for);
  const [imageUrl, setImageUrl] = useState(article?.image_url || '');
  const [section, setSection] = useState(article?.section || 'politics');
  const [authorName, setAuthorName] = useState(article?.author_name || '');
  const [authorSlug, setAuthorSlug] = useState(article?.author_slug || '');
  const [dbAuthors, setDbAuthors] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('authors').select('slug, name').order('name').then(({ data }) => {
      if (data) setDbAuthors(data);
    });
  }, []);

  const handleAuthorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    const author = dbAuthors.find(a => a.slug === slug);
    if (author) { setAuthorSlug(author.slug); setAuthorName(author.name); }
    else { setAuthorSlug('editor'); setAuthorName(e.target.value); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      toast.success('تم رفع الصورة بنجاح');
    } catch (err: any) {
      toast.error('خطأ في رفع الصورة: ' + err.message);
    }
    setUploadingImage(false);
  };
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const calculateSeoScore = () => {
    let score = 0;
    if (title.length >= 30 && title.length <= 60) score += 20;
    if (seoDescription.length >= 120 && seoDescription.length <= 160) score += 20;
    if (tags.length >= 3 && tags.length <= 5) score += 20;
    if (body.length > 500) score += 20;
    if (article?.image_url) score += 20;
    return score;
  };
  
  const handleSave = async () => {
    setSaving(true);
    const articleData = {
      title: title.trim(),
      body: body.trim(),
      excerpt: excerpt.trim() || body.slice(0, 200),
      tags,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt.slice(0, 160),
      updated_at: new Date().toISOString(),
      image_url: imageUrl || null,
      section: section,
      ...(isScheduled && scheduleDate ? { scheduled_for: scheduleDate, status: 'scheduled' } : {})
    };
    
    let error;
    if (article?.id) {
      try { await articleAction("update", { ...articleData, author_name: authorName || article.author_name, author_slug: authorSlug || article.author_slug }, article.id); } catch(e: any) { error = { message: e.message }; }
    } else {
      try { await articleAction("insert", { ...articleData, author_slug: authorSlug || "editor", author_name: authorName || "رئيس التحرير", status: isScheduled ? "scheduled" : "draft", created_at: new Date().toISOString(), slug: title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '') + '-' + Date.now() }); } catch(e: any) { error = { message: e.message }; }
    }
    
    if (error) {
      toast.error('خطأ في الحفظ: ' + JSON.stringify(error));
    } else {
      toast.success(isScheduled ? 'تم جدولة المقال بنجاح' : 'تم حفظ المقال بنجاح');
      onSave();
      onClose();
    }
    setSaving(false);
  };
  
  const seoScore = calculateSeoScore();
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`${darkMode ? 'bg-zinc-900' : 'bg-white'} rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 p-4 border-b ${darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'} flex justify-between items-center z-10`}>
          <div className="flex gap-2">
            <button 
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 text-sm rounded-lg ${previewMode ? 'bg-emerald-500/20 text-emerald-400' : darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600'}`}
            >
              <EyeIcon className="w-4 h-4 inline ml-1" />
              {previewMode ? 'تحرير' : 'معاينة'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-bold">{article?.id ? 'تحرير المقال' : 'مقال جديد'}</h3>
        </div>
        
        {previewMode ? (
          <div className="p-8 max-w-4xl mx-auto">
            {article?.image_url && (
              <img src={article.image_url} alt={title} className="w-full h-96 object-cover rounded-xl mb-6" />
            )}
            <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
            <div className="flex items-center gap-4 mb-6 text-sm text-zinc-500">
              <span>{article?.author_name || 'رئيس التحرير'}</span>
              <span>{formatDateTime(new Date().toISOString())}</span>
              <span>{Math.ceil(body.split(/\s+/).length / 200)} دقيقة قراءة</span>
            </div>
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* العنوان */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>العنوان</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full ${darkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-lg p-3 text-lg font-bold focus:outline-none focus:border-emerald-500`}
                placeholder="أدخل عنوان المقال..."
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                {title.length} / 60 حرف
              </p>
            </div>
            
            {/* صورة المقال */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>صورة المقال</label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${darkMode ? 'border-zinc-700' : 'border-gray-300'}`}>
                {imageUrl ? (
                  <div className="relative">
                    <img src={imageUrl} alt="" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className={`px-4 py-3 rounded-lg flex items-center gap-2 mx-auto ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                    >
                      {uploadingImage ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...</>
                      ) : (
                        <><ImagePlus className="w-4 h-4" /> اختر صورة</>
                      )}
                    </button>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-zinc-600' : 'text-gray-400'}`}>PNG, JPG, WebP — حجم أقصى 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* القسم */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>القسم</label>
              <select
                value={section}
                onChange={e => setSection(e.target.value)}
                className={`w-full ${darkMode ? "bg-black border-zinc-800 text-zinc-300" : "bg-gray-50 border-gray-200 text-gray-800"} border rounded-lg p-3 focus:outline-none focus:border-emerald-500`}
              >
                <option value="politics">السياسة</option>
                <option value="economics">الاقتصاد</option>
                <option value="sports">الرياضة</option>
                <option value="culture">الثقافة</option>
                <option value="society">المجتمع</option>
                <option value="science">العلوم والتقنية</option>
                <option value="diaspora">مغاربة العالم</option>
                <option value="tribes">القبائل المغربية</option>
                <option value="agriculture">شؤون الفلاح</option>
                <option value="international">أخبار دولية</option>
              </select>
            </div>

            {/* الصحفي */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>الصحفي / الكاتب</label>
              <div className="flex gap-2">
                <select
                  value={authorSlug}
                  onChange={handleAuthorSelect}
                  className={`flex-1 ${darkMode ? "bg-black border-zinc-800 text-zinc-300" : "bg-gray-50 border-gray-200 text-gray-800"} border rounded-lg p-3 focus:outline-none focus:border-emerald-500`}
                >
                  <option value="">اختر صحفياً...</option>
                  {dbAuthors.map(a => (
                    <option key={a.slug} value={a.slug}>{a.name}</option>
                  ))}
                </select>
                <input
                  value={authorName}
                  onChange={e => { setAuthorName(e.target.value); setAuthorSlug('custom'); }}
                  placeholder="أو اكتب الاسم يدوياً"
                  className={`flex-1 ${darkMode ? "bg-black border-zinc-800 text-zinc-300" : "bg-gray-50 border-gray-200 text-gray-800"} border rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500`}
                />
              </div>
            </div>

            {/* المحتوى */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>المحتوى</label>
              <RichTextEditor
                content={body}
                onChange={setBody}
                darkMode={darkMode}
                onImageUpload={async (file) => {
                  setUploadingImage(true);
                  try {
                    const ext = file.name.split('.').pop();
                    const fileName = `${Date.now()}.${ext}`;
                    const { error } = await supabase.storage
                      .from('article-images')
                      .upload(fileName, file, { upsert: true });
                    if (error) throw error;
                    const { data: urlData } = supabase.storage
                      .from('article-images')
                      .getPublicUrl(fileName);
                    const url = urlData.publicUrl;
                    setBody(prev => prev + `\n\n![صورة](${url})\n\n`);
                    toast.success('تم رفع الصورة وإدراجها في المحتوى');
                  } catch (err: any) {
                    toast.error('خطأ في رفع الصورة: ' + err.message);
                  }
                  setUploadingImage(false);
                }}
                imageUrl={imageUrl}
                onImageRemove={() => setImageUrl('')}
              />
            </div>
            
            {/* المقتطف */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>المقتطف</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                className={`w-full ${darkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500`}
                placeholder="ملخص قصير للمقال..."
              />
            </div>
            
            {/* العلامات (Tags) */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>العلامات</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                  className={`flex-1 ${darkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-lg p-2 text-sm`}
                  placeholder="أضف علامة..."
                />
                <button onClick={handleAddTag} className="px-3 py-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-700'}`}>
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* SEO */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                <Globe className="w-4 h-4" /> تحسين محركات البحث (SEO)
              </h4>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    className={`w-full ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg p-2 text-sm`}
                    placeholder="عنوان SEO (يظهر في محركات البحث)"
                  />
                </div>
                <div>
                  <textarea
                    value={seoDescription}
                    onChange={e => setSeoDescription(e.target.value)}
                    rows={2}
                    className={`w-full ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg p-2 text-sm`}
                    placeholder="وصف SEO (يظهر في نتائج البحث)"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>نقاط تحسين SEO</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${seoScore}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${seoScore >= 80 ? 'text-emerald-500' : seoScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{seoScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* جدولة النشر */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-800/50' : 'bg-gray-50'}`}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={e => setIsScheduled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className={`text-sm font-medium ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>جدولة النشر</span>
              </label>
              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className={`mt-3 w-full ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200 text-gray-800'} border rounded-lg p-2 text-sm`}
                />
              )}
            </div>
          </div>
        )}
        
        <div className={`sticky bottom-0 p-4 border-t ${darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'} flex gap-3 justify-end`}>
          <button onClick={onClose} className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/20 transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-600/20 transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'جاري الحفظ...' : (article?.id ? 'تحديث' : 'نشر')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== نظام الإشعارات ====================
function NotificationCenter({ darkMode }: { darkMode: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [show, setShow] = useState(false);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    toast(notification.message, { icon: notification.type === 'success' ? '✅' : '🔔' });
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShow(!show)}
        className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {show && (
        <div className={`absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border overflow-hidden`}>
          <div className={`p-3 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
            <h4 className="text-sm font-bold">الإشعارات</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">لا توجد إشعارات</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-3 border-b ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors ${!notification.read ? (darkMode ? 'bg-zinc-800/50' : 'bg-blue-50/50') : ''}`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{formatDateTime(notification.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== الدوال المساعدة ====================
async function ensureAuthorsExist() {
  const { data: existingAuthors } = await supabase
    .from('authors')
    .select('slug');
  
  const existingSlugs = existingAuthors?.map(a => a.slug) || [];
  const missingAuthors = JOURNALISTS.filter(j => !existingSlugs.includes(j.slug));
  
  if (missingAuthors.length > 0) {
    const { error } = await supabase
      .from('authors')
      .insert(missingAuthors.map(j => ({
        slug: j.slug,
        name: j.name,
        beat: j.beat,
        section: j.section,
        title: j.title,
        emoji: j.emoji,
        color: j.color,
        persona: j.persona,
        topics: j.topics,
        is_active: true,
      })))
      ;
    
    if (error) {
      console.error('خطأ في إضافة المؤلفين:', error);
    } else {
      console.log('✅ تم إضافة المؤلفين المفقودين');
    }
  }
}

async function calculateReadingTime(text: string): Promise<number> {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ==================== المكون الرئيسي ====================
export default function Newsroom() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  
  useEffect(() => {
    if (sessionStorage.getItem('newsroom_auth') === 'true') {
      setAuth(true);
    }
    const savedMode = localStorage.getItem('newsroom_dark_mode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_KEY) {
      sessionStorage.setItem('newsroom_auth', 'true');
      setAuth(true);
      setError("");
      toast.success('تم الدخول بنجاح');
    } else {
      setError("خطأ: بيانات الاعتماد الإدارية غير صالحة");
      toast.error('بيانات الاعتماد غير صالحة');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('newsroom_dark_mode', (!darkMode).toString());
  };

  if (!auth) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} text-emerald-500 font-sans absolute inset-0 z-50`} dir="rtl">
        <Toaster position="top-center" />
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen">
          <img src={`${import.meta.env.BASE_URL}images/newsroom-bg.png`} className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="z-10 w-full max-w-md p-8 border border-emerald-900/50 bg-black/80 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.1)] text-right">
          <div className="flex justify-center mb-8">
            <ShieldAlert className="w-16 h-16 animate-pulse opacity-80" />
          </div>
          <h1 className="text-2xl text-center mb-2 tracking-widest font-bold">دخول مقيد</h1>
          <p className="text-emerald-700 text-xs text-center mb-10 tracking-widest">غرفة أخبار مغرب 24 المستقلة</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs mb-2 tracking-widest text-emerald-600 text-right">أدخل مفتاح المرور:</label>
              <input 
                type="password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                autoFocus
                className="w-full bg-black border-b border-emerald-800 text-emerald-400 p-2 focus:outline-none focus:border-emerald-400 transition-colors text-right"
              />
            </div>
            {error && <p className="text-red-500 text-xs tracking-widest animate-pulse text-right">{error}</p>}
            <button type="submit" className="w-full border border-emerald-800 text-emerald-500 hover:bg-emerald-950/30 tracking-widest font-bold py-3 transition-colors text-sm">
              تفويض الاتصال
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0a] text-zinc-300' : 'bg-gray-100 text-gray-800'} font-sans relative overflow-hidden`} dir="rtl">
      <Toaster position="top-center" />
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>
      <NewsroomDashboard darkMode={darkMode} />
    </div>
  );
}

// ==================== لوحة التحكم الرئيسية (مختصرة للاختصار) ====================
function NewsroomDashboard({ darkMode }: { darkMode: boolean }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'submissions' | 'comments' | 'media' | 'analytics' | 'settings'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedJournalist, setSelectedJournalist] = useState("");
  const [topicHint, setTopicHint] = useState("");
  const [briefSent, setBriefSent] = useState(false);
  const [publisherMsg, setPublisherMsg] = useState("");
  const [discussing, setDiscussing] = useState(false);
  
  // بيانات
  const [articles, setArticles] = useState<Article[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  useEffect(() => {
    ensureAuthorsExist();
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
      loadArticles(),
      loadSubmissions(),
      loadComments(),
      loadAnalytics(),
    ]);
    setIsLoading(false);
  };
  
  const loadArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setArticles(data);
    }
  };
  
  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setSubmissions(data);
    }
  };
  
  const loadComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (!error && data) {
      setComments(data);
    }
  };
  
  const loadAnalytics = async () => {
    // بيانات تحليلية محاكاة مع تحسينات
    const dailyVisits = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-MA'),
      count: Math.floor(Math.random() * 5000) + 3000
    }));
    
    setAnalytics({
      views_today: 12847,
      views_week: 84321,
      views_month: 342890,
      articles_published: articles.length,
      pending_comments: comments.length,
      avg_reading_time: 3.5,
      top_articles: articles.slice(0, 5),
      daily_visits: dailyVisits,
      hourly_visits: [],
      author_performance: JOURNALISTS.map(j => ({
        author: j.name,
        views: j.performance?.views || 0,
        articles: Math.floor(Math.random() * 50) + 10
      })),
      user_engagement: { likes: 12500, shares: 3400, comments: 890 }
    });
  };
  
  const handleBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicHint.trim()) return;
    
    setBriefSent(true);
    const journalist = JOURNALISTS.find(j => j.slug === selectedJournalist);
    
    setLogs(prev => [{
      id: Date.now().toString(),
      speakerName: 'نظام التوجيه',
      message: `تم توجيه ${journalist?.name || 'المراسلين'} للكتابة عن: ${topicHint}`,
      createdAt: new Date().toISOString(),
    }, ...prev]);
    
    setTopicHint("");
    setTimeout(() => setBriefSent(false), 3000);
    toast.success('تم توجيه المراسلين');
  };
  
  const handleDiscuss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publisherMsg.trim()) return;
    setDiscussing(true);
    
    setLogs(prev => [{
      id: Date.now().toString(),
      speakerName: 'رئيس التحرير',
      message: publisherMsg,
      createdAt: new Date().toISOString(),
    }, ...prev]);
    
    setPublisherMsg("");
    setTimeout(() => setDiscussing(false), 2000);
  };
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchQuery) || article.body.includes(searchQuery);
    const matchesSection = filterSection === 'all' || article.section === filterSection;
    return matchesSearch && matchesSection;
  });
  
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const pendingCommentsCount = comments.length;
  
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto p-6">
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} pb-4`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold">غرفة أخبار مغرب 24</h1>
          </div>
          <button
            onClick={() => loadData()}
            className={`p-2 ${darkMode ? 'text-zinc-500 hover:text-zinc-400 border-zinc-800 hover:border-zinc-700' : 'text-gray-500 hover:text-gray-700 border-gray-200 hover:border-gray-300'} border transition-colors`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`pr-9 pl-3 py-1 text-sm ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-gray-200 text-gray-800'} border rounded-md focus:outline-none focus:border-emerald-500`}
            />
          </div>
          <NotificationCenter darkMode={darkMode} />
          <span className="text-xs text-zinc-600 uppercase tracking-widest">غرفة الأخبار</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`flex gap-1 mb-6 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
        {[
          { id: 'articles', label: 'المقالات', icon: Newspaper },
          { id: 'submissions', label: 'مساهمات', icon: Inbox, count: pendingCount },
          { id: 'comments', label: 'تعليقات', icon: MessageSquare, count: pendingCommentsCount },
          { id: 'media', label: 'الوسائط', icon: ImageIcon },
          { id: 'analytics', label: 'تحليلات', icon: BarChart2 },
          { id: 'settings', label: 'إعدادات', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? `border-b-2 border-emerald-500 text-emerald-500`
                : `${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* المحتوى حسب التاب المختار */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'articles' && (
            <ArticlesPanel 
              articles={filteredArticles}
              darkMode={darkMode}
              onRefresh={loadArticles}
              filterSection={filterSection}
              setFilterSection={setFilterSection}
            />
          )}
          {activeTab === 'analytics' && analytics && (
            <AnalyticsDashboard analytics={analytics} darkMode={darkMode} />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel darkMode={darkMode} />
          )}
          {activeTab === 'comments' && (
            <CommentsPanel comments={comments} darkMode={darkMode} onRefresh={loadComments} />
          )}
          {(activeTab === 'submissions' || activeTab === 'media') && (
            <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg p-8 text-center text-zinc-500`}>
              <p>جاري تطوير {activeTab === 'submissions' ? 'لوحة المساهمات' : 'مكتبة الوسائط'} ...</p>
            </div>
          )}
        </div>
        
        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* توجيه هيئة التحرير */}
          <div className={`${darkMode ? 'bg-black border-emerald-900/40' : 'bg-white border-gray-200'} border p-5 rounded-lg`}>
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2 justify-end">
              توجيه هيئة التحرير
              <Crosshair className="w-3.5 h-3.5" />
            </h3>
            <p className={`text-[10px] ${darkMode ? 'text-zinc-600' : 'text-gray-400'} mb-4 pb-3 border-b ${darkMode ? 'border-zinc-900' : 'border-gray-200'}`}>
              اختر المراسل وحدد الموضوع
            </p>
            
            <div className="space-y-2 mb-4">
              <select
                value={selectedJournalist}
                onChange={(e: any) => setSelectedJournalist(e.target.value)}
                className={`w-full ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border text-xs p-3 focus:outline-none focus:border-emerald-700 rounded-lg`}
              >
                <option value="">كل المراسلين</option>
                {JOURNALISTS.map(j => (
                  <option key={j.slug} value={j.slug}>{j.emoji} {j.name} - {j.beat}</option>
                ))}
              </select>
            </div>
            
            <form onSubmit={handleBrief} className="space-y-4">
              <textarea
                value={topicHint}
                onChange={e => setTopicHint(e.target.value)}
                rows={3}
                placeholder="أدخل الموضوع..."
                className={`w-full ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border text-xs p-3 focus:outline-none focus:border-emerald-700 resize-none rounded-lg`}
              />
              
              <button
                type="submit"
                disabled={!topicHint.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-600/20 disabled:opacity-40 text-xs uppercase font-bold rounded-lg"
              >
                {briefSent ? (
                  <><Activity className="w-3.5 h-3.5" /> تم الإرسال</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> إرسال</>
                )}
              </button>
            </form>
          </div>
          
          {/* وكالة المراسلين */}
          <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border p-5 rounded-lg`}>
            <h3 className={`text-xs font-bold ${darkMode ? 'text-zinc-500' : 'text-gray-500'} uppercase tracking-widest mb-4 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} pb-2`}>
              وكلاء غرفة الأخبار
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 justify-end pb-3 border-b ${darkMode ? 'border-zinc-900' : 'border-gray-100'}`}>
                <div className="text-right">
                  <div className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-gray-800'}`}>محمد عبد الرحمان</div>
                  <div className={`text-[9px] ${darkMode ? 'text-zinc-500' : 'text-gray-400'} uppercase tracking-widest mt-0.5`}>رئيس التحرير</div>
                </div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
              </div>
              {JOURNALISTS.map(j => (
                <div key={j.slug} className="flex items-start gap-3 justify-end">
                  <div className="text-right flex-1">
                    <div className={`text-xs font-bold ${j.color}`}>
                      {j.emoji} {j.name}
                      <span className={`text-[9px] ${darkMode ? 'text-zinc-600' : 'text-gray-400'} font-normal mr-2`}>— {j.beat}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {j.topics.slice(0, 3).map(t => (
                        <span key={t} className={`text-[8px] px-1 py-0.5 border ${j.border} ${j.color} opacity-60 rounded`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0 mt-1.5 ${j.color.replace('text-', 'bg-')}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* غرفة المحادثة */}
          <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg flex flex-col h-[400px]`}>
            <div className={`border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${darkMode ? 'text-zinc-600' : 'text-gray-400'}`}>نشاط غرفة الأخبار</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className={`w-4 h-4 ${darkMode ? 'text-zinc-700' : 'text-gray-400'}`} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {logs.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-zinc-700' : 'text-gray-400'} text-sm`}>
                  لا توجد رسائل بعد...
                </div>
              ) : (
                logs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 text-right">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-xs font-bold text-emerald-500">{log.speakerName}</span>
                        <span className={`text-[10px] ${darkMode ? 'text-zinc-700' : 'text-gray-400'}`}>{formatDateTime(log.createdAt)}</span>
                      </div>
                      <div className={`${darkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'} border p-3 text-sm rounded-lg`}>
                        {log.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {discussing && (
                <div className="flex gap-3 items-center text-zinc-600 text-xs animate-pulse justify-end">
                  <span className={darkMode ? 'text-zinc-600' : 'text-gray-400'}>الفريق يفكر...</span>
                  <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleDiscuss} className={`border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'} p-4 flex gap-3 ${darkMode ? 'bg-zinc-950/50' : 'bg-gray-50'}`}>
              <button
                type="submit"
                disabled={discussing || !publisherMsg.trim()}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-600/10 text-amber-500 border border-amber-500/30 hover:bg-amber-600/20 transition-colors disabled:opacity-40 text-xs uppercase font-bold rounded-lg"
              >
                {discussing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
              <input
                type="text"
                value={publisherMsg}
                onChange={e => setPublisherMsg(e.target.value)}
                placeholder="خاطب غرفة الأخبار..."
                disabled={discussing}
                className={`flex-1 bg-transparent border-none ${darkMode ? 'text-zinc-300 placeholder:text-zinc-700' : 'text-gray-800 placeholder:text-gray-400'} text-sm focus:outline-none disabled:opacity-40 text-right`}
              />
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${darkMode ? 'bg-amber-900/30 border-amber-800/50' : 'bg-amber-100 border-amber-200'} border flex items-center justify-center`}>
                <Mic className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== لوحة المقالات المتقدمة ====================
function ArticlesPanel({ articles, darkMode, onRefresh, filterSection, setFilterSection }: any) {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  
  const sections = ['all', 'politics', 'economics', 'sports', 'culture', 'society', 'science'];
  const sectionNames: Record<string, string> = {
    all: 'الكل', politics: 'السياسة', economics: 'الاقتصاد', sports: 'الرياضة',
    culture: 'الثقافة', society: 'المجتمع', science: 'العلوم', diaspora: 'مغاربة العالم', tribes: 'القبائل المغربية', agriculture: 'شؤون الفلاح', international: 'أخبار دولية',
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      let error: any = null; try { await articleAction("delete", undefined, id); } catch(e: any) { error = { message: e.message }; }
      
      if (error) {
        toast.error('خطأ في الحذف: ' + error.message);
      } else {
        toast.success('تم حذف المقال بنجاح');
        onRefresh();
      }
    }
  };
  
  const handlePublish = async (id: string) => {
    let error: any = null; try { await articleAction("update", { status: "published", published_at: new Date().toISOString() }, id); } catch(e: any) { error = { message: e.message }; }
    
    if (error) {
      toast.error('خطأ في النشر: ' + error.message);
    } else {
      toast.success('تم نشر المقال');
      onRefresh();
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;
    if (confirm(`هل أنت متأكد من حذف ${selectedArticles.length} مقال؟`)) {
      let error: any = null; try { for (const aid of selectedArticles) { await articleAction("delete", undefined, aid); } } catch(e: any) { error = { message: e.message }; }
      
      if (error) {
        toast.error('خطأ في الحذف: ' + error.message);
      } else {
        toast.success(`تم حذف ${selectedArticles.length} مقال`);
        setSelectedArticles([]);
        onRefresh();
      }
    }
  };
  
  const exportToExcel = () => {
    const exportData = articles.map((a: Article) => ({
      العنوان: a.title,
      'اسم الكاتب': a.author_name,
      القسم: sectionNames[a.section] || a.section,
      الحالة: a.status === 'published' ? 'منشور' : a.status === 'draft' ? 'مسودة' : 'مؤرشف',
      المشاهدات: a.views,
      الإعجابات: a.likes,
      المشاركات: a.shares,
      'تاريخ النشر': formatDateTime(a.published_at),
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المقالات');
    XLSX.writeFile(wb, `articles_export_${new Date().toISOString()}.xlsx`);
    toast.success('تم تصدير المقالات بنجاح');
  };
  
  return (
    <>
      <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
        <div className={`p-4 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-3`}>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold">المقالات</h3>
            <button onClick={() => setShowNewArticle(true)} className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" />
              جديد
            </button>
            {selectedArticles.length > 0 && (
              <button onClick={handleBulkDelete} className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg">
                حذف {selectedArticles.length}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportToExcel} className="p-1.5 hover:bg-zinc-800 rounded" title="تصدير Excel">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="p-1.5 hover:bg-zinc-800 rounded">
              {viewMode === 'list' ? <Layout className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex gap-1">
              {sections.map(section => (
                <button
                  key={section}
                  onClick={() => setFilterSection(section)}
                  className={`px-2 py-1 text-xs rounded ${
                    filterSection === section
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                      : darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {sectionNames[section]}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <div className="divide-y divide-zinc-800">
            {articles.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">لا توجد مقالات</div>
            ) : (
              articles.map((article: Article) => (
                <div key={article.id} className="p-4 hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={e => {
                        if (e.target.checked) setSelectedArticles([...selectedArticles, article.id]);
                        else setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                      }}
                      className="mt-1"
                    />
                    {article.image_url && (
                      <img src={article.image_url} alt="" className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                          article.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {article.status === 'published' ? 'منشور' : article.status === 'scheduled' ? 'مجَدول' : 'مسودة'}
                        </span>
                        <span className="text-xs text-zinc-500">{article.author_name}</span>
                        <span className="text-xs text-zinc-500">{formatDateTime(article.created_at)}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{article.title}</h4>
                      <div className="flex items-center gap-3 mt-3 justify-end">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Eye className="w-3 h-3" /> {article.views}
                          <Heart className="w-3 h-3" /> {article.likes}
                          <Share2 className="w-3 h-3" /> {article.shares}
                          <Clock className="w-3 h-3" /> {article.reading_time} د
                        </div>
                        <button onClick={() => setEditingArticle(article)} className="text-blue-400 hover:text-blue-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        {article.status !== 'published' && article.status !== 'scheduled' && (
                          <button onClick={() => handlePublish(article.id)} className="text-emerald-400 hover:text-emerald-300">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(article.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {articles.map((article: Article) => (
              <div key={article.id} className={`${darkMode ? 'bg-zinc-900' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
                {article.image_url && (
                  <img src={article.image_url} alt="" className="w-full h-40 object-cover" />
                )}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 line-clamp-2">{article.title}</h4>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
                    <span>{article.views} مشاهدة</span>
                    <span>{article.author_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {(editingArticle || showNewArticle) && (
        <ArticleEditorModal
          article={editingArticle}
          onClose={() => { setEditingArticle(null); setShowNewArticle(false); }}
          onSave={onRefresh}
          darkMode={darkMode}
        />
      )}
    </>
  );
}

// ==================== لوحة التحليلات المتقدمة ====================
function AnalyticsDashboard({ analytics, darkMode }: { analytics: AnalyticsData; darkMode: boolean }) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const engagementData = [
    { name: 'إعجابات', value: analytics.user_engagement?.likes || 0 },
    { name: 'مشاركات', value: analytics.user_engagement?.shares || 0 },
    { name: 'تعليقات', value: analytics.user_engagement?.comments || 0 },
  ];
  
  return (
    <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
      <div className={`p-4 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} flex justify-between items-center`}>
        <h3 className="text-sm font-bold">لوحة التحليلات المتقدمة</h3>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === range
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {range === 'day' ? 'يوم' : range === 'week' ? 'أسبوع' : 'شهر'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {/* البطاقات الرئيسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-emerald-500">{analytics.views_today.toLocaleString()}</div>
            <div className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>زيارات اليوم</div>
            <TrendingIcon className="w-3 h-3 mx-auto mt-1 text-emerald-500" />
          </div>
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-emerald-500">{analytics.views_week.toLocaleString()}</div>
            <div className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>زيارات الأسبوع</div>
          </div>
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-emerald-500">{analytics.articles_published}</div>
            <div className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>مقالات منشورة</div>
          </div>
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-emerald-500">{analytics.avg_reading_time}</div>
            <div className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>متوسط وقت القراءة (دق)</div>
          </div>
        </div>
        
        {/* المخططات البيانية */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <h4 className="text-sm font-bold mb-4">الزيارات اليومية</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.daily_visits}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={darkMode ? '#888' : '#666'} />
                <YAxis stroke={darkMode ? '#888' : '#666'} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f1f1f' : '#fff', borderColor: darkMode ? '#333' : '#e5e7eb' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
            <h4 className="text-sm font-bold mb-4">تفاعل المستخدمين</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie data={engagementData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f1f1f' : '#fff' }} />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* أداء المراسلين */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            أداء المراسلين
          </h4>
          <div className="space-y-3">
            {analytics.author_performance?.map((author, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{author.author}</span>
                  <span className="text-xs text-zinc-500">{author.articles} مقال</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-emerald-500">{author.views.toLocaleString()} مشاهدة</span>
                  <div className="w-32 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (author.views / 200000) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== لوحة التعليقات ====================
function CommentsPanel({ comments, darkMode, onRefresh }: { comments: any[]; darkMode: boolean; onRefresh: () => void }) {
  const handleApprove = async (id: string) => {
    await supabase.from('comments').update({ status: 'approved' }).eq('id', id);
    toast.success('تم قبول التعليق');
    onRefresh();
  };
  const handleDelete = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id);
    toast.success('تم حذف التعليق');
    onRefresh();
  };
  return (
    <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
      <div className={`p-4 border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'} flex justify-between items-center`}>
        <h3 className="text-sm font-bold">التعليقات المعلقة ({comments.length})</h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {comments.length === 0 ? (
          <p className="p-8 text-center text-zinc-500">لا توجد تعليقات معلقة</p>
        ) : comments.map((comment: any) => (
          <div key={comment.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <button onClick={() => handleApprove(comment.id)} className="px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20">
                  <Check className="w-3 h-3 inline ml-1" />قبول
                </button>
                <button onClick={() => handleDelete(comment.id)} className="px-3 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20">
                  <Trash2 className="w-3 h-3 inline ml-1" />حذف
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">{comment.author_name}</span>
                <span className="text-xs text-zinc-500 mr-2">{formatDateTime(comment.created_at)}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-300 text-right">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== لوحة الإعدادات (الإعلانات + الصحفيون) ====================
function SettingsPanel({ darkMode }: { darkMode: boolean }) {
  const { ads, addAd, updateAd, deleteAd } = useAds();
  const [activeSection, setActiveSection] = useState<'ads' | 'journalists'>('ads');
  const [journalists, setJournalists] = useState<any[]>([]);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [editingJournalist, setEditingJournalist] = useState<any>(null);
  const [showNewAd, setShowNewAd] = useState(false);
  const [showNewJournalist, setShowNewJournalist] = useState(false);

  // نموذج إعلان جديد
  const [adTitle, setAdTitle] = useState('');
  const [adPosition, setAdPosition] = useState<any>('header_home');
  const [adImage, setAdImage] = useState('');
  const [adLink, setAdLink] = useState('');

  // نموذج صحفي جديد
  const [jName, setJName] = useState('');
  const [jTitle, setJTitle] = useState('');
  const [jBeat, setJBeat] = useState('');
  const [jSection, setJSection] = useState('politics');

  const positionNames: Record<string, string> = {
    header_home: 'أعلى الصفحة الرئيسية',
    sidebar: 'الشريط الجانبي',
    footer: 'أسفل الصفحة',
    in_article: 'داخل المقال',
  };

  useEffect(() => {
    loadJournalists();
  }, []);

  const loadJournalists = async () => {
    const { data } = await supabase.from('authors').select('*').order('name');
    if (data) setJournalists(data);
  };

  const handleSaveAd = () => {
    if (!adTitle || !adImage) { toast.error('أدخل العنوان والصورة'); return; }
    if (editingAd) {
      updateAd(editingAd.id, { title: adTitle, position: adPosition, imageUrl: adImage, linkUrl: adLink });
      toast.success('تم تحديث الإعلان');
      setEditingAd(null);
    } else {
      addAd({ title: adTitle, position: adPosition, imageUrl: adImage, linkUrl: adLink, active: true });
      toast.success('تم إضافة الإعلان');
      setShowNewAd(false);
    }
    setAdTitle(''); setAdImage(''); setAdLink('');
  };

  const handleEditAd = (ad: any) => {
    setEditingAd(ad);
    setAdTitle(ad.title); setAdPosition(ad.position);
    setAdImage(ad.imageUrl); setAdLink(ad.linkUrl);
    setShowNewAd(true);
  };

  const handleSaveJournalist = async () => {
    if (!jName) { toast.error('أدخل اسم الصحفي'); return; }
    const slug = jName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '') + '-' + Date.now();
    if (editingJournalist) {
      await supabase.from('authors').update({ name: jName, title: jTitle, beat: jBeat, section: jSection }).eq('id', editingJournalist.id);
      toast.success('تم تحديث الصحفي');
      setEditingJournalist(null);
    } else {
      await supabase.from('authors').insert({ slug, name: jName, title: jTitle, beat: jBeat, section: jSection, is_active: true });
      toast.success('تم إضافة الصحفي');
      setShowNewJournalist(false);
    }
    setJName(''); setJTitle(''); setJBeat('');
    loadJournalists();
  };

  const handleEditJournalist = (j: any) => {
    setEditingJournalist(j);
    setJName(j.name); setJTitle(j.title || ''); setJBeat(j.beat || ''); setJSection(j.section || 'politics');
    setShowNewJournalist(true);
  };

  const handleDeleteJournalist = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصحفي؟')) return;
    await supabase.from('authors').delete().eq('id', id);
    toast.success('تم حذف الصحفي');
    loadJournalists();
  };

  return (
    <div className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
      {/* التبويبات */}
      <div className={`flex border-b ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
        <button onClick={() => setActiveSection('ads')} className={`px-6 py-3 text-sm font-bold flex items-center gap-2 ${activeSection === 'ads' ? 'border-b-2 border-emerald-500 text-emerald-500' : darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
          <Megaphone className="w-4 h-4" /> إدارة الإعلانات
        </button>
        <button onClick={() => setActiveSection('journalists')} className={`px-6 py-3 text-sm font-bold flex items-center gap-2 ${activeSection === 'journalists' ? 'border-b-2 border-emerald-500 text-emerald-500' : darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
          <Users className="w-4 h-4" /> إدارة الصحفيين
        </button>
      </div>

      <div className="p-6">
        {/* ==================== إدارة الإعلانات ==================== */}
        {activeSection === 'ads' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">الإعلانات ({ads.length})</h3>
              <button onClick={() => { setShowNewAd(!showNewAd); setEditingAd(null); setAdTitle(''); setAdImage(''); setAdLink(''); setAdPosition('header_home'); }} className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-1">
                <Plus className="w-3 h-3" /> إعلان جديد
              </button>
            </div>

            {/* نموذج إضافة/تعديل إعلان */}
            {showNewAd && (
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} space-y-3 mb-4`}>
                <h4 className="text-sm font-bold">{editingAd ? 'تعديل الإعلان' : 'إعلان جديد'}</h4>
                <input value={adTitle} onChange={e => setAdTitle(e.target.value)} placeholder="عنوان الإعلان" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                <select value={adPosition} onChange={e => setAdPosition(e.target.value)} className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`}>
                  {Object.entries(positionNames).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
                <input value={adImage} onChange={e => setAdImage(e.target.value)} placeholder="رابط صورة الإعلان" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                <input value={adLink} onChange={e => setAdLink(e.target.value)} placeholder="رابط الإعلان (اختياري)" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                {adImage && <img src={adImage} alt="" className="w-full h-24 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />}
                <div className="flex gap-2">
                  <button onClick={handleSaveAd} className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    <Save className="w-3 h-3 inline ml-1" />{editingAd ? 'تحديث' : 'حفظ'}
                  </button>
                  <button onClick={() => { setShowNewAd(false); setEditingAd(null); }} className="px-4 py-2 text-xs bg-zinc-700 text-zinc-300 rounded-lg">إلغاء</button>
                </div>
              </div>
            )}

            {/* قائمة الإعلانات */}
            {ads.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">لا توجد إعلانات بعد</p>
            ) : (
              <div className="space-y-3">
                {ads.map(ad => (
                  <div key={ad.id} className={`flex items-center gap-4 p-3 rounded-lg border ${darkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <img src={ad.imageUrl} alt="" className="w-20 h-12 object-cover rounded" onError={e => (e.currentTarget.style.display = 'none')} />
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold">{ad.title}</p>
                      <p className="text-xs text-zinc-500">{positionNames[ad.position]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateAd(ad.id, { active: !ad.active })} className={`p-1.5 rounded ${ad.active ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {ad.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => handleEditAd(ad)} className="p-1.5 text-blue-400 hover:text-blue-300 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { deleteAd(ad.id); toast.success('تم حذف الإعلان'); }} className="p-1.5 text-red-400 hover:text-red-300 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== إدارة الصحفيين ==================== */}
        {activeSection === 'journalists' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">الصحفيون ({journalists.length})</h3>
              <button onClick={() => { setShowNewJournalist(!showNewJournalist); setEditingJournalist(null); setJName(''); setJTitle(''); setJBeat(''); }} className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-1">
                <Plus className="w-3 h-3" /> صحفي جديد
              </button>
            </div>

            {/* نموذج إضافة/تعديل صحفي */}
            {showNewJournalist && (
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} space-y-3 mb-4`}>
                <h4 className="text-sm font-bold">{editingJournalist ? 'تعديل الصحفي' : 'صحفي جديد'}</h4>
                <input value={jName} onChange={e => setJName(e.target.value)} placeholder="الاسم الكامل *" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                <input value={jTitle} onChange={e => setJTitle(e.target.value)} placeholder="اللقب (مثال: مراسل سياسي)" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                <input value={jBeat} onChange={e => setJBeat(e.target.value)} placeholder="التخصص (مثال: السياسة)" className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`} />
                <select value={jSection} onChange={e => setJSection(e.target.value)} className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-white border-gray-200'}`}>
                  <option value="politics">السياسة</option>
                  <option value="economics">الاقتصاد</option>
                  <option value="sports">الرياضة</option>
                  <option value="culture">الثقافة</option>
                  <option value="society">المجتمع</option>
                  <option value="science">العلوم والتقنية</option>
                  <option value="diaspora">مغاربة العالم</option>
                <option value="tribes">القبائل المغربية</option>
                <option value="agriculture">شؤون الفلاح</option>
                <option value="international">أخبار دولية</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleSaveJournalist} className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    <Save className="w-3 h-3 inline ml-1" />{editingJournalist ? 'تحديث' : 'إضافة'}
                  </button>
                  <button onClick={() => { setShowNewJournalist(false); setEditingJournalist(null); }} className="px-4 py-2 text-xs bg-zinc-700 text-zinc-300 rounded-lg">إلغاء</button>
                </div>
              </div>
            )}

            {/* قائمة الصحفيين */}
            {journalists.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">لا يوجد صحفيون بعد</p>
            ) : (
              <div className="space-y-2">
                {journalists.map(j => (
                  <div key={j.id} className={`flex items-center gap-3 p-3 rounded-lg border ${darkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold text-lg flex-shrink-0">
                      {j.name?.[0]}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold">{j.name}</p>
                      <p className="text-xs text-zinc-500">{j.title} — {j.beat}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditJournalist(j)} className="p-1.5 text-blue-400 hover:text-blue-300 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteJournalist(j.id)} className="p-1.5 text-red-400 hover:text-red-300 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}














