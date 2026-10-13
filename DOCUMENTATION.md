# Website Builder — Technical Documentation

## 1. Overview

An AI-powered website generator that creates complete, deployable single-file HTML sites from a business niche description. Users pick a visual template, describe their business, and receive a fully styled landing page in seconds — with optional AI editing, version history, and Razorpay payments for credit packs.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Express 5 · MongoDB · Clerk (optional auth) · Razorpay · Vercel Serverless

---

## 2. Project Structure

```
├── api/                        # Vercel serverless functions (10 functions, <12 cap)
│   ├── _lib/                   # Shared server-only modules
│   │   ├── db.ts               # MongoDB client + in-memory fallback
│   │   ├── llm.ts              # Multi-provider AI orchestration (race + fallback)
│   │   ├── nim.ts              # NVIDIA NIM (OpenAI-compatible) provider
│   │   ├── groq.ts             # Groq provider (currently invalid key)
│   │   ├── openrouter.ts       # OpenRouter provider (fallback)
│   │   ├── images.ts           # Niche-matched Unsplash image pools
│   │   ├── templates.ts        # Server-side template metadata + default content
│   │   └── adminAuth.ts        # Admin email auth check
│   ├── health.ts               # GET /api/health, GET /api/db-status
│   ├── razorpay.ts             # POST /api/razorpay/create-order, POST /api/razorpay/verify-payment
│   ├── admin.ts                # GET /api/admin-config, GET /api/admin-stats
│   ├── plans.ts                # GET/PUT/POST/DELETE /api/plans
│   ├── projects.ts             # GET/POST/PUT/DELETE /api/projects
│   ├── purchases.ts            # GET/POST /api/purchases
│   ├── me.ts                   # GET /api/me, POST /api/me/spend
│   ├── generate-site.ts        # Legacy generator (v1)
│   ├── generate-site-v2.ts     # Primary generator — SSE streaming
│   └── edit-site.ts            # AI-powered post-generation editing
├── server/                     # Local Express dev server (not deployed)
│   ├── index.ts                # Entry — loads .env, starts Express on :3001
│   ├── app.ts                  # Express app — mounts routes, CORS, JSON body
│   └── routes/generate.ts      # Adapts Vercel handlers → Express routes
├── src/                        # React client (Vite SPA)
│   ├── App.tsx                 # Router — 8 routes
│   ├── main.tsx                # React root
│   ├── index.css               # Global styles + mobile overrides
│   ├── types/index.ts          # Shared TypeScript interfaces
│   ├── components/             # UI components (Header, PreviewFrame, PageEditor, etc.)
│   ├── pages/                  # Route pages (Landing, Configure, Generate, Preview, etc.)
│   ├── lib/                    # Client utilities
│   │   ├── plans.ts            # Plan management, credits, purchases (localStorage + server)
│   │   ├── razorpay.ts         # Razorpay Checkout JS wrapper
│   │   ├── exportSite.ts       # Renders SiteConfig → downloadable single-file HTML
│   │   ├── ai.ts               # Client-side AI helper
│   │   ├── serverSync.ts       # Push purchases/credits to server
│   │   └── storage.ts          # Project persistence
│   ├── templates/              # 15 design templates
│   │   ├── index.ts            # Template registry
│   │   ├── actions.tsx         # Shared action/button components
│   │   └── <template>/         # Per-template: index.ts (metadata+defaults), Renderer.tsx
│   └── data/palettes.ts        # Color palette presets
├── public/                     # Static assets (favicon, icons)
├── vercel.json                 # Vercel deploy config + URL rewrites
├── vite.config.ts              # Vite config (React plugin, proxy, Tailwind)
├── tsconfig.json               # Client TS config
├── tsconfig.api.json           # Serverless function TS config
└── .env                        # Environment variables (not committed)
```

---

## 3. Architecture

### 3.1 Request Flow

