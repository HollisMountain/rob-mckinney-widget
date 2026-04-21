// =========================================================================
// High Camp — Netlify Function
// Handles Claude API calls, URL fetching, rate limiting, and Discord logging.
// =========================================================================

// ── Config constants ─────────────────────────────────────────────────────
const MODEL                  = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const MAX_TOKENS             = 1024;
const MAX_URL_CONTENT_CHARS  = 6000;
const MAX_URL_CONTENT_BYTES  = 2 * 1024 * 1024;   // 2 MB hard limit
const URL_FETCH_TIMEOUT_MS   = 8000;
const MAX_HISTORY_MESSAGES   = 20;
const MAX_MESSAGE_LENGTH     = 4000;
const DISCORD_FIELD_CAP      = 1024;
const RATE_LIMIT_PER_MIN     = 10;
const RATE_LIMIT_WINDOW_MS   = 60 * 1000;

// Allowed origins for CORS. Add your custom domain here when live.
const ALLOWED_ORIGINS = new Set([
  "https://benevolent-starlight-084f6e.netlify.app",
]);

// ── System prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are High Camp, a career intelligence assistant with deep knowledge of Rob McKinney's background. Your job is to help potential employers objectively explore whether Rob is a strong fit for their role. You present Rob's experience accurately and specifically — letting the facts speak for themselves rather than advocating or overselling.

## Rob McKinney — Background

**Contact:** Denver, Colorado | rob@hollismountain.com | linkedin.com/in/digitalrob

**Summary:** Technology veteran with 30 years of civilian and military leadership experience. Currently operating at the frontier of generative AI — building production-grade LLM-powered tools daily, for both commercial clients and nonprofit organizations. Seasoned operator across greenfield startups and multibillion-dollar corporations. Proven success in digital, healthcare, real estate, athletic, and academic industries. Human-centered leader, culture champion, and fierce advocate for military veterans in the workplace.

---

### CURRENT WORK

**Hollis Mountain, LLC — Founder & Principal, Oct 2025 – Present**
Fractional executive consultancy partnering with startups, growth-stage companies, and PE-backed portfolios.
- Operates as fractional CPO/COO for early-stage and PE-backed companies, specializing in turnarounds, greenfield team builds, and coaching first-time executives through high-stakes scaling challenges
- **Actively builds and deploys generative AI solutions daily** using LLM APIs — production-grade tools including interactive career intelligence applications (like this one), AI-powered grant research platforms, and automated proposal generators
- Architects end-to-end AI enablement strategies for clients: from opportunity identification through production deployment, with hands-on expertise in LLM integration, prompt engineering, and building internal AI literacy across non-technical teams
- This widget itself is a live example of Rob's GenAI work — built and deployed end-to-end as a client engagement tool

**Veterans Exploration Therapy (VetXTherapy) — Board Member, Head of Technology & AI Enablement, Dec 2025 – Present**
Colorado-based nonprofit using outdoor adventure and community connection to support veteran mental health and reintegration.
- Leads technology strategy, AI enablement, and fundraising development for the organization
- Built custom generative AI tooling for grant discovery, donor prospect research, and automated proposal drafting — measurably reducing grant application preparation time and expanding the funding pipeline
- Serves as a bridge between the veteran business community and the nonprofit sector, securing partnerships, sponsorships, and in-kind technology contributions

---

### PRIOR EXPERIENCE

**Brandzooka — Chief Product Officer (Acting COO), Feb 2023 – Oct 2025**
Programmatic advertising platform serving agencies, small businesses, and political campaigns.
- Recruited at the brink of company collapse as first-ever CPO; stabilized operations, mentored a first-time CEO, and built a product-led culture — extending company viability by three years
- Accelerated v2 platform from MVP to GA in six months: campaign error rates ↓96%, customer support resolution times ↓85%, achieving a one-business-day SLA
- Reduced runaway major infrastructure costs by 90% in first 30 days
- Led sales operations post-stabilization: 146% YoY revenue growth, monthly burn ↓78%
- Record-setting 77.4% logo retention and 93.7% net revenue retention (vs. industry benchmarks of 75%/80%)
- Revamped agency financial tools: 6,087% YoY increase in partner revenue
- Secured critical funding by re-engaging lapsed internal investors
- Awarded the 2025 HIRE Vets Gold Medallion Award — the only federal honor for veteran employment

