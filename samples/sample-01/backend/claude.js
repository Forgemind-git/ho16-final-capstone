const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Summarise an operations document, extracting key points and action items.
 */
async function summariseDocument(title, content) {
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

  const context = documents.map((d, i) =>
    `[Document ${i + 1}: ${d.title}]\n${d.content.slice(0, 3000)}`
  ).join('\n\n---\n\n');

  const docTitles = documents.map((d, i) => `${i + 1}. ${d.title}`);

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