```
User Browser (localhost:5173 / Vercel URL)
  │
  ├─ Vite Dev Proxy (or Vercel rewrites)
  │    /api/* → localhost:3001 (Express) OR Vercel Serverless Functions
  │
  ├─ POST /api/generate-site-v2
  │    → SSE stream: step events → AI call → parse JSON → merge with template defaults → return SiteConfig
  │
  ├─ POST /api/edit-site
  │    → AI edits existing SiteConfig, deep-merges delta
  │
  ├─ POST /api/razorpay/create-order → Razorpay API
  │    → Returns orderId + keyId for client Checkout
  │
  ├─ POST /api/razorpay/verify-payment → HMAC signature check
  │
  └─ GET/POST /api/projects, /api/plans, /api/me, /api/admin-*
```

### 3.2 Dual Deployment Model

**Local Development:**
- `npm run dev` → `concurrently` runs Express (:3001) + Vite (:5173)
- Express adapts Vercel handlers via `server/routes/generate.ts`
- `.env` loaded via `dotenv` (with `override: true` to prevent stale shell env vars)

**Production (Vercel):**
- Each `api/*.ts` file = one serverless function
- `vercel.json` rewrites combine related routes into single functions (12-function Hobby cap → consolidated to 10)
- `.env` values set via Vercel dashboard (never committed to git)
- MongoDB Atlas via `MONGODB_URI`
- Falls back to in-memory store if MongoDB unreachable

### 3.3 Function Consolidation (Vercel Hobby Cap)

| Function File | Handles |
|---|---|
| `api/health.ts` | `/api/health`, `/api/db-status` |
| `api/razorpay.ts` | `/api/razorpay/create-order`, `/api/razorpay/verify-payment` |
| `api/admin.ts` | `/api/admin-config`, `/api/admin-stats` |
| `api/plans.ts` | `/api/plans` (CRUD) |
| `api/projects.ts` | `/api/projects` (CRUD) |
| `api/me.ts` | `/api/me`, `/api/me/spend` |
| `api/generate-site-v2.ts` | `/api/generate-site-v2` (SSE) |
| `api/generate-site.ts` | Legacy v1 |
| `api/edit-site.ts` | `/api/edit-site` |
| `api/purchases.ts` | `/api/purchases` |

---

## 4. AI Generation Pipeline

### 4.1 LLM Provider Strategy (`api/_lib/llm.ts`)

Three providers are orchestrated with **race + fallback** patterns:

| Provider | Model | Typical Latency | Role |
|---|---|---|---|
| **Groq** | `llama-3.1-8b-instant` | ~5-10s | Fastest — races NIM (currently 401: invalid key) |
| **NVIDIA NIM** | `openai/gpt-oss-20b` (OpenAI-compat) | ~60s (cold start) | Reliable default — primary provider |
| **OpenRouter** | `nex-agi/nex-n2.5-pro:free` | Variable | Fallback — stalls on streaming but works non-streaming |

**Free users:** Race Groq (20s) + NIM (90s) → first success wins → OpenRouter fallback
**Priority users (Growth/Scale):** Race NIM (90s) + OpenRouter (60s) → OpenRouter fallback

Wall clock hard cap: 115s. Each provider gets a per-call budget; losers are `AbortController`-cancelled.

### 4.2 Generation Flow (`api/generate-site-v2.ts`)

1. **Parse request**: templateId, niche, palette, description, mode (ai/instant), variation, priority
2. **Load template defaults** from `api/_lib/templates.ts`
3. **Instant mode** (no AI): rule-based content for 7 niche presets (bakery, restaurant, cafe, gym, salon, photography, agency) → returns in <100ms
4. **AI mode**:
   - Introspect template JSON schema → build masked type spec with enum hints
   - Construct user message with NICHE + DESCRIPTION + SCHEMA + variation direction
   - Call `callContentAI()` with streaming token callback
   - Parse JSON response → deep-merge with template defaults
   - Fill images from curated Unsplash pools (by niche + section type)
   - Emit SSE progress events throughout
