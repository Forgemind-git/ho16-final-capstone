const Anthropic = require('@anthropic-ai/sdk');

// The app runs fine with NO API key — that's "demo mode".
// It returns realistic sample data so you can see everything work.
// Add an ANTHROPIC_API_KEY later (optional/advanced) to get live AI answers.
const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;
const client = HAS_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Enrich a company lead from just the company name.
 * Claude infers industry, size, pain points, and value propositions.
 */
async function enrichCompany(companyName, contactName, contactEmail) {
  // Demo mode: no API key → return a realistic sample profile (same shape).
  if (!HAS_KEY) {
    return {
      industry: 'SaaS / B2B Software (sample)',
      company_size: 'SMB 50-500',
      pain_points: [
        'Sales reps spend hours on manual company research (sample)',
        'Outreach emails are generic and convert poorly',
        'No single view of deals by pipeline stage'
      ],
      value_props: [
        'Auto-enrich every lead in seconds (sample)',
        'Personalised emails drafted from real company context',
        'Live pipeline dashboard the whole team can see'
      ],
      lead_score: 7,
      enrichment_notes: `Sample enrichment for "${companyName}". This is demo data shown because no ANTHROPIC_API_KEY is set. Add a key (optional/advanced) to get a real, live AI-generated profile.`
    };
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a B2B sales intelligence analyst. Given a company name, infer as much as you can about the company to help a salesperson prepare for outreach.

Company name: "${companyName}"
${contactName ? `Contact name: ${contactName}` : ''}
${contactEmail ? `Contact email: ${contactEmail}` : ''}

Provide your best inference for each field. Be specific and actionable.

Respond in this exact JSON format:
{
  "industry": "the likely industry vertical",
  "company_size": "estimated size (e.g. Startup <50, SMB 50-500, Enterprise 500+)",
  "pain_points": ["specific business pain point 1", "pain point 2", "pain point 3"],
  "value_props": ["how our product/service could help them 1", "value prop 2", "value prop 3"],
  "lead_score": 7,
  "enrichment_notes": "2-3 sentences of additional context about this company and why they could be a good prospect"
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    return {
      industry: 'Unknown',
      company_size: 'Unknown',
      pain_points: [],
      value_props: [],
      lead_score: 5,
      enrichment_notes: text.slice(0, 300)
    };
  }
}

/**
 * Draft a personalised outreach email based on enriched company data.
 */
async function draftEmail(lead) {
  // Demo mode: no API key → return a realistic sample email (same shape).
  if (!HAS_KEY) {
    const company = lead.company || 'your company';
    const contact = lead.contact_name || 'there';
    return {
      subject: `A quicker way to research & reach prospects, ${company}`,
      body: `Hi ${contact},

I noticed ${company} is growing fast in ${lead.industry || 'your space'} — which usually means the sales team is stretched thin on research and follow-up.

We help teams like yours auto-enrich every lead and draft personalised outreach in seconds, so reps spend time talking to prospects instead of digging through websites.

Worth a 15-minute look next week?

Best,
Your Sales Team

— (Sample email shown in demo mode. Add an ANTHROPIC_API_KEY, optional/advanced, for a live AI-written email.)`
    };
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are an expert B2B sales copywriter. Write concise, personalised cold outreach emails that:
- Reference the prospect's specific industry and likely pain points
- Lead with value, not features
- Are under 150 words
- Have a clear, low-friction call to action
- Sound human, not robotic`,
    messages: [
      {
        role: 'user',
        content: `Write a cold outreach email for this prospect:

Company: ${lead.company}
Contact: ${lead.contact_name || 'Decision Maker'}
Industry: ${lead.industry}
Company Size: ${lead.company_size}
Key Pain Points: ${lead.pain_points.join(', ')}
Value Propositions: ${lead.value_props.join(', ')}
Additional Context: ${lead.enrichment_notes}

Provide the response in this exact JSON format:
{
  "subject": "email subject line",
  "body": "full email body text"
}`
      }
    ]
  });

  const text = response.content[0].text.trim();
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    return {
      subject: `Quick question about ${lead.company}`,
      body: text.slice(0, 800)
    };
  }
}

/**
 * Score a lead from 1-10 based on enrichment data.
 */
async function scoreLead(lead) {
  // Demo mode: no API key → return a realistic sample score (same shape).
  if (!HAS_KEY) {
    return {
      score: 7,
      reason: `Sample score: ${lead.company || 'this lead'} looks like a solid mid-market fit (demo data — add an ANTHROPIC_API_KEY for a live AI score).`
    };
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are a sales qualification expert. Rate this lead from 1-10 (10 = excellent fit).

Company: ${lead.company}
Industry: ${lead.industry}
Size: ${lead.company_size}
Pain Points: ${lead.pain_points.join(', ')}

Respond with just a JSON object: {"score": 7, "reason": "one sentence reason"}`
      }
    ]
  });

  try {
    const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { score: 5, reason: 'Unable to score' };
  }
}

module.exports = { enrichCompany, draftEmail, scoreLead };
