const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-3-5-haiku-20241022';

const CATEGORIES = ['Billing', 'Technical', 'Account', 'Product', 'Shipping', 'Refund', 'Bug Report', 'Feature Request', 'General'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

/**
 * Triage a support ticket — classify category and assign priority.
 */
async function triageTicket(subject, body) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a customer support manager. Triage this support ticket.

Subject: ${subject}
Body: ${body}

Available categories: ${CATEGORIES.join(', ')}
Priority levels: low (general question), medium (normal issue), high (blocking issue), critical (production down / data loss / security)

Respond in this exact JSON format:
{
  "category": "one of the available categories",
  "priority": "low|medium|high|critical",
  "reason": "one sentence explaining your classification"
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);
    // Validate
    if (!CATEGORIES.includes(parsed.category)) parsed.category = 'General';
    if (!PRIORITIES.includes(parsed.priority)) parsed.priority = 'medium';
    return parsed;
  } catch {
    return { category: 'General', priority: 'medium', reason: 'Auto-triage failed; defaulting to General/Medium.' };
  }
}

/**
 * Draft a support reply grounded in the knowledge base.
 */
async function draftReply(ticket, kbArticles) {
  const hasKB = kbArticles.length > 0;

  const kbContext = hasKB
    ? kbArticles.map((a, i) => `[Article ${i + 1}: ${a.title}]\n${a.content.slice(0, 2000)}`).join('\n\n---\n\n')
    : 'No knowledge base articles available.';

  const articleTitles = kbArticles.map((a, i) => `${i + 1}. ${a.title}`);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are a helpful and empathetic customer support agent. 
When writing replies:
- Start with acknowledging the customer's issue
- Use knowledge base articles as your source of truth
- Cite which article helped you (e.g. "According to our [Article Name]...")
- Be concise and solution-focused
- End with an offer to help further
- Never make up information not in the knowledge base`,
    messages: [
      {
        role: 'user',
        content: `Draft a reply to this support ticket.

Customer: ${ticket.customer_name}
Subject: ${ticket.subject}
Issue: ${ticket.body}
Category: ${ticket.category}
Priority: ${ticket.priority}

${hasKB ? `Knowledge base articles available:\n${articleTitles.join('\n')}\n\nFull article contents:\n---\n${kbContext}` : 'No knowledge base articles available. Write a helpful generic response and ask for more details.'}

Write the complete reply email now:`
      }
    ]
  });

  return {
    draft: response.content[0].text,
    source_articles: articleTitles
  };
}

/**
 * Summarise recent ticket trends for a manager.
 */
async function trendSummary(categoryStats, priorityStats, totalTickets) {
  if (totalTickets === 0) return 'No tickets yet.';

  const catContext = categoryStats.map(c => `${c.category}: ${c.count} tickets`).join(', ');
  const priContext = priorityStats.map(p => `${p.priority}: ${p.count}`).join(', ');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are a customer success manager. Summarise these support ticket trends in 2-3 sentences with one actionable recommendation.

Total tickets: ${totalTickets}
By category: ${catContext}
By priority: ${priContext}`
      }
    ]
  });

  return response.content[0].text;
}

module.exports = { triageTicket, draftReply, trendSummary };
