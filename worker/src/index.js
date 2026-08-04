/**
 * Gemini chat proxy.
 *
 * The API key is read from env.GEMINI_API_KEY, a Worker secret. It is never
 * returned to the client and never appears in the built site.
 */

const MODEL = 'gemini-2.5-flash';
const MAX_MESSAGE = 1000;
const MAX_TURNS = 20;
const RATE_LIMIT = 20; // requests per IP
const RATE_WINDOW = 600; // seconds

/**
 * The résumé context lives here, not in the client, so a caller cannot swap
 * it out and use this endpoint as a general-purpose chatbot.
 */
const SYSTEM = `You are an AI assistant embedded in Rahul Khare's professional portfolio website. Answer recruiter and hiring-manager questions about Rahul accurately, concisely and positively. Keep answers to 2-4 sentences unless a list is warranted. Never invent information. If asked about something not covered below, say: "Best discussed directly with Rahul — reach him at rahul.khare997@gmail.com or linkedin.com/in/rahulkhare997."

PROFILE — RAHUL KHARE
- Headline: Program Management | Business & Finance Operations | KPI Reporting & Dashboards | Process Improvement
- CURRENT: Program Manager — Business & Finance Operations, Product Programs & Analytics at Zenquip Healthcare Pvt. Ltd., Gurugram (Nov 2025 – present). Early-stage AI mental-healthcare platform: patient app, clinician dashboard, AI therapy assistant "Zennie", sold B2B to clinics, hospitals and corporates.
- PREVIOUS: Registered Investment Representative (Investment Operations & Reporting), TD Bank Group / TD Direct Investing, Toronto (Oct 2021 – Feb 2025, 3.5 years). CIRO/SEC registered. Canada's Big 5.
- Earlier: Head Cashier, The Home Depot Canada (2019–2021, part-time). Business Analyst Intern, ATA Freight India (2017).
- 4+ years total. Relocated from Canada to India in 2025.
- NOTICE PERIOD: 2 weeks. Based in Pune; open to Gurugram, Hyderabad, Bengaluru, Mumbai, Delhi NCR. Night/rotational shifts fine.
- Target roles: Program Manager, Project Manager, Business Operations, Finance Operations, KPI/MIS Reporting, Process Improvement, Business Analysis, Capital Markets Ops.

ZENQUIP ACHIEVEMENTS
- Runs end-to-end program delivery from concept to live private beta; coordinates a 15+ person cross-functional team across design, content, clinical, compliance and legal, and engineering.
- Built the allocation plan for Rs 10 Cr in new funding to founder and investor requirements; tracks spend across product, infrastructure and growth.
- Cut monthly burn and infrastructure cost 10% via direct cloud cost management and expense-control workflows.
- Defines and governs KPI reporting on business costs, delivery milestones and beta adoption for founders and investors.
- Grew the private beta to 30+ doctors, 8+ clinics and hospitals, 80+ patients from an initial 5 doctors and 20 patients; ~60% of 40+ demo participants retained.
- Runs sprint planning, backlog grooming and daily stand-ups in Jira and Confluence; authored PRDs, roadmaps and go-to-market plans.
- Hosts and manages the AWS environment: EC2, Lambda, Amplify, CloudWatch, Route 53, Bedrock.
- Embedded DPDPA and GDPR compliance into the product: consent flows, data-handling standards, audit readiness.

TD BANK ACHIEVEMENTS
- Designed 6+ automated MIS/KPI dashboards (Excel VBA, Power Query, Power BI) consolidating 60+ data sources; adopted by 80+ representatives and leaders up to VP and President level; saved 500–750 team hours a year.
- Led T+1 settlement readiness training for 60+ representatives ahead of the May 2024 rollout.
- Business liaison on a major trading platform migration: user feedback into IT/PMO requirements, UAT and parallel testing.
- Daily cash and securities reconciliation across 20–30 HNI accounts (CAD $15M+ AUM); ~60% of exceptions resolved independently within a 48-hour SLA.
- 20+ KYC/CDD profiles daily; 3-day SLA never missed; EDD, PEP/OFAC/UN/CSA screening; FATCA/CRS.
- Zero compliance audit failures across 3.5 years. Owned a quarterly team budget of CAD $5–10K.
- 50+ Sunshine Calls (highest on team), Legendary Quality Experience Award, four consecutive top-tier ratings.

EDUCATION & CERTIFICATIONS
- PG Certificate FinTech, Seneca College Toronto (2020, Honours, GPA 3.9/4.0)
- PG Certificate Financial Services, Algonquin College Ottawa (2019, Honours, GPA 3.65/4.0)
- BBA (Hons.) Finance & Management, Bharati Vidyapeeth IMED Pune (2018, CGPA 7.4/10)
- CSC, CPH, DFOL, PFSA — Canadian Securities Institute; CIRO/SEC registered. CSI is Canada's national securities licensing body, comparable to SEBI/NISM in India.

TOOLS: Jira, Confluence, AWS, Power BI, Excel VBA, Power Query, SQL, SharePoint, Power Automate, SAP, Salesforce, Bloomberg Terminal, FundServ, Claude Code, n8n, MCP integrations.
LANGUAGES: English (full professional), Hindi (native/bilingual), German (limited working).
CONTACT: rahul.khare997@gmail.com | linkedin.com/in/rahulkhare997

If asked about salary or compensation, say it is best discussed directly with Rahul.`;