5. **Fallback**: If AI JSON is unparseable, silently use instant mode content

### 4.3 AI Editing (`api/edit-site.ts`)

- Receives current SiteConfig (images stripped to save tokens) + natural language change request
- AI returns a JSON delta (only changed fields)
- Deep-merged onto existing config client-side
- Costs 0.5 credits

### 4.4 Variation System

7 variation directions cycle on regeneration to produce distinct copy each time:
1. Default
2. Craft/artisan angle
3. Bold/energetic voice
4. Warm/community-first
5. Minimal/premium
6. Modern/tech-forward
7. Playful/friendly

---

## 5. Templates (15 total)

Each template has:
- `index.ts`: metadata (id, name, category, sections, theme tokens) + default content
- `Renderer.tsx`: React component rendering `SiteConfig` with section-based layout

| Template | Category | Sections | Theme Accent |
|---|---|---|---|
| **atelier** | Creative Agency | hero, services, work, about, testimonial, contact | #FF5A36 (orange) |
| **northline** | SaaS/Technology | hero, features, statistics, testimonials, pricing, cta | #3B82F6 (blue) |
| **forma** | Architecture | hero, projects, about, services, contact | #B8860B (gold) |
| **local-table** | Restaurant/Cafe | hero, menu, story, location, reservation | #C45D3E (terra cotta) |
| **forge** | Construction | hero, services, projects, statistics, team, contact | #D97706 (amber) |
| **motion** | Fitness/Sports | hero, programs, trainers, testimonials, membership, contact | #EF4444 (red) |
| **mono** | Portfolio | hero, about, work, skills, experience, contact | #000000 (black) |
| **commerce** | E-commerce | hero, products, benefits, testimonials, story, cta | #7C3AED (purple) |
| **heirloom** | Luxury/Premium | hero, heritage, collections, craftsmanship, boutique, contact | #A67B5B (bronze) |
| **vertex** | Tech Startup | hero, features, stats, integrations, testimonials, cta | #2563EB (blue) |
| **shoreline** | Travel/Hospitality | hero, destinations, experiences, gallery, booking, contact | #0891B2 (cyan) |
| **quill** | Editorial/Publishing | hero, articles, categories, newsletter, about, contribute | #B45309 (amber) |
| **crown** | Professional Services | hero, services, case-studies, metrics, team, contact | #1E3A5F (navy) |
| **petals** | Beauty/Wellness | hero, treatments, gallery, about, testimonials, booking | #D946EF (magenta) |
| **boost** | Marketing Agency | hero, services, case-studies, metrics, team, contact | #F97316 (orange) |

---

## 6. Database (`api/_lib/db.ts`)

### 6.1 Provider

- **Primary:** MongoDB Atlas via `MONGODB_URI`
- **Fallback:** In-memory `Map` store (for local dev without Mongo, or Mongo failure)

`withFallback(mongoOp, memoryOp)` wraps every operation — on first Mongo failure, the process permanently switches to memory mode.

### 6.2 Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `projects` | Saved generated sites | id, userId, name, templateId, niche, palette, config, versions |
| `purchases` | Razorpay payment records | id, userId, planId, name, price, credits, paymentId, exportAccess |
| `plans` | Server-persisted plan list (admin-editable) | id, name, price, credits, features, active |
| `users` | Per-user credit spend tracking | userId, creditsSpent (float, supports 0.5 for AI edits) |

### 6.3 Credit System

Credits are computed: `balance = FREE_START_CREDITS (3) + sum(purchases.credits) - creditsSpent`

- Full generation/regeneration: **1 credit**
- AI edit command: **0.5 credits**
- Server-side tracking via `incrementCreditsSpent()` uses `$inc` for atomic serverless-safe increments

---

