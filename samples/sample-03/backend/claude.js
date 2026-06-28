const Anthropic = require('@anthropic-ai/sdk');

// The app runs WITHOUT an API key in "demo mode" (returns realistic sample
// content). Add an ANTHROPIC_API_KEY only if you want to connect the live API.
const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;
const client = HAS_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Generate a research brief for a content topic.
 */
async function generateBrief(topic) {
  if (!HAS_KEY) {
    // Demo mode — no API key set. Returns a realistic sample of the same shape.
    return {
      hook: `(sample) Most teams get "${topic}" wrong because they treat it as a one-time fix instead of a system.`,
      audience: 'Busy professionals and small teams who want practical, repeatable results',
      angles: [
        `The hidden cost of ignoring ${topic}`,
        `A simple 3-step system for ${topic}`,
        `What the best teams do differently about ${topic}`
      ],
      key_insights: [
        `Small, consistent changes beat big one-off pushes for ${topic}.`,
        'Tracking the right metric matters more than tracking many metrics.',
        'Most failures come from unclear ownership, not lack of effort.',
        'A short feedback loop turns guesses into reliable improvements.'
      ],
      outline: [
        `Why ${topic} is harder than it looks`,
        'The 3-step system, explained simply',
        'A real example you can copy',
        'Common mistakes and how to avoid them'
      ],
      cta: 'Pick one step above and try it this week — then tell us how it went.',
      keywords: [topic, 'how to', 'guide', 'system', 'tips']
    };
  }

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

  if (!HAS_KEY) {
    // Demo mode — no API key set. Returns a realistic sample post (a string).
    const hook = (briefData && briefData.hook) || `Let's talk about ${topic}.`;
    return [
      `*(Sample draft — running in demo mode. Add an API key to generate real content.)*`,
      ``,
      `## ${topic}`,
      ``,
      hook,
      ``,
      `Here's the thing most people miss about ${topic}: it works best as a simple, repeatable system, not a one-time effort. In this ${contentType} post we'll walk through a practical approach you can start using today.`,
      ``,
      `## A simple system`,
      ``,
      `1. Start small and pick one change you can make this week.`,
      `2. Track a single clear metric so you know if it's working.`,
      `3. Review what happened and adjust — short feedback loops win.`,
      ``,
      `## A quick example`,
      ``,
      `Imagine a small team that applied just step one. Within a few weeks they had real data instead of guesses, and that made every later decision easier and faster.`,
      ``,
      `## Wrapping up`,
      ``,
      (briefData && briefData.cta) || 'Pick one idea above and try it this week.'
    ].join('\n');
  }

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
  if (!HAS_KEY) {
    // Demo mode — no API key set. Returns a realistic sample of the same shape.
    return {
      linkedin_teaser:
        `(sample) Most people overthink ${topic}.\n\n` +
        `The truth? A simple, repeatable system beats a big one-time push every time.\n\n` +
        `Here's the 3-step version:\n` +
        `1. Start small this week\n` +
        `2. Track one clear metric\n` +
        `3. Review and adjust\n\n` +
        `What's the one step you'd start with?`,
      email_snippet:
        `(sample) Hey there —\n\n` +
        `If ${topic} has felt harder than it should, you're not alone. ` +
        `The fix is usually simpler than people expect: one small change, one metric to watch, ` +
        `and a quick weekly review. Read on for the full breakdown.`,
      twitter_thread:
        `1/ (sample) Most people get ${topic} wrong. Here's a simpler way 🧵\n\n` +
        `2/ Stop trying to fix everything at once. Pick ONE small change this week.\n\n` +
        `3/ Track a single clear metric. Many metrics = noise. One metric = signal.\n\n` +
        `4/ Review what happened. Short feedback loops turn guesses into results.\n\n` +
        `5/ That's it. Small + consistent beats big + occasional. Try it and report back.`
    };
  }

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
