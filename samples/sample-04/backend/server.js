require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const db = require('./db');
const claude = require('./claude');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ─── CSV Upload + Categorisation ──────────────────────────────────────────────

app.post('/api/statements/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const content = req.file.buffer.toString('utf8');
    console.log('Parsing CSV...');

    let records;
    try {
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (parseErr) {
      return res.status(400).json({ error: 'Invalid CSV format. Expected columns: date, description, amount' });
    }

    if (records.length === 0) return res.status(400).json({ error: 'CSV is empty' });

    // Normalise columns (flexible column names)
    const txs = records.map((row, idx) => {
      const keys = Object.keys(row).map(k => k.toLowerCase().trim());
      const dateKey = keys.find(k => k.includes('date'));
      const descKey = keys.find(k => k.includes('desc') || k.includes('name') || k.includes('merchant') || k.includes('narr'));
      const amtKey = keys.find(k => k.includes('amount') || k.includes('amt') || k.includes('value'));

      const getVal = (k) => row[Object.keys(row).find(ok => ok.toLowerCase().trim() === k)] || '';

      const amount = parseFloat(getVal(amtKey).replace(/[^-\d.]/g, ''));
      return {
        id: idx, // temp ID for Claude batch
        date: getVal(dateKey) || new Date().toISOString().slice(0, 10),
        description: getVal(descKey) || 'Unknown',
        amount: isNaN(amount) ? 0 : amount
      };
    }).filter(t => t.description !== 'Unknown' || t.amount !== 0);

    console.log(`Parsed ${txs.length} transactions. Categorising with Claude...`);

    // Clear old transactions and insert new ones with placeholder category
    db.clearTransactions();
    db.insertTransactions(txs.map(t => ({ ...t, category: 'Uncategorised' })));

    // Get the newly inserted rows (with real DB IDs)
    const dbTxs = db.getAllTransactions();

    // Map temp index → real DB row for categorisation
    const toClassify = dbTxs.map((t, i) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: t.amount
    }));

    const categorised = await claude.categoriseTransactions(toClassify);

    // Update categories in DB
    const updateMany = db.getAllTransactions().length > 0;
    if (updateMany) {
      categorised.forEach(c => db.updateCategory(c.id, c.category));
    }

    const finalTxs = db.getAllTransactions();
    console.log(`Done. ${finalTxs.length} transactions categorised.`);
    res.json({ count: finalTxs.length, transactions: finalTxs.slice(0, 20) });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Transactions ─────────────────────────────────────────────────────────────

app.get('/api/transactions', (req, res) => {
  try {
    res.json(db.getAllTransactions());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Insights / Dashboard ─────────────────────────────────────────────────────

app.get('/api/insights', async (req, res) => {
  try {
    const categoryTotals = db.getCategoryTotals();
    const topMerchants = db.getTopMerchants(5);
    const totalExpenses = db.getTotalExpenses();
    const totalIncome = db.getTotalIncome();
    const txCount = db.getTransactionCount();

    let insight = null;
    if (categoryTotals.length > 0) {
      insight = await claude.generateInsight(categoryTotals, totalExpenses, totalIncome);
    }

    res.json({ category_totals: categoryTotals, top_merchants: topMerchants, total_expenses: totalExpenses, total_income: totalIncome, tx_count: txCount, insight });
  } catch (err) {
    console.error('Insights error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Chat / Grounded Q&A ──────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'question is required' });

  try {
    const categoryTotals = db.getCategoryTotals();
    const recentTxs = db.getAllTransactions();

    if (recentTxs.length === 0) {
      return res.json({ answer: 'No transaction data found. Please upload a bank statement CSV first.' });
    }

    console.log(`Answering: "${question}"...`);
    const answer = await claude.answerSpendingQuestion(question, categoryTotals, recentTxs);
    db.insertChatLog(question, answer);
    res.json({ answer });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Personal Finance Copilot running at http://localhost:${PORT}`);
});
