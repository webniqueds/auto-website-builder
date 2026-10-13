# Website Builder — Architecture & Application Guide

Website Builder is an AI-powered, full-stack web application that generates complete, production-ready, single-file business landing pages from a short natural-language prompt. 

Instead of generating raw, unpredictable HTML/CSS strings from a language model, the system is engineered around a core architectural principle: **Content as Data, Design as Code**.

---

## 1. Architectural Philosophy: Content as Data, Design as Code

```
                                  USER BRIEF
                         ("Modern architectural studio")
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │    AI Generation Engine   │
                        │ (NVIDIA NIM / Groq / OR)  │
                        └─────────────┬─────────────┘
                                      │ Emits pure JSON data
                                      ▼
                        ┌───────────────────────────┐
                        │        SiteConfig         │
                        │  - Brand identity         │
                        │  - Tagline & descriptions │
                        │  - Sections & items data  │
                        │  - Image URLs & theme     │
                        └─────────────┬─────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│   Template Renderers (15)   │               │   Static HTML Export Engine │
│  - React 19 Components      │               │  - renderToStaticMarkup()   │
│  - CSS Grid & Flex systems  │               │  - Inlined responsive CSS   │
│  - In-place contentEditable │               │  - Zero React runtime       │
│  - Live device preview      │               │  - Single standalone file   │
└─────────────────────────────┘               └─────────────────────────────┘
```

1. **The AI writes pure data**: The language model acts purely as a copywriter and brand strategist, emitting a strictly typed JSON object (`SiteConfig`). It never produces HTML markup or raw CSS.
2. **Templates render the data**: 15 hand-crafted, domain-specific React template renderers convert the `SiteConfig` into pixel-perfect, responsive layouts.
3. **Instant re-theming**: Users can switch templates or color palettes instantaneously without re-running the AI or regenerating content.
4. **Deterministic degradation**: If all LLM providers time out or fail, the pipeline deterministically falls back to pre-engineered niche presets. The user never gets a broken build.

---

## 2. High-Level System Architecture

The application operates across three coordinated layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 19 SPA)                     │
│                        Vite 8 • Tailwind CSS 4 • React Router 7         │
│  - Routes: Landing, Configure, Generate, Preview, Projects, Pricing,   │
│            Admin, PreviewSandbox                                       │
│  - 15 Template Renderers (Atelier, Northline, Forma, Local Table...)   │
│  - In-place contentEditable DOM-to-Config path resolution              │
│  - Local-first state (localStorage credits, plans, version cache)      │
│  - Static HTML compiler (renderToStaticMarkup + inlined CSS bundle)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Server-Sent Events (SSE)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     API LAYER (Dual-Runtime Architecture)               │
│         Local: Express 5 (:3001)  |  Production: Vercel Serverless     │
│  - Consolidated endpoints (<12 function Hobby cap limit)               │
│  - generate-site-v2 (SSE stream, 60s maxDuration)                      │
│  - edit-site (semantic JSON patch engine)                              │
│  - razorpay (create-order + verify-payment HMAC SHA-256)               │
│  - projects, plans, me, admin, purchases, health                       │
└──────────────┬──────────────────┬─────────────────┬────────────────────┘
               │                  │                 │
               ▼                  ▼                 ▼
   ┌──────────────────────┐ ┌───────────────┐ ┌──────────────────────────┐
   │     AI PROVIDERS     │ │    STORAGE    │ │    EXTERNAL SERVICES     │
   │  NVIDIA NIM (20B)    │ │ MongoDB Atlas │ │ Razorpay (Payments)      │
   │  Groq (Llama 3.1 8B) │ │  with In-Mem  │ │ Unsplash CDN (Images)    │
   │  OpenRouter Fallback │ │  Fallback     │ │ Clerk (Optional Auth)    │
   └──────────────────────┘ └───────────────┘ └──────────────────────────┘
