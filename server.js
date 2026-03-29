import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   AGENTS
========================= */
app.post('/api/MAGHREB24/agents', (req, res) => {
  const { prompt } = req.body || {};

  res.json({
    id: Date.now().toString(),
    content: `تم التوليد بناءً على: "${prompt || 'طلب عام'}"`,
    model: 'local-agent',
    created: new Date().toISOString()
  });
});

/* =========================
   NEWSROOM
========================= */
app.get('/api/MAGHREB24/newsroom', (req, res) => {
  res.json({ newsroom: [] });
});

/* =========================
   DISCUSS
========================= */
app.post('/api/MAGHREB24/newsroom/discuss', (req, res) => {
  const { message } = req.body || {};

  res.json({
    reply: `تم استقبال الرسالة: "${message || ''}"`
  });
});

/* ========================= */
app.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});