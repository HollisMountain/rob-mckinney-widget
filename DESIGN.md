# Handoff: High Camp AI — Career Intelligence Widget

## Overview
High Camp is a personal career intelligence widget for Rob McKinney — an executive leader (CPO/COO) with 30 years of experience and a strong Gen AI background. The widget lets recruiters and hiring managers paste a job description or ask questions about Rob, powered by an AI backend (Netlify function calling Claude). The brand name "High Camp" is a mountaineering term — Rob lives in Denver, CO and the whole aesthetic reflects mountains + nature + modern AI.

## About the Design Files
`index-v5-light-nature.html` is a **high-fidelity HTML prototype** — the reference design showing intended look, feel, layout, and behavior. It is NOT production code to ship directly. The task is to **recreate this design in your target codebase** using its existing framework (React, Vue, Next.js, etc.) and component patterns. If no framework exists, React + Tailwind is recommended.

## Fidelity
**High-fidelity.** Colors, typography, spacing, interactions, animations, and copy are all final. Recreate pixel-accurately using the codebase's patterns.

---

## Layout

Two-column layout, full viewport height (`100vh`):
- **Left sidebar**: `290px` fixed width, `--surface` background (`#faf8f4`), right border
- **Right chat panel**: `1fr`, fills remaining width
- Mobile: stacks vertically, sidebar on top

### Sidebar structure (top → bottom)
1. **High Camp brand bar** — forest green (`#2d6a4f`) background, `⛰ High Camp^AI` logo in Lora serif + `GEN AI · CAREER INTELLIGENCE` monospace tagline
2. **Identity block** — avatar (52×52px rounded-14px green tile with "RM" initials), name in Lora 19px/600, role in JetBrains Mono 10px/teal, status pill
3. **Profile stats grid** — 2×2 grid of stat cards
4. **Highlights** — icon + text rows
5. **Domains** — pill tags
6. **Footer** — monospace small text
7. **SVG mountain silhouette** — absolutely positioned at bottom of sidebar, `opacity: 1`, layered ranges with snow caps and pine trees

### Chat panel structure (top → bottom)
1. **High Camp brand strip** — same green bar, logo left + "online" dot right
2. **Chat header** — white surface, serif headline + subtitle
3. **Messages scroll area** — flex column, `gap: 20px`, padded `24px 28px`
4. **Starter prompts grid** — 2 columns, shown until first message sent, hidden after
5. **Input area** — textarea + send button in a rounded card
6. **SVG mountain panorama** — absolutely positioned at bottom of chat, `opacity: 1`, wide panoramic range

---

## Design Tokens

### Colors
```
--bg:           #f5f2ec   /* warm parchment */
--surface:      #faf8f4   /* slightly lighter */
--surface2:     #f0ede6
--surface3:     #e6e1d8
--border:       rgba(0,0,0,0.08)
--border2:      rgba(0,0,0,0.13)
--pine:         #2d6a4f   /* deep forest green — primary accent */
--pine-mid:     #52976e   /* mid pine */
--pine-light:   #95c9a8   /* sage */
--pine-dim:     rgba(45,106,79,0.10)
--stone:        #8b6914   /* warm amber/ochre — user accent */
--stone-light:  #c4924a
--stone-dim:    rgba(139,105,20,0.10)
--sky:          #4a7fa5   /* alpine sky blue */
--text:         #1a1f1c   /* near-black */
--text-dim:     #4a5548   /* readable mid */
--text-muted:   #8a9488   /* labels only */
```

### Typography
```
Display / headings:  Lora (serif), Google Fonts
Body:                DM Sans, Google Fonts
Monospace labels:    JetBrains Mono, Google Fonts
```

| Element | Font | Size | Weight |
|---|---|---|---|
| Name "Rob McKinney" | Lora | 19px | 600 |
| Chat headline | Lora | 21px | 600 |
| Brand logo | Lora | 15px (sidebar) / 13px (strip) | 600 |
| Body / bubbles | DM Sans | 14.5px | 400 |
| Role, tags, labels | JetBrains Mono | 10–10.5px | 400–500 |
| Stat values | Lora | 20px | 600 |

