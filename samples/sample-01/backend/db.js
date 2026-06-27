const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    key_points TEXT,
    action_items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    doc_refs TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    refreshed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Documents
function insertDocument(title, content, summary, keyPoints, actionItems) {
  const stmt = db.prepare(
    'INSERT INTO documents (title, content, summary, key_points, action_items) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(title, content, summary, keyPoints, actionItems);
  return result.lastInsertRowid;
}

function getAllDocuments() {
  return db.prepare(
    'SELECT id, title, summary, key_points, action_items, created_at FROM documents ORDER BY created_at DESC'
  ).all();
}

function getDocumentById(id) {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
}

function getAllDocumentContents() {
  return db.prepare('SELECT id, title, content FROM documents ORDER BY created_at DESC').all();
}

// Chat logs
function insertChatLog(question, answer, docRefs) {
  const stmt = db.prepare(
    'INSERT INTO chat_logs (question, answer, doc_refs) VALUES (?, ?, ?)'
  );
  const result = stmt.run(question, answer, JSON.stringify(docRefs || []));
  return result.lastInsertRowid;
}

function getRecentChatLogs(limit = 20) {
  return db.prepare(
    'SELECT * FROM chat_logs ORDER BY created_at DESC LIMIT ?'
  ).all(limit);
}

// Metrics
function upsertMetric(key, value) {
  db.prepare(
    'INSERT INTO metrics (key, value, refreshed_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value, refreshed_at=CURRENT_TIMESTAMP'
  ).run(key, String(value));
}

function getAllMetrics() {
  return db.prepare('SELECT * FROM metrics').all();
}

function getDocumentCount() {
  return db.prepare('SELECT COUNT(*) as count FROM documents').get().count;
}

function getChatCount() {
  return db.prepare('SELECT COUNT(*) as count FROM chat_logs').get().count;
}

function getLastRefresh() {
  const row = db.prepare('SELECT refreshed_at FROM metrics ORDER BY refreshed_at DESC LIMIT 1').get();
  return row ? row.refreshed_at : null;
}

module.exports = {
  insertDocument, getAllDocuments, getDocumentById, getAllDocumentContents,
  insertChatLog, getRecentChatLogs,
  upsertMetric, getAllMetrics,
  getDocumentCount, getChatCount, getLastRefresh
};