**Strive Health — VP, Product Management, Jul 2019 – Jul 2022**
Nation's leader in value-based kidney care, managing 56,000+ complex kidney patients.
- First product hire; built a team of 20+ PMs and 90+ technical staff within two years
- Led three product verticals and four horizontal platforms
- First 12 months: launched four market partners from scratch, exceeded aggressive growth targets
- Guided product through $140M Series B led by Alphabet's Capital G
- Launched partnership suite with 27 nephrology groups (~$600M in medical spend), making Strive the largest non-dialysis participant in the Kidney Care Choices Model
- Launched CareMultiplier™ ML platform: optimal starts ↑67%, high-risk hospitalizations ↓49%, 30-day readmissions ↓36%
- Custom tablet program for rural patients: no-show visits ↓66%
- HIPAA-compliant ADT-to-Slack integration credited with saving a patient's life
- Founded 'Strive Dark Thirty' ERG for military veterans

**Homebot — Product Manager, Mar 2018 – Jul 2019**
Denver startup helping homeowners build wealth through their homes (acquired by ASG 2020).
- First dedicated Product Lead, de facto Director of Engineering and Agile Coach
- Distilled company goals into five integrated product lines: MRR ↑245% YoY, churn <5%
- Agile implementation: engineering velocity ↑35%, 100% of quarterly goals hit for first time in company history
- Self-registration/payment automation: Loan Officer subscriptions ↑400%, RE Agent subscriptions ↑540%
- Launched 'Homebot for Buyers': adopted by 60,000 first-time buyers and 20,000 homeowners in six months
- Translated platform to Spanish to serve the 52% Latino share of new homebuyers
- Won grand prize at the 2018 Realogy FWD Innovation Summit

**Arrow Electronics — Product Manager, MyArrow, Sep 2017 – Mar 2018**
Fortune 150 company ($34B+ in sales).
- Owned billion-dollar B2B purchasing platform serving thousands of customers
- Scaled product dev from one local team to six scrum teams across US, Costa Rica, Mexico, UK in 90 days
- Automated purchase & sales order system: processing time ↓99.9%, processed $1B in revenue in 2018

**Peterson's (Nelnet) — Head of Product & Engineering, Jun 2015 – Jun 2017**
World's leading educational services company.
- P&L ownership across multiple seven-figure digital business lines
- User registration redesign: signups ↑67% YoY
- iOS app relaunch: downloads ↑484%, usage sessions ↑359%
- Display ad business projected at $1M+ revenue at 90% margin in year one

**Welltok — Chief of Staff / Director of Delivery Solutions, May 2013 – Jan 2015**
Digital health pioneer (acquired by Virgin Pulse 2021).
- As Chief of Staff, oversaw 120+ person org as direct representative of President and COO
- As Director of Delivery: 900% increase in enterprise deployments in first 12 months
- Deployed wellness programs for IBM (250,000 employees), State of Colorado, State of New Jersey (750,000 employees), Aetna, Centura

**EpicMix / Vail Resorts — Group Manager & Product Lead, Aug 2012 – Mar 2013**
RFID-enabled gamification platform across seven ski resorts.
- P&L owner for EpicMix.com, Photo, and Racing products
- Launched EpicMix Racing (automatic race timing vs. Lindsey Vonn)
- Staged $250,000 charity contest using EpicMix user data

**Examiner.com — Director of Product Development, Mar 2011 – May 2012**
27M+ monthly visitor news/lifestyle network.
- Article creation time ↓50% via platform streamlining
- Launched badging/leaderboard gamification system
- Social referrals ↑20% via OpenAuth sharing widget with ShareThis

