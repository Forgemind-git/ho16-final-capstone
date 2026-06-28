const Anthropic = require('@anthropic-ai/sdk');

// The course build runs WITHOUT an API key — "demo mode".
// Only create a real client when a key is present, so importing this file
// never crashes when ANTHROPIC_API_KEY is unset.
const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;
const client = HAS_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const MODEL = 'claude-3-5-haiku-20241022';

const CATEGORIES = ['Billing', 'Technical', 'Account', 'Product', 'Shipping', 'Refund', 'Bug Report', 'Feature Request', 'General'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

/**
 * Triage a support ticket — classify category and assign priority.
 */
async function triageTicket(subject, body) {
  // Demo mode (no API key): return a realistic sample of the same shape.
  if (!HAS_KEY) {
    const text = `${subject} ${body}`.toLowerCase();
    let category = 'General';
    let priority = 'medium';
    if (/refund|charged|charge|invoice|billing|payment/.test(text)) category = 'Billing';
    else if (/error|crash|broken|bug|not working|fails?/.test(text)) category = 'Bug Report';
    else if (/login|password|account|sign ?in/.test(text)) category = 'Account';
    else if (/ship|deliver|tracking|package/.test(text)) category = 'Shipping';
    if (/down|urgent|asap|critical|data loss|security|breach/.test(text)) priority = 'critical';
    else if (/blocked|cannot|can't|broken|urgent/.test(text)) priority = 'high';
    else if (/question|how do i|wondering/.test(text)) priority = 'low';
    return {
      category,
      priority,
      reason: '[demo sample] Classified by keywords — add an API key for real AI triage.'
    };
  }

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
  const articleTitlesEarly = kbArticles.map((a, i) => `${i + 1}. ${a.title}`);

  // Demo mode (no API key): return a realistic sample of the same shape.
  if (!HAS_KEY) {
    const cite = hasKB
      ? `According to our "${kbArticles[0].title}" article, here are the steps to resolve this.`
      : `I'd like to help — could you share a bit more detail so I can point you to the right solution?`;
    const draft = `Hi ${ticket.customer_name || 'there'},

Thanks for reaching out about "${ticket.subject}". I'm sorry for the trouble this has caused.

${cite}

[This is a sample reply generated in demo mode. Add an ANTHROPIC_API_KEY to have Claude write a real, knowledge-base-grounded response.]

Please let me know if there's anything else I can help with.

Best regards,
Support Team`;
    return { draft, source_articles: articleTitlesEarly };
  }

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

  // Demo mode (no API key): return a realistic sample string (same shape: a string).
  if (!HAS_KEY) {
    const topCat = categoryStats && categoryStats.length
      ? categoryStats.slice().sort((a, b) => b.count - a.count)[0].category
      : 'General';
    return `[Demo sample] You have ${totalTickets} tickets, with "${topCat}" being the most common category. Volume looks steady across priority levels. Recommendation: review your "${topCat}" knowledge base articles so replies can be drafted faster. (Add an API key for a real AI-generated summary.)`;
  }

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
