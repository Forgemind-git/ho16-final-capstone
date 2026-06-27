require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const claude = require('./claude');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const STAGES = ['prospect', 'qualified', 'proposal', 'closed_won', 'closed_lost'];

// ─── Lead Enrichment ──────────────────────────────────────────────────────────

app.post('/api/leads/enrich', async (req, res) => {
  const { company, contact_name, contact_email } = req.body;
  if (!company) return res.status(400).json({ error: 'company name is required' });

  try {
    console.log(`Enriching lead: "${company}"...`);
    const leadId = db.insertLead(company, contact_name, contact_email);
    const enrichment = await claude.enrichCompany(company, contact_name, contact_email);
    db.updateLeadEnrichment(leadId, enrichment);
    db.logAction(leadId, 'enriched', `Lead enriched with Claude. Score: ${enrichment.lead_score}/10`);

    const lead = db.getLeadById(leadId);
    console.log(`Lead ${leadId} enriched. Score: ${enrichment.lead_score}/10`);
    res.json(lead);
  } catch (err) {
    console.error('Enrich error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Draft personalised outreach email
app.post('/api/leads/:id/email', async (req, res) => {
  const lead = db.getLeadById(parseInt(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  try {
    console.log(`Drafting email for: "${lead.company}"...`);
    const { subject, body } = await claude.draftEmail(lead);
    const emailId = db.insertEmail(lead.id, subject, body);
    db.logAction(lead.id, 'email_drafted', `Email drafted: "${subject}"`);
    res.json({ id: emailId, lead_id: lead.id, subject, body });
  } catch (err) {
    console.error('Email draft error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Lead CRUD ────────────────────────────────────────────────────────────────

app.get('/api/leads', (req, res) => {
  try {
    res.json(db.getAllLeads());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leads/:id', (req, res) => {
  const lead = db.getLeadById(parseInt(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Not found' });
  const emails = db.getEmailsForLead(lead.id);
  const log = db.getLogForLead(lead.id);
  res.json({ ...lead, emails, log });
});

app.patch('/api/leads/:id', (req, res) => {
  const { stage } = req.body;
  if (!STAGES.includes(stage)) return res.status(400).json({ error: 'Invalid stage' });
  const id = parseInt(req.params.id);
  db.updateLeadStage(id, stage);
  db.logAction(id, 'stage_changed', `Moved to ${stage}`);
  res.json(db.getLeadById(id));
});

// ─── Pipeline ─────────────────────────────────────────────────────────────────

app.get('/api/pipeline', (req, res) => {
  try {
    const summary = db.getPipelineSummary();
    const leads = db.getAllLeads();
    const byStage = {};
    STAGES.forEach(s => { byStage[s] = []; });
    leads.forEach(l => {
      if (byStage[l.stage]) byStage[l.stage].push(l);
    });
    res.json({ summary, by_stage: byStage, total: leads.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Sales Intelligence Platform running at http://localhost:${PORT}`);
});