## 7. Plans & Payments

### 7.1 Plans

| Plan | Price (INR) | Credits | Priority Gen | Export |
|---|---|---|---|---|
| Seed | ₹99 | 15 | No | Yes |
| Growth | ₹249 | 60 | Yes | Yes |
| Scale | ₹499 | 200 | Yes | Yes |

Plans are server-persisted (editable via Admin panel) and synced to clients on load via `GET /api/plans`.

### 7.2 Razorpay Integration

**Client flow:**
1. `openPlanCheckout()` in `src/lib/razorpay.ts` calls `POST /api/razorpay/create-order`
2. Server creates Razorpay order via Basic Auth (`keyId:keySecret` → base64)
3. Client opens Razorpay Checkout modal with `key` + `order_id`
4. On payment success, calls `POST /api/razorpay/verify-payment`
5. Server verifies HMAC signature: `SHA256(keySecret, orderId|paymentId) === signature`
6. `recordPurchase()` saves to localStorage + pushes to server DB

**Demo mode:** Set `RAZORPAY_DEMO=1` → simulated checkout with fake order/payment IDs. Also auto-activates if keys are missing.

### 7.3 Priority Generation

`hasPriorityGeneration()` checks if user has purchased Growth/Scale plans OR any plan with "Priority generation" in its features. Sends `priority: true` flag to `generate-site-v2` → skips Groq, races NIM + OpenRouter directly.

---

## 8. Site Export (`src/lib/exportSite.ts`)

Client-side exporter that converts `SiteConfig` back into a deployable single-file HTML:

1. Dynamically imports the template's `Renderer` component
2. Renders to static HTML via `renderToStaticMarkup()` (no React runtime in output)
3. Inlines a complete CSS block (animations, mobile overrides, responsive grid rules)
4. Returns a self-contained `.html` file with no external dependencies (images are Unsplash URLs)

The inline CSS mirrors `src/index.css` mobile rules using React 19's no-space inline style format (e.g., `[style*="display:flex"]`) — this is critical because React 19 serializes styles without spaces after colons.

---

## 9. Authentication (Optional)

Clerk authentication is optional. If `VITE_CLERK_PUBLISHABLE_KEY` is set, the app wraps in `ClerkProvider`. If not set, the app works without auth (Clerk components are skipped).

**Admin auth** (`api/_lib/adminAuth.ts`): Checks `x-admin-email` header against `SUPERADMIN_EMAILS` env var (comma-separated list).

---

## 10. Environment Variables

### Required
| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test/live key secret |

### Optional
| Variable | Purpose |
|---|---|
| `MONGODB_DB` | Database name (default: "Website") |
| `RAZORPAY_CURRENCY` | Currency code (default: "INR") |
| `RAZORPAY_PRO_PRICE` | Fallback price in rupees (default: 499) |
| `RAZORPAY_DEMO` | Set "1" or "true" to enable demo mode |
| `SUPERADMIN_EMAILS` | Comma-separated admin email addresses |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk auth (optional) |
| `CLERK_SECRET_KEY` | Clerk server-side secret (optional) |
| `NVIDIA_NIM_API_KEY` | NVIDIA NIM API key |
| `GROQ_API_KEY` | Groq API key (currently invalid) |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key (optional, curated pools used by default) |

**Important:** `dotenv.config({ override: true })` ensures `.env` always wins over stale shell environment variables.

---

## 11. Development

### Quick Start
```bash
npm install
# Copy .env.example → .env and fill in keys
npm run dev          # Starts Express (:3001) + Vite (:5173) concurrently
```

### Available Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Full dev server (API + Vite) |
| `npm run dev:web` | Vite only (frontend, proxies /api to :3001) |
| `npm run server` | Express API only (tsx server/index.ts) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Serve production build locally |
| `npm run typecheck:api` | Type-check serverless functions only |
| `npm run lint` | oxlint |

