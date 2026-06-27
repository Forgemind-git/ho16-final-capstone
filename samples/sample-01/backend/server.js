require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const claude = require('./claude');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Documents ────────────────────────────────────────────────────────────────

// Upload and summarise a document
app.post('/api/docs/upload', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  try {
    console.log(`Summarising document: "${title}"...`);
    const result = await claude.summariseDocument(title, content);
    const id = db.insertDocument(
      title,
      content,
      result.summary,
      JSON.stringify(result.key_points),
      JSON.stringify(result.action_items)
    );
    db.upsertMetric('last_upload', new Date().toISOString());
    console.log(`Document ${id} saved.`);
    res.json({ id, ...result });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// List all documents
app.get('/api/docs', (req, res) => {
  try {
    const docs = db.getAllDocuments().map(d => ({
      ...d,
      key_points: JSON.parse(d.key_points || '[]'),
      action_items: JSON.parse(d.action_items || '[]')
    }));
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Chat / Q&A ───────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'question is required' });
  try {
    const docs = db.getAllDocumentContents();
    console.log(`Answering: "${question}" using ${docs.length} documents...`);
    const { answer, doc_refs } = await claude.groundedAnswer(question, docs);
    db.insertChatLog(question, answer, doc_refs);
    res.json({ answer, doc_refs });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chat/history', (req, res) => {
  try {
    res.json(db.getRecentChatLogs(20));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

app.get('/api/metrics', async (req, res) => {
  try {
    const docCount = db.getDocumentCount();
    const chatCount = db.getChatCount();
    const lastRefresh = db.getLastRefresh();
    const recentDocs = db.getAllDocuments().slice(0, 5).map(d => ({
      id: d.id, title: d.title, created_at: d.created_at
    }));

    res.json({
      doc_count: docCount,
      chat_count: chatCount,
      last_refresh: lastRefresh,
      recent_docs: recentDocs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Refresh (Automation) ─────────────────────────────────────────────────────

// In production, call this endpoint from a cron job: 0 * * * * curl -X POST http://localhost:3001/api/refresh
app.post('/api/refresh', async (req, res) => {
  try {
    console.log('Running scheduled data refresh...');
    const docs = db.getAllDocuments();

    // Simulate fetching fresh external data (in production: call APIs, scrape feeds, etc.)
    db.upsertMetric('doc_count', docs.length);
    db.upsertMetric('last_refresh', new Date().toISOString());
    db.upsertMetric('refresh_count', (parseInt(db.getAllMetrics().find(m => m.key === 'refresh_count')?.value || '0') + 1).toString());

    // Generate digest if there are documents
    let digest = null;
    if (docs.length > 0) {
      digest = await claude.generateDigest(docs);
      db.upsertMetric('latest_digest', digest);
    }

    console.log('Refresh complete.');
    res.json({ success: true, refreshed_at: new Date().toISOString(), doc_count: docs.length, digest });
  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get latest digest
app.get('/api/digest', (req, res) => {
  try {
    const metrics = db.getAllMetrics();
    const digest = metrics.find(m => m.key === 'latest_digest');
    res.json({ digest: digest ? digest.value : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Ops Command Center running at http://localhost:${PORT}`);
});
