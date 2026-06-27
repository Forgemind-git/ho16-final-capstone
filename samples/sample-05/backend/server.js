require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const claude = require('./claude');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Knowledge Base ───────────────────────────────────────────────────────────

app.post('/api/kb', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });
  try {
    const id = db.insertKBArticle(title, content, category);
    console.log(`KB article ${id} added: "${title}"`);
    res.json({ id, title, content, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kb', (req, res) => {
  try {
    res.json(db.getAllKBArticles());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/kb/:id', (req, res) => {
  db.deleteKBArticle(parseInt(req.params.id));
  res.json({ success: true });
});

// ─── Tickets ──────────────────────────────────────────────────────────────────

// Create ticket + auto-triage
app.post('/api/tickets', async (req, res) => {
  const { subject, body, customer_name, customer_email } = req.body;
  if (!subject || !body) return res.status(400).json({ error: 'subject and body are required' });

  try {
    const ticketId = db.insertTicket(subject, body, customer_name, customer_email);
    console.log(`Triaging ticket ${ticketId}: "${subject}"...`);

    const triage = await claude.triageTicket(subject, body);
    db.updateTicketTriage(ticketId, triage.category, triage.priority, triage.reason);

    const ticket = db.getTicketById(ticketId);
    console.log(`Ticket ${ticketId} triaged: ${triage.category}/${triage.priority}`);
    res.json(ticket);
  } catch (err) {
    console.error('Ticket create error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tickets', (req, res) => {
  try {
    const status = req.query.status;
    const tickets = status === 'open' ? db.getOpenTickets() : db.getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = db.getTicketById(parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  const replies = db.getRepliesForTicket(ticket.id);
  res.json({ ...ticket, replies });
});

app.patch('/api/tickets/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  db.updateTicketStatus(parseInt(req.params.id), status);
  res.json(db.getTicketById(parseInt(req.params.id)));
});

// Draft reply using KB
app.post('/api/tickets/:id/reply', async (req, res) => {
  const ticket = db.getTicketById(parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  try {
    console.log(`Drafting reply for ticket ${ticket.id}: "${ticket.subject}"...`);
    const kbArticles = db.getKBContents();
    const { draft, source_articles } = await claude.draftReply(ticket, kbArticles);
    const replyId = db.insertReply(ticket.id, draft, source_articles);
    db.updateTicketStatus(ticket.id, 'in_progress');
    res.json({ id: replyId, ticket_id: ticket.id, draft, source_articles });
  } catch (err) {
    console.error('Reply error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

app.get('/api/dashboard', async (req, res) => {
  try {
    const categoryStats = db.getCategoryStats();
    const priorityStats = db.getPriorityStats();
    const statusStats = db.getStatusStats();
    const recent = db.getRecentTickets(8);
    const total = db.getAllTickets().length;

    let summary = null;
    if (total > 0) {
      summary = await claude.trendSummary(categoryStats, priorityStats, total);
    }

    res.json({ category_stats: categoryStats, priority_stats: priorityStats, status_stats: statusStats, recent, total, summary });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Customer Support Co-Pilot running at http://localhost:${PORT}`);
});