```

---

## 3. Project Structure & Codebase Map

```
website-builder/
├── api/                             # Serverless API functions (Vercel & Express)
│   ├── _lib/                        # Internal server modules
│   │   ├── adminAuth.ts             # Superadmin email gating logic
│   │   ├── db.ts                    # MongoDB Atlas client with transparent in-memory fallback
│   │   ├── groq.ts                  # Groq API client (llama-3.1-8b-instant)
│   │   ├── images.ts                # Niche-curated Unsplash photo pools + live API search
│   │   ├── llm.ts                   # Multi-provider latency racing & fallback orchestrator
│   │   ├── nim.ts                   # NVIDIA NIM client (openai/gpt-oss-20b)
│   │   ├── openrouter.ts            # OpenRouter client with streaming stall-guard
│   │   └── templates.ts             # Server-side template defaults & niche starter presets
│   ├── admin.ts                     # GET /api/admin-config, GET /api/admin-stats
│   ├── edit-site.ts                 # POST /api/edit-site (semantic AI delta patcher)
│   ├── generate-site-v2.ts          # POST /api/generate-site-v2 (SSE streaming generator)
│   ├── generate-site.ts             # POST /api/generate-site (v1 compatibility generator)
│   ├── health.ts                    # GET /api/health, GET /api/db-status
│   ├── me.ts                        # GET /api/me, POST /api/me/spend (credit ledger sync)
│   ├── plans.ts                     # GET/POST/PUT/DELETE /api/plans, POST /api/plans/reset
│   ├── projects.ts                  # GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id
│   ├── purchases.ts                 # GET/POST /api/purchases (cross-device payment sync)
│   └── razorpay.ts                  # POST /api/razorpay/create-order & verify-payment
├── server/                          # Local development Express server
│   ├── index.ts                     # Entry point: loads .env (override: true) before app.ts
│   ├── app.ts                       # Express app mounting API handlers on :3001
│   └── routes/generate.ts           # Adapter wrapping Vercel handler signatures for Express
├── src/                             # Client-side React 19 SPA
│   ├── App.tsx                      # Root component with ClerkProvider & BrowserRouter
│   ├── main.tsx                     # React DOM root mounting
│   ├── index.css                    # Tailwind CSS + global mobile responsive overrides
│   ├── components/                  # UI components
│   │   ├── EditableCommand.tsx      # Natural-language AI prompt command bar
│   │   ├── GenerationSteps.tsx      # Real-time multi-agent SSE progress visualizer
│   │   ├── Header.tsx               # Top navigation bar with credit badge & auth status
│   │   ├── PageEditor.tsx           # Structured sidebar configuration editor
│   │   ├── PaletteSelector.tsx      # Interactive color palette picker
│   │   ├── PreviewFrame.tsx         # Preview viewport with Desktop/Tablet/Mobile frames
│   │   ├── TemplateCard.tsx         # Template display card for the landing page
│   │   ├── TemplatePreview.tsx      # Live template card preview renderer
│   │   ├── UpgradeModal.tsx         # Out-of-credits upsell modal
│   │   └── VersionHistory.tsx       # Rollback drawer for saved version snapshots
│   ├── data/
│   │   └── palettes.ts              # Preset color palettes and niche suggestions
│   ├── lib/                         # Client utilities & core logic
│   │   ├── ai.ts                    # SSE stream parser & API client functions
│   │   ├── editConfig.ts            # Immutable path mutation & canvas image compressor
│   │   ├── exportSite.ts            # Single-file HTML static markup exporter
│   │   ├── images.ts                # Client-side image resolution helper
│   │   ├── inlineEdit.ts            # DOM-to-Config path resolution & text indexer
│   │   ├── plans.ts                 # Local-first credit ledger & plan catalog manager
│   │   ├── razorpay.ts              # Razorpay Checkout.js client integration
│   │   ├── serverSync.ts            # Background push/pull sync for credits & projects
│   │   ├── storage.ts               # LocalStorage project persistence
│   │   └── utils.ts                 # Classname merge helper & ID generators
│   ├── pages/                       # Application route views
│   │   ├── Admin.tsx                # Email-gated administration portal
│   │   ├── Configure.tsx            # 3-step project configuration wizard
│   │   ├── Generate.tsx             # Live SSE streaming generation screen
│   │   ├── Landing.tsx              # Main marketing page with template catalog
│   │   ├── Preview.tsx              # Studio preview, editing, and export interface
│   │   ├── PreviewSandbox.tsx       # Isolated iframe preview with contentEditable
│   │   ├── Pricing.tsx              # Credit plan pricing & checkout view
│   │   └── Projects.tsx             # Saved projects management screen
│   ├── templates/                   # 15 domain-specific template engines
│   │   ├── actions.tsx              # Standardized button & link components
│   │   ├── index.ts                 # Template registry and lookup functions
│   │   └── [atelier..vertex]/       # Template directories: index.ts + Renderer.tsx
│   └── types/
│       └── index.ts                 # Core TypeScript definitions (SiteConfig, Project, Plan)
├── generate-doc.mts                 # Word document (.docx) compilation script
├── vercel.json                      # Vercel deployment routes, function durations & rewrites
└── vite.config.ts                   # Vite configuration (port 5173, /api proxy to :3001)
```

---

## 4. The 15 Specialized Template Engines

Every template in `src/templates/` contains an `index.ts` (defining metadata, default content, and theme tokens) and a `Renderer.tsx` (rendering the `SiteConfig` to responsive JSX):

| Template | Target Category | Design Characteristics |
|---|---|---|
| **Atelier** | Creative Agency / Design Studio | Minimal editorial typography, large image grids, masonry work showcase |
| **Northline** | SaaS / Technology Platform | Dark mode aesthetic, metric badges, feature pill grids, interactive tabs |
| **Forma** | Architecture / Interior Design | Monospaced technical accents, blueprint spacing, minimalist project cards |
| **Local Table** | Restaurant / Cafe / Bistro | Warm earth tones, categorized menu columns, reservation calls-to-action |
| **Forge** | Industrial / Construction | Bold brutalist borders, high-contrast badges, heavy machinery showcases |
| **Motion** | Fitness / Sports / Gym | High-energy diagonal cuts, neon accents, class schedules, trainer rosters |
| **Mono** | Personal Portfolio / Freelancer | Ultra-clean monochrome palette, timeline experience, contact links |
| **Commerce** | E-commerce / Modern Retail | Product grids with pricing tags, badge highlights, cart triggers |
| **Heirloom** | Luxury / Heritage Goods | Classic serif typography, gold accents, storytelling timeline |
| **Vertex** | Tech Startup / AI Tool | Gradient borders, glow effects, developer-focused code/feature blocks |
| **Shoreline** | Travel / Hospitality / Resort | Airy layouts, full-bleed scenic hero, room and amenity galleries |
| **Quill** | Editorial / Publishing / Newsletter | Multi-column article layouts, read times, author profiles |
| **Crown** | Legal / Financial / Consulting | Traditional navy tones, partner rosters, case study breakdowns |
| **Petals** | Beauty / Wellness / Spa | Soft pastel accents, treatment menus, practitioner spotlights |
| **Boost** | Growth / Marketing Agency | Bold statistics, client testimonial carousels, audit request forms |

---

## 5. End-to-End Application Workflows

### 5.1 Project Creation & SSE Streaming Generation
1. The user selects a template and arrives at `/configure/:templateId`.
2. The 3-step wizard collects: **Niche**, **Color Palette**, and a **Business Description**.
3. Navigating to `/generate/:templateId` initiates a `POST /api/generate-site-v2` request returning `text/event-stream`.
4. The generation pipeline streams step events:
   - `prepare`: Analyzes template defaults and builds the type-aware JSON schema.
   - `images`: Selects niche-matched photography from curated Unsplash collections.
   - `progress`: Emits token counts as the model streams copy.
   - `result`: Sends the complete, validated `SiteConfig`.
5. 1 credit is deducted from the user's ledger, and the project is saved to `localStorage` and synced to the database.

### 5.2 Direct-Manipulation Visual Editor
Hosted inside `/preview-sandbox/:projectId` within an isolated `<iframe>`:
- **Text Editing (`src/lib/inlineEdit.ts`)**: 
  - `collectTextValues()` traverses the `SiteConfig` JSON tree to extract all leaf strings and build dot-delimited paths (`sections.hero.headline`, `sections.services.items[0].title`).
  - `buildTextIndex()` indexes rendered DOM text to its exact configuration path.
  - Clicking any text element in edit mode sets `contentEditable = true`.
  - On blur or Enter, `setPathValue()` ([`src/lib/editConfig.ts`](file:///c:/Users/Chauhan%20Raj%20K/Desktop/website%20builder/src/lib/editConfig.ts)) immutably updates the config path, which debounces via `commitRef` (500ms) and saves to `localStorage`.
- **In-Browser Image Swapping**:
  - Clicking an image opens a local file selector.
  - `resizeImageForStorage()` reads the file, draws it onto an HTML5 Canvas, resizes it to 1,200px max dimensions, compresses it to JPEG (quality 0.85), and assigns the base64 URI into `imagePrompts`.

### 5.3 Semantic AI Editing
1. The user enters a natural-language prompt in the bottom command bar (e.g., *"Make the copy more conversational and change the accent color to forest green"*).
2. The client calls `POST /api/edit-site` (costs 0.5 credits).
3. `stripImages()` removes image URLs to shrink the prompt by ~40%.
4. The AI returns **only a JSON delta** of modified fields.
5. `deepMerge()` recursively applies the delta onto the existing `SiteConfig`.
6. The updated state is added to the project's `versions` array, enabling instant 1-click rollback via the version history drawer.

### 5.4 Zero-Runtime Static HTML Export
Located in [`src/lib/exportSite.ts`](file:///c:/Users/Chauhan%20Raj%20K/Desktop/website%20builder/src/lib/exportSite.ts):
1. Dynamically imports the template's `Renderer.tsx`.
2. Executes `renderToStaticMarkup(createElement(Renderer, { config }))`.
3. Inlines `TEMPLATE_CSS` containing base typography, reset rules, smooth scrolling, entrance animations (`fadeInUp`), and media queries (`768px`, `640px`, `480px`).
4. Handles React 19 inline style serialization (matching colon-adjacent rules like `[style*="display:flex"]`).
5. Generates and triggers the download of a standalone `.html` file that runs in any browser with **zero React runtime and zero dependencies**.

---

## 6. Multi-Provider AI Orchestration (`api/_lib/llm.ts`)

Generation latency and uptime are protected using multi-provider racing:

| Provider | Target Model | Role & Strategy | Budget |
|---|---|---|---|
| **NVIDIA NIM** | `openai/gpt-oss-20b` | Primary reliable generator; handles complete multi-section JSON | 90s |
| **Groq** | `llama-3.1-8b-instant` | Ultra-fast generator; races against NIM for free users | 20s |
| **OpenRouter** | Configured OpenRouter models | Universal fallback and streaming token generator with stall-guard | 60s |

- **Parallel Racing (`raceWithFallback`)**: Uses `Promise.any()` with individual `AbortController` instances. Groq (~5-10s) races against NVIDIA NIM (~60s cold start). The moment the first valid response completes, all competing requests are aborted immediately.
- **Priority Tier**: Paid credit pack owners bypass the Groq leg and race NVIDIA NIM directly against OpenRouter.
- **Wall-Clock Protection**: All AI operations are bounded by a 115-second global wall clock.

---

## 7. Storage, Resilience & Payment Verification

### 7.1 Multi-Tier Database Resilience (`api/_lib/db.ts`)
1. **Windows DNS Patch**: Calls `dns.setServers(['8.8.8.8', '1.1.1.1'])` to bypass ISP-level SRV record resolution failures on Windows environments.
2. **`withFallback` Handler**: Wraps every database query. If `MONGODB_URI` is omitted or MongoDB Atlas is unreachable (`serverSelectionTimeoutMS: 4000`), the process permanently transitions to an in-memory dictionary. The API never crashes.
3. **Collections**: `projects`, `purchases`, `plans`, and `users` (which records cumulative credit spend via atomic `$inc` updates).

### 7.2 Payments & Razorpay Integration (`api/razorpay.ts`)
- **Default Credit Plans**:
  - **Seed**: ₹99 for 15 credits
  - **Growth**: ₹249 for 60 credits (Popular)
  - **Scale**: ₹499 for 200 credits
- **Order Creation**: Client posts plan price; server converts INR to paise (`amount * 100`) and calls Razorpay Orders API via HTTP Basic Auth.
- **HMAC-SHA256 Cryptographic Verification**:
  ```typescript
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  ```
- **Demo Mode**: Setting `RAZORPAY_DEMO=1` or running without keys enables simulated checkouts for testing without real currency.

---

## 8. Dual-Runtime Deployment Pattern

- **Local Development**: `server/index.ts` runs on port `3001`. It explicitly executes `dotenv.config({ override: true })` **before** dynamically importing `server/app.ts`, preventing ESM static import hoisting from initializing handlers with empty environment variables. Vite proxies `/api/*` from port `5173`.
- **Production (Vercel)**: `api/*.ts` files run as Vercel Serverless Functions. To comply with Vercel Hobby's **12-function cap**, related endpoints are consolidated into single handlers (e.g., `razorpay.ts` handles order creation and signature verification; `admin.ts` routes config and statistics).

---

## 9. Environment Variables Reference

| Variable | Description |
|---|---|
| `NVIDIA_NIM_API_KEY` | API key for NVIDIA NIM (`openai/gpt-oss-20b`) |
| `GROQ_API_KEY` | API key for Groq (`llama-3.1-8b-instant`) |
| `OPENROUTER_API_KEY` | API key for OpenRouter fallback models |
| `MONGODB_URI` | MongoDB Atlas connection string (falls back to memory if omitted) |
| `MONGODB_DB` | MongoDB database name (defaults to `Website`) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_DEMO` | Set to `1` to force simulated payment checkout |
| `SUPERADMIN_EMAILS` | Comma-separated email list authorized to access `/admin` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for user authentication |
| `CLERK_SECRET_KEY` | Clerk secret key for API token verification |
| `UNSPLASH_ACCESS_KEY` | Optional Unsplash developer key for dynamic image queries |
| `PORT` | Local Express API port (defaults to `3001`) |

---

## 10. Development & Verification Commands

```bash
# Install dependencies
npm install

# Start local full-stack development (Express :3001 + Vite :5173)
npm run dev

# Build client for production
npm run build

# Typecheck serverless functions and Express server
npm run typecheck:api

# Lint codebase
npm run lint

# Generate Word document architecture guide
npx tsx generate-doc.mts ARCHITECTURE.md Website-Builder-Architecture-Guide.docx
```