### Spacing
- Sidebar padding: `22px` horizontal
- Chat padding: `28px` horizontal
- Message gap: `20px`
- Border radius (cards): `10px`; (bubbles): `12px`; (input): `14px`; (avatar): `13px`

### Shadows
```css
--shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
```
Used on: bot message bubbles, input box, avatar.

---

## Screens / Components

### Brand Bar (sidebar + chat strip)
- Background: `#2d6a4f`
- Logo: `⛰ High Camp` in Lora 600 white + `AI` superscript in JetBrains Mono 8px uppercase
- Separator: `1px rgba(255,255,255,0.25)` vertical
- Tagline: `GEN AI · CAREER INTELLIGENCE` in JetBrains Mono 9px, `rgba(255,255,255,0.65)`
- Online dot: `5px` circle, `#a8e6b8`, glow `box-shadow: 0 0 6px rgba(168,230,184,0.7)`, pulsing opacity animation

### Avatar
- 52×52px, `border-radius: 13px`
- Background: `linear-gradient(145deg, #2d6a4f, #1a4030)`
- Text: "RM" in Lora 18px/600, white
- Shadow: `0 0 24px rgba(45,106,79,0.10)`

### Status Pill
- `border-radius: 20px`, background `--surface2`, border `--border`
- Contains pulsing dot (`#52976e`) + "high-camp · active" in JetBrains Mono 10px

### Stat Cards
- Background: `--bg`, border: `--border2`, radius: `10px`, padding: `11px 12px`
- Hover: border-color `--pine-light`, box-shadow `0 2px 8px rgba(45,106,79,0.08)`
- Value: Lora 20px/600 `--text`; accent small text in `--pine-mid`
- Label: JetBrains Mono 9px uppercase `--text-muted`

Current stat cards:
| Value | Label |
|---|---|
| 30 | Years Experience |
| 0 – $1B+ | Corp Scale |
| Denver, Colorado | Location |
| Veteran | Naval Intelligence |

### Highlight Rows
- Icon: 20×20px rounded-6px tile, `--pine-dim` background, `rgba(45,106,79,0.2)` border
- Text: DM Sans 12.5px, `--text-dim`, line-height 1.5

Current highlights:
- 🤖 Gen AI practitioner — building & deploying AI-native products
- 🏔 Led product & tech across startups and Fortune 150 companies
- 🌲 Deep experience in healthcare, SaaS & regulated industries
- 🦅 Built & scaled cross-functional teams of 100+

### Domain Tags
Pill tags, `border-radius: 20px`, JetBrains Mono 10.5px

- `.tag.p` (green): `--pine-dim` bg, `rgba(45,106,79,0.25)` border, `--pine` text → Gen AI, Product Strategy, Operations
- `.tag.s` (stone): `--stone-dim` bg, `rgba(139,105,20,0.22)` border, `--stone` text → Healthcare, SaaS
- `.tag` (neutral): `--bg` bg, `--border2` border, `--text-dim` text → Startups, Enterprise, P&L, Org Design

### Chat Messages
Two roles: `bot` (left-aligned) and `user` (right-aligned)

**Bot bubble:**
- Background: `--surface`
- Border: 1px `--border2` on top/right/bottom; **3px `--pine-mid` on left**
- `border-top-left-radius: 3px` (squared off corner)
- Shadow: `--shadow`

**User bubble:**
- Background: `--surface2`
- Border: 1px `rgba(200,169,110,0.22)` on top/left/bottom; **3px `--stone-light` on right**
- `border-top-right-radius: 3px`

**Avatars:** 32×32px, `border-radius: 9px`
- Bot: green gradient + 2px `rgba(45,106,79,0.45)` border, white text
- User: `--surface2` + 1px `--border2` border, `--text-dim` text

**Sender label:** JetBrains Mono 10px/600 — bot: `--pine`, user: `--stone`
**Timestamp:** JetBrains Mono 10px, `--text-muted`

