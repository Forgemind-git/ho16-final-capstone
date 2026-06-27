const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-3-5-haiku-20241022';

const CATEGORIES = [
  'Food & Dining', 'Groceries', 'Transport', 'Entertainment', 'Shopping',
  'Utilities & Bills', 'Healthcare', 'Education', 'Travel', 'Subscriptions',
  'Housing & Rent', 'Insurance', 'ATM & Cash', 'Transfers', 'Other'
];

/**
 * Batch-categorise a list of transactions using a single Claude call.
 * Returns an array of { id, category } objects.
 */
async function categoriseTransactions(transactions) {
  if (transactions.length === 0) return [];

  // Process in batches of 50 to stay within token limits
  const BATCH_SIZE = 50;
  const results = [];

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);
    console.log(`  Categorising batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(transactions.length / BATCH_SIZE)}...`);

    const txList = batch.map((t, idx) =>
      `${idx}: ${t.date} | ${t.description} | ${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}`
    ).join('\n');

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Categorise each bank transaction into exactly one of these categories:
${CATEGORIES.join(', ')}

Transactions (index | date | description | amount):
${txList}

Rules:
- Negative amounts are expenses, positive are income
- Income transactions (positive) should be categorised as "Transfers" or the most relevant category
- Use your knowledge of common merchant names
- Be consistent (all STARBUCKS = Food & Dining)

Respond with ONLY a JSON array of {"index": N, "category": "Category Name"} objects.`
        }
      ]
    });

    try {
      const text = response.content[0].text.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.forEach(item => {
        const tx = batch[item.index];
        if (tx) results.push({ id: tx.id, category: item.category });
      });
    } catch (err) {
      console.error('Batch parse error:', err.message);
      // Fallback: assign "Other" to all in batch
      batch.forEach(tx => results.push({ id: tx.id, category: 'Other' }));
    }
  }

  return results;
}

/**
 * Answer a spending question using transaction data as context.
 */
async function answerSpendingQuestion(question, categoryTotals, recentTransactions) {
  const categoryContext = categoryTotals.map(c =>
    `${c.category}: $${c.total.toFixed(2)} (${c.count} transactions)`
  ).join('\n');

  const recentContext = recentTransactions.slice(0, 30).map(t =>
    `${t.date} | ${t.description} | ${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)} | ${t.category}`
  ).join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: `You are a personal finance advisor. Answer questions about the user's spending data clearly and helpfully.
Always reference specific numbers from the data. Format currency as $X.XX.
If the data doesn't contain enough information to answer, say so.`,
    messages: [
      {
        role: 'user',
        content: `My spending summary by category:
${categoryContext}

Recent transactions:
${recentContext}

My question: ${question}`
      }
    ]
  });

  return response.content[0].text;
}

/**
 * Generate a one-paragraph spending insight.
 */
async function generateInsight(categoryTotals, totalExpenses, totalIncome) {
  if (categoryTotals.length === 0) return 'No transaction data available yet.';

  const top3 = categoryTotals.slice(0, 3);
  const context = top3.map(c => `${c.category}: $${c.total.toFixed(2)} (${((c.total / totalExpenses) * 100).toFixed(0)}%)`).join(', ');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Give me a 2-sentence financial insight based on this spending data.
Total income: $${totalIncome.toFixed(2)}, Total expenses: $${totalExpenses.toFixed(2)}
Top spending categories: ${context}
Be specific, constructive, and include one actionable tip.`
      }
    ]
  });

  return response.content[0].text;
}

module.exports = { categoriseTransactions, answerSpendingQuestion, generateInsight };
