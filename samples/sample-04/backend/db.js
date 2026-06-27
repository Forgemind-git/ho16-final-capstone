const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT DEFAULT 'Uncategorised',
    is_income INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function insertTransactions(rows) {
  const stmt = db.prepare(
    'INSERT INTO transactions (date, description, amount, category, is_income) VALUES (?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction((rows) => {
    for (const row of rows) stmt.run(row.date, row.description, row.amount, row.category || 'Uncategorised', row.amount > 0 ? 1 : 0);
  });
  insertMany(rows);
}

function updateCategory(id, category) {
  db.prepare('UPDATE transactions SET category=? WHERE id=?').run(category, id);
}

function getAllTransactions() {
  return db.prepare('SELECT * FROM transactions ORDER BY date DESC').all();
}

function getExpenseTransactions() {
  return db.prepare('SELECT * FROM transactions WHERE is_income=0 ORDER BY date DESC').all();
}

function getCategoryTotals() {
  return db.prepare(`
    SELECT category, SUM(ABS(amount)) as total, COUNT(*) as count
    FROM transactions WHERE is_income=0
    GROUP BY category ORDER BY total DESC
  `).all();
}

function getTopMerchants(limit = 5) {
  return db.prepare(`
    SELECT description, SUM(ABS(amount)) as total, COUNT(*) as count
    FROM transactions WHERE is_income=0
    GROUP BY description ORDER BY total DESC LIMIT ?
  `).all(limit);
}

function getTotalExpenses() {
  const row = db.prepare('SELECT SUM(ABS(amount)) as total FROM transactions WHERE is_income=0').get();
  return row.total || 0;
}

function getTotalIncome() {
  const row = db.prepare('SELECT SUM(amount) as total FROM transactions WHERE is_income=1').get();
  return row.total || 0;
}

function getTransactionCount() {
  return db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
}

function insertChatLog(question, answer) {
  db.prepare('INSERT INTO chat_logs (question, answer) VALUES (?, ?)').run(question, answer);
}

function clearTransactions() {
  db.prepare('DELETE FROM transactions').run();
}

module.exports = {
  insertTransactions, updateCategory, getAllTransactions, getExpenseTransactions,
  getCategoryTotals, getTopMerchants, getTotalExpenses, getTotalIncome, getTransactionCount,
  insertChatLog, clearTransactions
};
