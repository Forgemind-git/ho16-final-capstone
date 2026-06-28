const Anthropic = require('@anthropic-ai/sdk');

// The course build runs on the Claude.ai subscription path and needs NO API key.
// Without a key the module still loads and every function returns a realistic
// sample response of the same shape, so the app works end-to-end in demo mode.
const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;
const client = HAS_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Summarise an operations document, extracting key points and action items.
 */
async function summariseDocument(title, content) {
  if (!HAS_KEY) {
    // Demo mode — no API key. Same shape as the real response.
    const preview = (content || '').trim().slice(0, 120);
    return {
      summary: `Sample summary of "${title}": this document covers the key operational details${preview ? ` (starting "${preview}…")` : ''}. (demo mode — add an API key for live Claude responses)`,
      key_points: [
        'Main topic and current status identified',
        'Owners and stakeholders noted',
        'Relevant dates and deadlines flagged',
        'Risks or blockers highlighted'
      ],
      action_items: [
        'Review the document with the responsible owner',
        'Confirm any deadlines mentioned',
        'Follow up on open questions'
      ]
    };
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are an operations analyst. Analyse the following document titled "${title}" and produce:
1. A concise 2-3 sentence executive summary
2. Up to 5 key points (bullet list)
3. Up to 3 action items (bullet list)

Document content:
---
${content.slice(0, 8000)}
---

Respond in this exact JSON format:
{
  "summary": "...",
  "key_points": ["point 1", "point 2", ...],
  "action_items": ["action 1", "action 2", ...]
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    // Extract JSON even if model adds preamble
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    // Fallback: return raw text as summary
    return {
      summary: text.slice(0, 500),
      key_points: [],
      action_items: []
    };
  }
}

/**
 * Answer a question using document context as grounding.
 */
async function groundedAnswer(question, documents) {
  if (documents.length === 0) {
    return {
      answer: 'No documents have been uploaded yet. Please upload some documents first so I can answer questions about them.',
      doc_refs: []
    };
  }

  const docTitles = documents.map((d, i) => `${i + 1}. ${d.title}`);

  if (!HAS_KEY) {
    // Demo mode — no API key. Same shape as the real response.
    return {
      answer: `Based on the ${documents.length} uploaded document(s), here is a sample grounded answer to "${question}". In live mode Claude would cite the exact documents it used. (demo mode — add an API key for live Claude responses)`,
      doc_refs: docTitles
    };
  }

  const context = documents.map((d, i) =>
    `[Document ${i + 1}: ${d.title}]\n${d.content.slice(0, 3000)}`
  ).join('\n\n---\n\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are an operations assistant. Answer questions using ONLY the provided documents as context. 
If the answer is not in the documents, say so clearly. 
Always cite which document(s) you used (e.g. "According to Document 2...").`,
    messages: [
      {
        role: 'user',
        content: `Available documents:
${docTitles.join('\n')}

Document contents:
---
${context}
---

Question: ${question}`
      }
    ]
  });

  return {
    answer: response.content[0].text,
    doc_refs: docTitles
  };
}

/**
 * Generate a daily ops digest from document summaries.
 */
async function generateDigest(documents) {
  if (documents.length === 0) {
    return 'No documents available for digest.';
  }

  const summaries = documents.slice(0, 10).map((d, i) =>
    `Document ${i + 1} — ${d.title}:\n${d.summary || 'No summary available'}`
  ).join('\n\n');

  if (!HAS_KEY) {
    // Demo mode — no API key. Same shape (a string) as the real response.
    const titles = documents.slice(0, 10).map((d) => d.title).join(', ');
    return `Daily ops digest (sample): ${documents.length} document(s) on file — ${titles}. Most items are on track; review any flagged risks and confirm upcoming deadlines. (demo mode — add an API key for live Claude responses)`;
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are an operations manager. Create a brief daily digest (max 150 words) from these document summaries. Highlight the most important items and any urgent actions.

${summaries}`
      }
    ]
  });

  return response.content[0].text;
}

module.exports = { summariseDocument, groundedAnswer, generateDigest };
