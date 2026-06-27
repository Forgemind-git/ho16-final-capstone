const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    contact_name TEXT DEFAULT '',
    contact_email TEXT DEFAULT '',
    stage TEXT DEFAULT 'prospect',
    industry TEXT DEFAULT '',
    company_size TEXT DEFAULT '',
    pain_points TEXT DEFAULT '[]',
    value_props TEXT DEFAULT '[]',
    lead_score INTEGER DEFAULT 0,
    enrichment_notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS crm_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );
`);

// Leads
function insertLead(company, contactName, contactEmail) {
  const stmt = db.prepare(
    'INSERT INTO leads (company, contact_name, contact_email) VALUES (?, ?, ?)'
  );
  return stmt.run(company, contactName || '', contactEmail || '').lastInsertRowid;
}

function updateLeadEnrichment(id, data) {
  db.prepare(`UPDATE leads SET
    industry=?, company_size=?, pain_points=?, value_props=?, lead_score=?, enrichment_notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?`).run(
    data.industry, data.company_size,
    JSON.stringify(data.pain_points || []),
    JSON.stringify(data.value_props || []),
    data.lead_score || 0,
    data.enrichment_notes || '',
    id
  );
}

function updateLeadStage(id, stage) {
  db.prepare('UPDATE leads SET stage=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(stage, id);
}

function getAllLeads() {
  return db.prepare('SELECT * FROM leads ORDER BY updated_at DESC').all().map(parseLead);
}

function getLeadById(id) {
  const row = db.prepare('SELECT * FROM leads WHERE id=?').get(id);
  return row ? parseLead(row) : null;
}

function parseLead(row) {
  return {
    ...row,
    pain_points: JSON.parse(row.pain_points || '[]'),
    value_props: JSON.parse(row.value_props || '[]')
  };
}

// Pipeline summary
function getPipelineSummary() {
  return db.prepare(`
    SELECT stage, COUNT(*) as count FROM leads GROUP BY stage
  `).all();
}

// Emails
function insertEmail(leadId, subject, body) {
  return db.prepare('INSERT INTO emails (lead_id, subject, body) VALUES (?, ?, ?)').run(leadId, subject, body).lastInsertRowid;
}

function getEmailsForLead(leadId) {
  return db.prepare('SELECT * FROM emails WHERE lead_id=? ORDER BY created_at DESC').all(leadId);
}

// CRM Log
function logAction(leadId, action, note) {
  db.prepare('INSERT INTO crm_log (lead_id, action, note) VALUES (?, ?, ?)').run(leadId, action, note || '');
}

function getLogForLead(leadId) {
  return db.prepare('SELECT * FROM crm_log WHERE lead_id=? ORDER BY created_at DESC').all(leadId);
}

module.exports = {
  insertLead, updateLeadEnrichment, updateLeadStage, getAllLeads, getLeadById,
  getPipelineSummary,
  insertEmail, getEmailsForLead,
  logAction, getLogForLead
};