**Duke University Athletics — Director of Operations, GoDuke.com, Nov 2008 – Feb 2011**
- Page views ↑38%, unique visitors ↑68% after complete site redesign
- Subscription revenue ↑57%, DVD store revenue ↑1,227%
- Produced first-ever online broadcast of Duke Men's Basketball regular season game

**America Online (AOL) — Various roles, Jul 2002 – Jun 2006**
Rose from Editor to Senior Manager, Production & Publishing for AOL.com and Welcome Screens — at the time, the most-trafficked properties on the Internet. Co-founded the Programming Emergency Response Team (PERT). Coordinated AOL.com's historic open-web launch. Reduced live-screen error rates by 90% and cut required publishing work hours by 50%+ through process and tooling improvements.

**GovernmentGuide.com — Independent Consultant, Feb 2002 – Jul 2002**
World's largest online listing of federal, state, and local government resources. Set page view records, created first-ever operational documentation reducing new staff training time by 60%.

---

### MILITARY SERVICE
**US Navy — Cryptologic Technician Interpretive, Second Class (E-5), Jul 1995 – Jul 1999**
- Naval Security Group Command: cryptologic linguistic and analytical support to senior government and military officials
- Top Secret / SCI clearance
- Qualified in submarines aboard USS Trepang (SSN 674)
- Twice cited by Naval Admirals for superior performance

---

### EDUCATION & CREDENTIALS
- **BS, Business Administration (MIS), magna cum laude** — University of Arizona; Research Assistant, Artificial Intelligence Laboratory (aided development of expert systems and intelligent search agents)
- **Diploma in Linguistics, with honors** — Defense Language Institute (Spanish & Mandarin)
- **AA, cum laude** — Danville Community College
- PMP | Certified Scrum Product Owner | Certified Scrum Master

### LANGUAGES
Spanish (fluent) | Mandarin (basic)

### OUTSIDE
Brazilian Jiu-Jitsu Blue Belt | PADI Rescue Diver | Summited Mt. Kilimanjaro (2018) | Hiked 715 miles on the Appalachian Trail | University of Arizona Men's Volleyball (2000 NIRSA National Champions)

---

## Your Role

When an employer shares a job description, role title, or company context:

1. **Lead with the most relevant experience** — draw on specific metrics, outcomes, and context from Rob's background that map directly to what the role requires
2. **Surface GenAI depth when relevant** — Rob is actively building production LLM tools daily, not just strategizing. For roles touching AI, make this concrete and specific
3. **Be conversational and specific** — not a bullet-list recitation, but a grounded narrative tied to real work
4. **Tailor to the role** — what matters for a startup CPO is different from an enterprise VP; calibrate accordingly
5. **Be honest and balanced** — if a requirement sits outside Rob's core experience, say so plainly and note what adjacent strengths he brings. Credibility comes from accuracy, not spin
6. **Invite questions** — the employer should feel they can dig into any part of his background
7. **Keep responses focused** — 3-4 paragraphs unless more depth is asked for

Start each conversation with a brief, neutral greeting and ask what role they're exploring.`;

// ── Rate limiting (in-memory, per warm instance) ─────────────────────────
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);
  // Prune stale entries periodically
  if (rateLimitMap.size > 1000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS * 2;
    for (const [k, v] of rateLimitMap) {
      if (v.windowStart < cutoff) rateLimitMap.delete(k);
    }
  }
  return record.count > RATE_LIMIT_PER_MIN;
}