function corsHeaders(origin, allowed) {
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/**
 * Cache-backed counter. Cloudflare's cache is per-colo, not global, so this is
 * a brake on runaway quota use rather than a hard security boundary.
 */
async function rateLimited(ip) {
  const key = new Request(`https://ratelimit.local/${encodeURIComponent(ip)}`);
  const cache = caches.default;
  const hit = await cache.match(key);
  const count = hit ? Number(await hit.text()) : 0;

  if (count >= RATE_LIMIT) return true;

  await cache.put(
    key,
    new Response(String(count + 1), {
      headers: { 'Cache-Control': `max-age=${RATE_WINDOW}` },
    }),
  );
  return false;
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, allowed.length ? allowed : ['*']);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

    // Only this site may use the endpoint, so it cannot be resold as a free relay.
    if (allowed.length && !allowed.includes(origin)) {
      return json({ error: 'Origin not allowed' }, 403, cors);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: 'Proxy is not configured' }, 500, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await rateLimited(ip)) {
      return json({ error: 'Too many requests — try again in a few minutes.' }, 429, cors);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors);
    }

    const history = Array.isArray(payload?.history) ? payload.history : [];
    const message = typeof payload?.message === 'string' ? payload.message.trim() : '';

    if (!message) return json({ error: 'Empty message' }, 400, cors);
    if (message.length > MAX_MESSAGE) return json({ error: 'Message too long' }, 400, cors);
    if (history.length > MAX_TURNS) return json({ error: 'History too long' }, 400, cors);

    // Rebuild turns server-side; only role and text survive.
    const contents = history
      .filter((t) => t && typeof t.text === 'string')
      .slice(-MAX_TURNS)
      .map((t) => ({
        role: t.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(t.text).slice(0, MAX_MESSAGE) }],
      }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM }] },
          generationConfig: {
            temperature: 0.5,
            // 2.5-flash counts thinking tokens against maxOutputTokens. With
            // thinking on and a tight cap, reasoning eats the budget and the
            // visible answer gets truncated mid-sentence. Recruiter Q&A over a
            // fixed profile needs no reasoning budget at all.
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 600,
          },
        }),
      },
    );

    if (!upstream.ok) {
      // Never surface the upstream body — it can echo key or quota details.
      return json({ error: 'Upstream error' }, 502, cors);
    }

    const data = await upstream.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ??
      'Sorry — no answer came back. Try rephrasing?';

    return json({ reply }, 200, cors);
  },
};
