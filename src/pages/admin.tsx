import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { supabase } from '../lib/supabase';
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo,
  Image as ImageIcon, Link as LinkIcon, Save, Eye, EyeOff
} from 'lucide-react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: '<p>ابدأ كتابة مقالك هنا...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
        dir: 'rtl',
      },
    },
  });

  const addImage = () => {
    const url = window.prompt('أدخل رابط الصورة:');
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt('أدخل الرابط:');
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleSave = async () => {
    if (!title.trim()) { setMessage({ type: 'error', text: 'يرجى إدخال عنوان المقال' }); return; }
    if (!editor?.getText().trim()) { setMessage({ type: 'error', text: 'يرجى كتابة محتوى المقال' }); return; }

    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from('articles').insert({
      title: title.trim(),
      content: editor.getHTML(),
      author: author.trim() || 'مجهول',
      status,
      created_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: `خطأ: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: '✅ تم حفظ المقال بنجاح!' });
      setTitle('');
      setAuthor('');
      editor.commands.clearContent();
    }
  };

  const ToolbarButton = ({
    onClick, active = false, title, children
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-emerald-600 text-white'
          : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">✍️ إضافة مقال جديد</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
            >
              {preview ? <EyeOff size={16} /> : <Eye size={16} />}
              {preview ? 'تعديل' : 'معاينة'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'جاري الحفظ...' : 'حفظ المقال'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">

          {/* Fields */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان المقال *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="أدخل عنوان المقال..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                dir="rtl"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الكاتب</label>
                <input
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="اسم الكاتب..."
                  className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  dir="rtl"
                />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          {!preview && (
            <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="عنوان 1"><Heading1 size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="عنوان 2"><Heading2 size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="عنوان 3"><Heading3 size={18} /></ToolbarButton>
              <div className="w-px bg-gray-200 dark:bg-slate-600 mx-1" />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="خط عريض"><Bold size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="خط مائل"><Italic size={18} /></ToolbarButton>
              <div className="w-px bg-gray-200 dark:bg-slate-600 mx-1" />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="قائمة نقطية"><List size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="قائمة مرقمة"><ListOrdered size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="اقتباس"><Quote size={18} /></ToolbarButton>
              <div className="w-px bg-gray-200 dark:bg-slate-600 mx-1" />
              <ToolbarButton onClick={addImage} title="إضافة صورة"><ImageIcon size={18} /></ToolbarButton>
              <ToolbarButton onClick={addLink} active={editor?.isActive('link')} title="إضافة رابط"><LinkIcon size={18} /></ToolbarButton>
              <div className="w-px bg-gray-200 dark:bg-slate-600 mx-1" />
              <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="تراجع"><Undo size={18} /></ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="إعادة"><Redo size={18} /></ToolbarButton>
            </div>
          )}

          {/* Editor / Preview */}
          {preview ? (
            <div
              className="prose prose-lg max-w-none p-6 min-h-[400px] text-gray-900 dark:text-white"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
            />
          ) : (
            <EditorContent editor={editor} className="text-gray-900 dark:text-white" />
          )}
        </div>
      </div>
    </div>
  );
}