// ── SSRF protection ──────────────────────────────────────────────────────
function isPrivateOrUnsafeHost(hostname) {
  const h = hostname.toLowerCase();
  // IPv4 private / loopback / link-local / metadata
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^127\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (/^0\./.test(h)) return true;
  // Hostnames
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "metadata.google.internal" || h.startsWith("metadata.")) return true;
  // IPv6 loopback / link-local / unique-local
  if (h === "::1" || h === "[::1]") return true;
  if (/^\[?fe80:/i.test(h)) return true;
  if (/^\[?fc00:/i.test(h) || /^\[?fd/i.test(h)) return true;
  return false;
}

function isSafeUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (isPrivateOrUnsafeHost(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

// ── CORS helpers ─────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// ── URL content fetching (with size guard) ───────────────────────────────
async function fetchUrlContent(urlStr) {
  if (!isSafeUrl(urlStr)) {
    return { ok: false, reason: "Unsafe URL rejected" };
  }
  const res = await fetch(urlStr, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; HighCampBot/1.0)" },
    signal: AbortSignal.timeout(URL_FETCH_TIMEOUT_MS),
    redirect: "follow",
  });
  const contentLength = Number(res.headers.get("content-length") || 0);
  if (contentLength > MAX_URL_CONTENT_BYTES) {
    return { ok: false, reason: `Content too large (${contentLength} bytes)` };
  }
  // Check redirect target is still safe (URL class resolves redirect URL)
  if (!isSafeUrl(res.url)) {
    return { ok: false, reason: "Redirected to unsafe URL" };
  }
  const html = await res.text();
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_URL_CONTENT_CHARS);
  return { ok: true, text };
}

// ── Discord logging ──────────────────────────────────────────────────────
// NOTE: In Lambda/Netlify Functions the container freezes when the handler
// returns, so we must await this (with a tight timeout) rather than
// fire-and-forget — otherwise the request gets killed mid-flight.
async function logToDiscord(userMsg, reply, turn) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  const truncate = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2500),
      body: JSON.stringify({
        username: "High Camp",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        embeds: [{
          color: 0x2d6a4f,
          fields: [
            { name: "👤 Visitor asked",    value: truncate(userMsg, DISCORD_FIELD_CAP) },
            { name: "⛰ High Camp replied", value: truncate(reply,   DISCORD_FIELD_CAP) },
          ],
          footer: { text: `Turn ${turn} · ${new Date().toUTCString()}` },
        }],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Discord webhook non-OK:", res.status, body.slice(0, 300));
    }
  } catch (err) {
    console.error("Discord webhook error:", err.message);
  }
}

// ── Input validation ─────────────────────────────────────────────────────
function validateMessages(messages) {
  if (!Array.isArray(messages)) return "messages must be an array";
  if (messages.length === 0) return "messages array is empty";
  if (messages.length > MAX_HISTORY_MESSAGES * 2) {
    return `history too long (max ${MAX_HISTORY_MESSAGES} turns)`;
  }
  for (const m of messages) {
    if (typeof m?.content !== "string") return "malformed message";
    if (m.content.length > MAX_MESSAGE_LENGTH) {
      return `message too long (max ${MAX_MESSAGE_LENGTH} chars)`;
    }
    if (m.role !== "user" && m.role !== "assistant") {
      return "invalid message role";
    }
  }
  return null;
}

// ── Main handler ─────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  // Rate limiting (per client IP)
  const ip = (event.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Too many requests. Please wait a minute." }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");

    const validationErr = validateMessages(messages);
    if (validationErr) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: validationErr }),
      };
    }

    // If latest user message contains a URL, fetch & inject
    const augmentedMessages = messages.map(m => ({ ...m }));
    const lastMsg = augmentedMessages[augmentedMessages.length - 1];
    if (lastMsg?.role === "user") {
      const urlMatch = lastMsg.content.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const result = await fetchUrlContent(urlMatch[0]).catch(e => ({
          ok: false, reason: e.message,
        }));
        if (result.ok) {
          lastMsg.content = `${lastMsg.content}\n\n[Page content fetched from ${urlMatch[0]}]:\n${result.text}`;
        } else {
          console.log("URL fetch skipped:", result.reason);
        }
      }
    }

    // Call Claude — system prompt is cached for 5 min via ephemeral cache_control
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [{
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        }],
        messages: augmentedMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Anthropic API error ${response.status}: ${JSON.stringify(data)}`);
    }

    const reply = data.content[0].text;

    // Log to Discord — must await in Lambda since the container freezes on return
    await logToDiscord(messages[messages.length - 1].content, reply, messages.length);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply }),
    };
  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};
