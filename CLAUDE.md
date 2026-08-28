# High Camp — Career Intelligence Widget

AI chat widget where recruiters paste a job description and get an assessment of Rob McKinney's fit. Single-page static frontend (`index.html`) + one Netlify function (`netlify/functions/chat.js`) that holds the system prompt and calls the Claude API.

- **Design reference:** `DESIGN.md` — colors, typography, layout are final; recreate pixel-accurately.
- **Run locally:** `netlify dev` (needs `ANTHROPIC_API_KEY` in Netlify env).
- **Deploy:** push to `main` on `HollisMountain/rob-mckinney-widget` → Netlify auto-deploys.
- Do not commit CV files or other personal documents; CV sources live in `../../shared/`.