### Dev Server Notes
- Express loads `.env` via `dotenv.config({ override: true })` before importing handlers
- Vite proxies `/api/*` to `http://localhost:3001`
- CORS configured for `localhost:5173` and `localhost:5174`
- Express JSON body limit: 10MB (for large SiteConfig payloads)

---

## 12. Deployment (Vercel)

### Setup
1. Connect GitHub repo to Vercel (auto-deploy on push to main)
2. Set all environment variables in Vercel dashboard (Settings → Environment Variables)
3. `vercel.json` configures build command, function timeout (60s for generators), and URL rewrites

### Key Constraints
- **Vercel Hobby plan:** max 12 serverless functions → consolidated to 10
- **Function timeout:** 60s max for generators (NIM cold starts can be ~60s)
- **No `.env` on Vercel** — all config via dashboard environment variables
- **MongoDB Atlas** required for persistent data; in-memory fallback works but loses data on cold starts

### URL Rewrites (vercel.json)
All `/api/<path>` requests are rewritten to the appropriate consolidated handler:
- `/api/razorpay/create-order` → `/api/razorpay`
- `/api/admin-config` → `/api/admin`
- `/api/plans/reset` → `/api/plans`
- `/api/projects/:path*` → `/api/projects`
- Catch-all: `/(.*)` → `/index.html` (SPA routing)

---

## 13. Client-Side Data Model

### SiteConfig (core output)
```typescript
interface SiteConfig {
  brandName: string;
  tagline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  niche: string;
  theme: ThemeTokens;        // { background, foreground, accent, muted, surface?, border? }
  sections: Record<string, unknown>;  // Template-specific section data
  imagePrompts: Record<string, string>;  // Niche-matched Unsplash URLs
}
```

### Project (saved work)
```typescript
interface Project {
  id: string;
  name: string;
  templateId: string;
  niche: string;
  palette: PalettePreset;
  config: SiteConfig;
  createdAt: number;
  updatedAt: number;
  versions: ProjectVersion[];  // Version history with labels
  currentVersion: number;
}
```

### localStorage Keys
| Key | Purpose |
|---|---|
| `website-builder-plans` | Cached plan list (synced from server) |
| `website-builder-credits` | Current credit balance (float) |
| `website-builder-purchases` | Purchase history |
| `website-builder-projects` | Saved projects (local) |

---

## 14. Mobile CSS Strategy

Generated sites use inline `style` attributes on React elements (e.g., `style={{ display: 'flex', gap: '32px' }}`). Responsive overrides in `index.css` use attribute selectors to target these styles at breakpoints:

- **768px:** Multi-column grids → 2-column, fixed heights capped
- **640px:** All grids → single column, text truncated to 2 lines, hero padding reduced
- **480px:** Font sizes capped (h1 36→24, h2 32→22), padding halved, flex rows wrap

**Critical:** React 19 serializes inline styles WITHOUT spaces after colons (`display:flex;gap:32px`). All CSS selectors must match this format (e.g., `[style*="display:flex"]`, NOT `[style*="display: flex"]`).

The same CSS is duplicated inline in `src/lib/exportSite.ts` `TEMPLATE_CSS` so exported sites are self-contained.

---

## 15. Key Design Decisions

1. **No runtime in exports:** Sites render via `renderToStaticMarkup` — zero JavaScript in the output HTML
2. **Template as schema:** AI output is deep-merged with template defaults, so missing fields gracefully fall back
3. **Graceful degradation:** Every external dependency has a fallback (MongoDB → memory, AI → instant content, Clerk → no-auth)
4. **Consolidated serverless functions:** Multiple API routes packed into single files to stay under Vercel Hobby's 12-function cap
5. **Client-side credit tracking:** Primary state lives in localStorage with fire-and-forget server sync — works offline, avoids auth complexity
6. **Priority generation:** Paid users skip the dead Groq provider and race the two reliable providers directly
