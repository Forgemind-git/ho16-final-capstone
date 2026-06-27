require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const claude = require('./claude');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Research ─────────────────────────────────────────────────────────────────

app.post('/api/research', async (req, res) => {
  const { topic, content_type } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    console.log(`Generating research brief for: "${topic}"...`);
    const briefData = await claude.generateBrief(topic);
    const postId = db.insertPost(topic, content_type || 'blog');
    db.updatePostBrief(postId, JSON.stringify(briefData), briefData);
    console.log(`Brief created for post ${postId}`);
    res.json({ id: postId, topic, brief_data: briefData });
  } catch (err) {
    console.error('Research error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Post Drafting ────────────────────────────────────────────────────────────

app.post('/api/posts/:id/draft', async (req, res) => {
  const post = db.getPostById(parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });

  try {
    console.log(`Drafting ${post.content_type} post for: "${post.topic}"...`);
    const content = await claude.draftPost(post.topic, post.brief_data, post.content_type);
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    db.updatePostContent(post.id, content, wordCount);
    console.log(`Draft complete: ${wordCount} words`);
    res.json({ id: post.id, content, word_count: wordCount });
  } catch (err) {
    console.error('Draft error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Repurpose ────────────────────────────────────────────────────────────────

app.post('/api/posts/:id/repurpose', async (req, res) => {
  const post = db.getPostById(parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (!post.content) return res.status(400).json({ error: 'Post has no content yet. Draft it first.' });

  try {
    console.log(`Repurposing post: "${post.topic}"...`);
    const variants = await claude.repurposePost(post.topic, post.content);
    db.updatePostVariants(post.id, variants);
    res.json({ id: post.id, variants });
  } catch (err) {
    console.error('Repurpose error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Posts CRUD ───────────────────────────────────────────────────────────────

app.get('/api/posts', (req, res) => {
  try {
    res.json(db.getAllPosts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.getPostById(parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.patch('/api/posts/:id', (req, res) => {
  const { status } = req.body;
  const valid = ['draft', 'review', 'published'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.updatePostStatus(parseInt(req.params.id), status);
  res.json(db.getPostById(parseInt(req.params.id)));
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

app.get('/api/dashboard', (req, res) => {
  try {
    const stats = db.getDashboardStats();
    const recent = db.getAllPosts().slice(0, 5);
    res.json({ ...stats, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Content Production Engine running at http://localhost:${PORT}`);
});