### Input Box
- Container: `--surface` bg, `--border2` border, `border-radius: 14px`, padding `11px 13px`
- Focus ring: `rgba(45,106,79,0.09)` 3px, border `--pine-light`
- Textarea: no border/outline, DM Sans 14px, `--text`, max-height 120px, auto-resize
- Send button: 34×34px, `border-radius: 9px`, `--pine` background → `--pine-mid` on hover + shadow

### Starter Prompts
2-column grid, hidden after first message sent:
- Background: `--surface`, border `--border2`, radius `9px`, DM Sans 12.5px
- Hover: border `--pine-light`, bg `--pine-dim`

Current prompts:
1. "We're hiring a CPO at an early-stage startup"
2. "VP Product role at a healthcare company"
3. "Tell me about his leadership style"
4. "How does he handle technical teams?"

---

## Interactions & Behavior

### Boot sequence
On load, show typing indicator for ~850ms, then render the greeting message from "High Camp".

**Greeting text:**
> Hi there! I'm an AI trained on Rob McKinney's full career background — 30 years of product, technology, and operational leadership across startups, Fortune 150 companies, and healthcare.
>
> Paste a job description or tell me about the role you're hiring for, and I'll walk you through exactly why Rob could be the person you're looking for.

### Sending a message
1. Hide starter prompts (permanently for session)
2. Append user message bubble (right-aligned)
3. Show typing indicator (3 bouncing dots, `--pine-mid` color)
4. POST to `/.netlify/functions/chat` with full `messages` history array
5. Remove typing indicator, render bot response

### Typing indicator
3 dots, `5px` circles, `--pine-mid` color, staggered bounce animation (0, 0.18s, 0.36s delay)

### Textarea auto-resize
On input, set `height: auto` then `height: min(scrollHeight, 120px)`

### Enter to send
`Enter` sends; `Shift+Enter` inserts newline

### Skill bars (removed in this version)
Previous versions had animated skill bars. This version uses highlight rows instead.

---

## API Integration

**Endpoint:** `POST /.netlify/functions/chat`

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

**Response:**
```json
{
  "content": "string",
  "error": "string (optional)"
}
```

The frontend maintains a local `history` array and sends the full conversation on each request. The Netlify function is responsible for the system prompt, Claude API call, and response formatting.

---

## Animations

| Effect | Details |
|---|---|
| Status dot pulse | `opacity` 1→0.35→1, 2.5s ease-in-out infinite |
| Message enter | `opacity` 0→1, `translateY` 5px→0, 0.22s cubic-bezier(0.16,1,0.3,1) |
| Typing dots | `translateY` bounce, staggered 0.18s, 1.2s infinite |
| Skill fill (prev) | `width` 0→N%, 1.2s cubic-bezier(0.16,1,0.3,1) |

---

## SVG Assets

Both SVG mountain illustrations are inline in the HTML. They use layered `<polygon>` elements:
- Far range (pale, low opacity)
- Mid range (pine green gradient)
- Near treeline (dark green, tree silhouettes)
- Snow caps (white polygons at peaks)

The sidebar SVG is `290×220px` portrait. The chat panorama is `980×280px` landscape. Both use `preserveAspectRatio="xMidYMax meet"` so they anchor to the bottom edge.

---

## Assets & Fonts

All fonts loaded from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500
```

No external images or icon libraries used.

---

## Files in This Package

| File | Description |
|---|---|
| `index-v5-light-nature.html` | Full hifi prototype — the reference design |
| `README.md` | This document |

---

## Notes for Claude Code

- The HTML prototype is self-contained and fully functional (except the Netlify backend). Open it in a browser to see the exact intended design.
- The mountain SVGs are decorative — feel free to extract them as React components or keep them inline.
- The grain texture is a tiny inline SVG data URL applied as `body::before` — easy to replicate with a CSS background-image.
- `text-wrap: pretty` is used on body text for improved line breaks in modern browsers.
- The `body::before` parchment grain uses an inline SVG feTurbulence filter — can be replaced with a PNG texture if preferred.
