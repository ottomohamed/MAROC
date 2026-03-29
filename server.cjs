const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// بيانات مؤقتة للقراءة (GET)
const mockArticles = [
  {
    id: 1,
    title: "المغرب يسجل نموًا اقتصاديًا ملحوظًا",
    subtitle: "ارتفاع الناتج المحلي الإجمالي بنسبة 3.8%",
    slug: "morocco-economic-growth",
    section: "economics",
    body: "أعلنت المندوبية السامية للتخطيط عن تحقيق الاقتصاد المغربي نموًا بنسبة 3.8%...",
    featured: true,
    publishedAt: new Date().toISOString(),
    author: { id: 1, name: "أحمد العلوي", slug: "ahmed-alaoui" }
  },
  {
    id: 2,
    title: "المنتخب الوطني يستعد لمواجهة حاسمة",
    subtitle: "التشكيلة النهائية تعلن غدًا",
    slug: "national-team-preparation",
    section: "sports",
    body: "يواصل المنتخب الوطني تدريباته استعدادًا للمواجهة المرتقبة...",
    featured: false,
    publishedAt: new Date().toISOString(),
    author: { id: 2, name: "سعيد بنجليون", slug: "said-benjelloun" }
  }
];

const mockAuthors = [
  { id: 1, name: "أحمد العلوي", slug: "ahmed-alaoui", title: "رئيس التحرير" },
  { id: 2, name: "سعيد بنجليون", slug: "said-benjelloun", title: "مراسل رياضي" }
];

// ================ GET Routes (للقراءة) ================
app.get('/api/MAGHREB24/articles', (req, res) => {
  res.json({ articles: mockArticles, total: mockArticles.length });
});

app.get('/api/MAGHREB24/articles/:slug', (req, res) => {
  const article = mockArticles.find(a => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

app.get('/api/MAGHREB24/authors', (req, res) => {
  res.json({ authors: mockAuthors });
});

app.get('/api/MAGHREB24/authors/:slug', (req, res) => {
  const author = mockAuthors.find(a => a.slug === req.params.slug);
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author);
});

// ================ POST Route (لإضافة مقالات جديدة إلى Supabase) ================
app.post('/api/MAGHREB24/articles', async (req, res) => {
  try {
    const payload = req.body;
    const sbUrl = process.env.SUPABASE_URL;
    const sbKey = process.env.SUPABASE_ANON_KEY;

    if (!sbUrl || !sbKey) {
      console.error('❌ Supabase credentials missing in .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('📝 إرسال إلى Supabase:', payload);

    const response = await fetch(`${sbUrl}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': sbKey,
        'Authorization': `Bearer ${sbKey}`,
        'Prefer': 'return=representation' // لإرجاع السجل المنشأ
      },
      body: JSON.stringify(payload)
    });

    const data = await response.text();

    if (!response.ok) {
      console.error('❌ Supabase responded with:', response.status, data);
      return res.status(response.status).json({ 
        error: 'Supabase error', 
        status: response.status,
        details: data 
      });
    }

    console.log('✅ تم إضافة المقال بنجاح');
    return res.status(200).send(data);
    
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`);
  console.log(`📰 Available endpoints:`);
  console.log(`   GET  /api/MAGHREB24/articles`);
  console.log(`   GET  /api/MAGHREB24/articles/:slug`);
  console.log(`   GET  /api/MAGHREB24/authors`);
  console.log(`   GET  /api/MAGHREB24/authors/:slug`);
  console.log(`   POST /api/MAGHREB24/articles (يرسل إلى Supabase)`);
});