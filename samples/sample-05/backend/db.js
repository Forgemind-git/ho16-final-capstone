const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    customer_name TEXT DEFAULT 'Anonymous',
    customer_email TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    triage_reason TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    draft TEXT NOT NULL,
    source_articles TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
  );
`);

// Knowledge base
function insertKBArticle(title, content, category) {
  return db.prepare('INSERT INTO knowledge_base (title, content, category) VALUES (?, ?, ?)').run(title, content, category || 'General').lastInsertRowid;
}

function getAllKBArticles() {
  return db.prepare('SELECT * FROM knowledge_base ORDER BY created_at DESC').all();
}

function getKBContents() {
  return db.prepare('SELECT id, title, content FROM knowledge_base').all();
}

function deleteKBArticle(id) {
  db.prepare('DELETE FROM knowledge_base WHERE id=?').run(id);
}

// Tickets
function insertTicket(subject, body, customerName, customerEmail) {
  return db.prepare(
    'INSERT INTO tickets (subject, body, customer_name, customer_email) VALUES (?, ?, ?, ?)'
  ).run(subject, body, customerName || 'Anonymous', customerEmail || '').lastInsertRowid;
}

function updateTicketTriage(id, category, priority, reason) {
  db.prepare('UPDATE tickets SET category=?, priority=?, triage_reason=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(category, priority, reason, id);
}

function updateTicketStatus(id, status) {
  db.prepare('UPDATE tickets SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status, id);
}

function getAllTickets() {
  return db.prepare('SELECT * FROM tickets ORDER BY updated_at DESC').all();
}

function getTicketById(id) {
  return db.prepare('SELECT * FROM tickets WHERE id=?').get(id);
}

function getOpenTickets() {
  return db.prepare("SELECT * FROM tickets WHERE status='open' ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END").all();
}

// Replies
function insertReply(ticketId, draft, sourceArticles) {
  return db.prepare('INSERT INTO replies (ticket_id, draft, source_articles) VALUES (?, ?, ?)').run(ticketId, draft, JSON.stringify(sourceArticles || [])).lastInsertRowid;
}

function getRepliesForTicket(ticketId) {
  return db.prepare('SELECT * FROM replies WHERE ticket_id=? ORDER BY created_at DESC').all(ticketId).map(r => ({
    ...r, source_articles: JSON.parse(r.source_articles || '[]')
  }));
}

// Dashboard stats
function getCategoryStats() {
  return db.prepare('SELECT category, COUNT(*) as count FROM tickets GROUP BY category ORDER BY count DESC').all();
}

function getPriorityStats() {
  return db.prepare('SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority').all();
}

function getStatusStats() {
  return db.prepare('SELECT status, COUNT(*) as count FROM tickets GROUP BY status').all();
}

function getRecentTickets(limit = 10) {
  return db.prepare('SELECT * FROM tickets ORDER BY created_at DESC LIMIT ?').all(limit);
}

module.exports = {
  insertKBArticle, getAllKBArticles, getKBContents, deleteKBArticle,
  insertTicket, updateTicketTriage, updateTicketStatus, getAllTickets, getTicketById, getOpenTickets,
  insertReply, getRepliesForTicket,
  getCategoryStats, getPriorityStats, getStatusStats, getRecentTickets
};
