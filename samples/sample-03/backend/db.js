const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    brief TEXT DEFAULT '',
    brief_data TEXT DEFAULT '{}',
    content TEXT DEFAULT '',
    content_type TEXT DEFAULT 'blog',
    status TEXT DEFAULT 'draft',
    variants TEXT DEFAULT '{}',
    word_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function insertPost(topic, contentType) {
  return db.prepare('INSERT INTO posts (topic, content_type) VALUES (?, ?)').run(topic, contentType || 'blog').lastInsertRowid;
}

function updatePostBrief(id, brief, briefData) {
  db.prepare('UPDATE posts SET brief=?, brief_data=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(brief, JSON.stringify(briefData), id);
}

function updatePostContent(id, content, wordCount) {
  db.prepare('UPDATE posts SET content=?, word_count=?, status=\'draft\', updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(content, wordCount || 0, id);
}

function updatePostVariants(id, variants) {
  db.prepare('UPDATE posts SET variants=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(JSON.stringify(variants), id);
}

function updatePostStatus(id, status) {
  db.prepare('UPDATE posts SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status, id);
}

function getAllPosts() {
  return db.prepare('SELECT * FROM posts ORDER BY updated_at DESC').all().map(parsePost);
}

function getPostById(id) {
  const row = db.prepare('SELECT * FROM posts WHERE id=?').get(id);
  return row ? parsePost(row) : null;
}

function parsePost(row) {
  return {
    ...row,
    brief_data: JSON.parse(row.brief_data || '{}'),
    variants: JSON.parse(row.variants || '{}')
  };
}

function getDashboardStats() {
  const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM posts GROUP BY status').all();
  const total = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  const totalWords = db.prepare('SELECT SUM(word_count) as total FROM posts').get().total || 0;
  return { by_status: byStatus, total, total_words: totalWords };
}

module.exports = {
  insertPost, updatePostBrief, updatePostContent, updatePostVariants,
  updatePostStatus, getAllPosts, getPostById, getDashboardStats
};
