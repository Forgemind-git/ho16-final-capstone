const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Generate a research brief for a content topic.
 */
async function generateBrief(topic) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `You are a content strategist and research expert. Generate a comprehensive research brief for the following content topic.

Topic: "${topic}"

Provide your response in this exact JSON format:
{
  "hook": "a compelling opening hook sentence for the article",
  "audience": "who this content is for",
  "angles": ["unique angle 1", "unique angle 2", "unique angle 3"],
  "key_insights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "outline": ["H2 section 1", "H2 section 2", "H2 section 3", "H2 section 4"],
  "cta": "a call to action for the end of the post",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      hook: topic,
      audience: 'General professionals',
      angles: [],
      key_insights: [],
      outline: [],
      cta: 'Share your thoughts in the comments.',
      keywords: []
    };
  }
}

/**
 * Draft a long-form post from a research brief.
 */
async function draftPost(topic, briefData, contentType) {
  const typeInstructions = {
    blog: 'Write a comprehensive blog post (600-900 words). Use headers (##) for sections. Professional but accessible tone.',
    linkedin: 'Write a LinkedIn article (400-600 words). Start with a hook. Use line breaks for readability. End with a question to drive comments.',
    email: 'Write an email newsletter (300-500 words). Conversational tone. Clear value in every paragraph. Strong subject line at the top.'
  };

  const instruction = typeInstructions[contentType] || typeInstructions.blog;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are an expert content writer who creates engaging, well-researched content that people actually want to read. Never use filler phrases or corporate jargon.`,
    messages: [
      {
        role: 'user',
        content: `Write a ${contentType} post about: "${topic}"

Use this research brief:
- Hook: ${briefData.hook}
- Target Audience: ${briefData.audience}
- Key Angles: ${(briefData.angles || []).join(', ')}
- Key Insights to Include: ${(briefData.key_insights || []).join('; ')}
- Outline: ${(briefData.outline || []).join(' → ')}
- Call to Action: ${briefData.cta}

${instruction}

Write the complete post now:`
      }
    ]
  });

  return response.content[0].text;
}

/**
 * Repurpose a long-form post into 3 social variants.
 */
async function repurposePost(topic, content) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are a social media expert who adapts long-form content into platform-native formats that perform well.`,
    messages: [
      {
        role: 'user',
        content: `Repurpose this content about "${topic}" into 3 different formats.

Original content:
---
${content.slice(0, 4000)}
---

Create these 3 variants and respond in this exact JSON format:
{
  "linkedin_teaser": "A 150-200 word LinkedIn post that teases the main idea and drives clicks/engagement. Start with a bold first line. Use line breaks. End with a hook question.",
  "email_snippet": "A 100-150 word email introduction that summarises the key value and entices the reader to read more. Conversational and direct.",
  "twitter_thread": "A 5-tweet thread. Format as: '1/ [tweet]\\n\\n2/ [tweet]\\n\\n3/ [tweet]\\n\\n4/ [tweet]\\n\\n5/ [tweet]'. Each tweet max 280 characters."
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      linkedin_teaser: text.slice(0, 300),
      email_snippet: text.slice(300, 600),
      twitter_thread: text.slice(600, 1000)
    };
  }
}

module.exports = { generateBrief, draftPost, repurposePost };
