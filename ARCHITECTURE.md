# Website Builder — Architecture & Application Guide

## 1. Executive Summary & About the Application

**Website Builder** is an AI-driven, full-stack application designed to generate, preview, edit, and export complete, responsive, single-file business landing pages from a short natural-language prompt.

### 1.1 The Core Thesis: Content as Data, Design as Code
Traditional AI site generation attempts to produce raw HTML and CSS directly from language models. This leads to broken layouts, invalid tags, inconsistent responsiveness, and security risks. 

This application decouples content from design:
1. **The AI generates structured JSON (`SiteConfig`)**: The LLM acts purely as a copywriter and content strategist, returning data conforming to a strict JSON schema introspected from template defaults.
2. **React templates render the data**: 15 pre-built, domain-specific React components render the `SiteConfig` with hand-crafted typographic hierarchies, CSS grid systems, animations, and color tokens.
3. **Decoupled transformations**: A user can change the template or color palette at any time without re-running the AI or regenerating content.
4. **Deterministic degradation**: If LLMs fail, rate-limit, or time out, the system automatically falls back to curated niche presets. The user never receives a broken site.

---

## 2. Technology Stack & Key Dependencies

### Frontend (Client SPA)
- **React 19 (`react`, `react-dom`)**: Modern React with hooks, functional components, and `renderToStaticMarkup`.
- **Vite 8 (`vite`, `@vitejs/plugin-react`)**: Fast HMR dev server and optimized production bundler.
- **Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/vite`)**: Utility-first CSS framework for the builder application UI.
- **React Router 7 (`react-router-dom`)**: Declarative client-side routing.
- **Clerk (`@clerk/clerk-react`)**: User authentication with graceful anonymous fallback.
- **Framer Motion (`framer-motion`)**: Layout transitions, device switching animations, and modal overlays.
- **Lucide React (`lucide-react`)**: Comprehensive icon set.
- **UUID (`uuid`)**: Unique identifier generation for projects, versions, and orders.

### Backend & API Layer
- **Express 5 (`express`, `cors`, `dotenv`)**: Local development HTTP server mounted on port `3001`.
- **Vercel Serverless Functions (`@vercel/node`)**: Production serverless execution on Vercel.
- **MongoDB Driver (`mongodb`)**: Native Node.js MongoDB driver for Atlas persistence with in-memory fallback.
- **Crypto (`node:crypto`)**: HMAC-SHA256 verification for Razorpay payment signatures.
- **Docx (`docx`)**: Programmatic Microsoft Word document generation tooling.

---

## 3. High-Level System Architecture

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

## 4. The Core Data Contract (`SiteConfig`)

The universal contract between the AI generation pipeline, the templates, the visual editor, and the export engine is defined in `src/types/index.ts`:

```typescript
export interface ThemeTokens {
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  surface?: string;
  border?: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  niche: string;
  theme: ThemeTokens;
  sections: Record<string, unknown>;
  imagePrompts: Record<string, string>;
}
```

### 4.1 Schema Introspection in Generation (`api/generate-site-v2.ts`)
Rather than maintaining separate schemas for each of the 15 templates, the backend performs runtime schema introspection:
1. `getApiTemplate(templateId)` fetches the template default content.
2. `collectEnums(sections)` recursively scans the section tree to discover categorical fields (e.g. badge types, alignment options).
3. `serializeSpecLines()` generates a type-masked JSON specification (replacing actual text with `"string"`, numbers with `"number"`, etc.).
4. The masked schema is injected into the LLM prompt with strict rules: *match every key exactly, respect allowed enums, generate zero HTML or image URLs*.

---

## 5. End-to-End User Journeys & Frontend Workflows

### 5.1 Route Map (`src/App.tsx`)
The application defines 8 distinct routes:
- `/` (`src/pages/Landing.tsx`): Showcase of the 15 templates, hero messaging, and feature highlights.
- `/configure/:templateId` (`src/pages/Configure.tsx`): 3-step configuration wizard (Niche selection, Palette picker, Business brief & instructions).
- `/generate/:templateId` (`src/pages/Generate.tsx`): Real-time generation progress monitor with Server-Sent Events (SSE).
- `/preview/:projectId` (`src/pages/Preview.tsx`): Main studio view with responsive device switcher (Desktop, Tablet, Mobile), AI command bar, version history drawer, and export buttons.
- `/preview-sandbox/:projectId` (`src/pages/PreviewSandbox.tsx`): Isolated iframe target rendering the site without chrome, featuring the live in-place `contentEditable` visual editor.
- `/projects` (`src/pages/Projects.tsx`): Grid of user-created websites, with options to duplicate, edit, or delete.
- `/pricing` (`src/pages/Pricing.tsx`): Credit packs catalog with Razorpay Checkout integration.
- `/admin` (`src/pages/Admin.tsx`): Role-gated administration dashboard for plan management and sales analytics.

### 5.2 Live In-Place Visual Editing (`src/pages/PreviewSandbox.tsx`)
The application provides an intuitive direct-manipulation editing experience:
1. **DOM-to-Config Indexing (`src/lib/inlineEdit.ts`)**: 
   - `collectTextValues()` walks the `SiteConfig` object and extracts every leaf string (under 200 chars), tracking its dot-delimited path (e.g. `sections.hero.headline`, `sections.services.items[0].title`).
   - `buildTextIndex()` creates a bidirectional map between rendered text and its exact JSON path.
2. **contentEditable Activation**:
   - In edit mode, text elements (`h1, h2, p, span, li, button`, etc.) become interactive.
   - Clicking an element sets `contentEditable = true` and shows a focus ring.
   - Pressing `Enter` or blurring commits the change. `getPathValue()` and `setPathValue()` (`src/lib/editConfig.ts`) update the configuration without mutating unaffected keys.
   - Updates are debounced with `commitRef` (500ms) and saved to `localStorage` and synced to the database.
3. **In-Browser Image Replacement**:
   - Clicking an image opens a native file picker.
   - The selected image is loaded into an HTML5 Canvas via `resizeImageForStorage()`, resized to maximum dimensions (1200px), compressed to JPEG at 0.85 quality, and stored as an optimized base64 data URI directly in `imagePrompts`.

---

## 6. AI Generation & Multi-Provider Orchestration

### 6.1 Multi-Provider Race & Fallback (`api/_lib/llm.ts`)
To maximize reliability and reduce latency, the backend orchestrates multiple AI providers concurrently using `Promise.any()` and per-provider `AbortController` timeouts:

| Provider | Model / Endpoint | Role & Behavior | Default Budget |
|---|---|---|---|
| **NVIDIA NIM** | `openai/gpt-oss-20b` | High reliability; primary generator; handles long contexts | 90s |
| **Groq** | `llama-3.1-8b-instant` | Ultra-fast execution (~5-10s); races against NIM for free tier | 20s |
| **OpenRouter** | Configured OpenRouter models | Universal fallback and streaming token generator | 60s |

#### The Racing Strategy:
1. **Free Tier**: Groq (20s) races against NVIDIA NIM (90s). The moment the first valid response completes, `Promise.any` resolves and the loser is immediately aborted via its `AbortController`. If both fail, it falls back to OpenRouter.
2. **Priority Tier (Paid Users)**: Skips the Groq leg entirely and races NVIDIA NIM directly against OpenRouter.
3. **Hard Wall-Clock Ceiling**: All LLM calls are bound to an overall 115-second wall clock.

### 6.2 Streaming Generation via SSE (`api/generate-site-v2.ts`)
The generator opens a `text/event-stream` connection and yields granular progress events:
1. `{"type":"step","step":"prepare"}`: Introspecting template schema and building the system prompt.
2. `{"type":"step","step":"images"}`: Selecting niche-matched image assets from curated Unsplash pools.
3. `{"type":"progress","chars":N,"elapsedMs":M}`: Emitting token count updates as the AI writes copy.
4. `{"type":"result","config":{...},"elapsedMs":M}`: Emitting the completed, validated `SiteConfig`.

### 6.3 Semantic AI Editing (`api/edit-site.ts`)
When users request natural-language changes ("make the tone punchier", "change the accent color to emerald"):
1. The backend recursively strips all image URLs via `stripImages()` using a blacklist (`IMAGE_KEYS`), reducing prompt tokens by ~40%.
2. The model receives `CURRENT CONFIG` and `CHANGE REQUEST`, and returns **only a JSON delta** of changed fields.
3. `deepMerge()` recursively patches the delta onto the existing `SiteConfig`. Unchanged sections, items, and image assignments remain untouched.

---

## 7. Zero-Runtime Static HTML Export Engine (`src/lib/exportSite.ts`)

The export pipeline converts the React application state into an independent, production-ready static website:
1. **Static Markup Generation**: Imports the target template's `Renderer.tsx` and executes `renderToStaticMarkup(createElement(Renderer, { config }))`.
2. **CSS Inlining**: Bundles `TEMPLATE_CSS` containing base resets, smooth scrolling, entrance keyframes (`fadeInUp`), hover transitions (`tpl-card`), and responsive media queries (`@media (max-width: 768px)`, `640px`, `480px`).
3. **React 19 Inline Style Handling**: React 19 serializes inline style attributes without spaces after colons (`display:flex;gap:32px`). The export engine's CSS rules use matching attribute substring selectors (`[style*="display:flex"]`) to ensure responsive rules match accurately.
4. **Standalone Output**: Returns a single `.html` file with zero React runtime, zero JavaScript framework dependencies, and self-contained styling, deployable to GitHub Pages, Netlify, Vercel, or traditional cPanel hosting.

---

## 8. Backend Architecture & Dual-Runtime Deployment

### 8.1 Dual-Runtime Pattern
- **Development**: An Express 5 server in `server/index.ts` runs on port `3001`. To solve ESM import hoisting (where static imports evaluate before `dotenv.config()`), `server/index.ts` configures `dotenv` with `override: true` first, then dynamically imports `server/app.ts`.
- **Production**: Handlers in `api/*.ts` are deployed as Vercel Serverless Functions.

### 8.2 Vercel Hobby 12-Function Cap Consolidation
Vercel Hobby accounts restrict projects to at most 12 serverless functions. Related endpoints are consolidated into single files using URL-based dispatchers:
- `api/razorpay.ts`: Dispatches `POST /api/razorpay/create-order` and `POST /api/razorpay/verify-payment`.
- `api/admin.ts`: Dispatches `GET /api/admin-config` and `GET /api/admin-stats`.
- `api/projects.ts`: Dispatches `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`.
- `api/plans.ts`: Dispatches catalog listing, plan upsert, plan delete, and reset-to-defaults.
- `api/me.ts`: Dispatches user credit balance retrieval and credit spend tracking.
- `api/health.ts`: Dispatches uptime and MongoDB connection checks.

---

## 9. Data Persistence & Multi-Tier Resilience (`api/_lib/db.ts`)

### 9.1 The `withFallback` Resilience Pattern
Database interactions are wrapped in `withFallback(primaryFn, memoryFn)`:
1. **No MongoDB URI**: Operates immediately in-memory for zero-setup local development.
2. **DNS Patching**: Executes `dns.setServers(['8.8.8.8', '1.1.1.1'])` to bypass ISP-level SRV resolution failures on Windows networks.
3. **Automatic Circuit Breaker**: If MongoDB Atlas connection drops or times out (`serverSelectionTimeoutMS: 4000`), the process permanently flips to an in-memory dictionary. The API never crashes or drops requests.

### 9.2 Data Collections Schema
- `projects`: Stores website instances (`id`, `userId`, `name`, `templateId`, `niche`, `palette`, `config`, `createdAt`, `updatedAt`).
- `purchases`: Records verified Razorpay transactions (`id`, `userId`, `planId`, `price`, `credits`, `paymentId`, `exportAccess`).
- `plans`: Dynamic catalog of plans (`id`, `name`, `tagline`, `price`, `currency`, `credits`, `features`, `exportAccess`, `popular`, `active`).
- `users`: Ledger tracking cumulative credit spend (`userId`, `creditsSpent`, `updatedAt`) using atomic MongoDB `$inc` operations.

---

## 10. Monetization, Credit Ledger & Payments

### 10.1 Credit Economics
- **Initial Free Credits**: New users receive `FREE_START_CREDITS = 3`.
- **Consumption**:
  - Full site generation / regeneration = `1.0` credit.
  - Semantic AI edit = `0.5` credit.
  - Instant generation = `0.0` credit.
- **Credit Balance Equation**:
  $$\text{Balance} = \text{Free Credits (3)} + \sum \text{Purchased Credits} - \text{Credits Spent}$$

### 10.2 Razorpay Payment Flow (`api/razorpay.ts`)
1. **Order Creation**: Client calls `/api/razorpay/create-order` with the plan price. Server computes amount in paise (`amount * 100`) and calls Razorpay Orders API via HTTP Basic Auth.
2. **Client Checkout**: Razorpay Checkout modal opens with `keyId` and `orderId`.
3. **Cryptographic Verification**: On checkout completion, client sends `orderId`, `paymentId`, and `signature` to `/api/razorpay/verify-payment`.
4. **HMAC-SHA256**: The server re-computes:
   $$\text{expectedSignature} = \text{HMAC-SHA256}(\text{orderId} + "|" + \text{paymentId}, \text{RAZORPAY\_KEY\_SECRET})$$
   Credits and export access are granted only if the signature matches.
5. **Demo Simulation Mode**: Setting `RAZORPAY_DEMO=1` or running without keys enables simulated checkouts for end-to-end testing without real currency.

---

## 11. Security, Role-Based Access & Admin Portal

### 11.1 Authentication & Authorization
- **Clerk Integration**: When `VITE_CLERK_PUBLISHABLE_KEY` is present, the app wraps in `ClerkProvider`. If absent, it operates in anonymous mode.
- **Superadmin Email Gate (`api/_lib/adminAuth.ts`)**: 
  - Compares the `x-admin-email` header or authenticated session against the comma-delimited `SUPERADMIN_EMAILS` environment variable.
  - Unauthorized requests to `/api/admin-stats` receive HTTP 403 Forbidden.

### 11.2 Admin Capabilities (`src/pages/Admin.tsx`)
- **Real-Time Analytics**: Visualizes total projects created, total orders, gross revenue (INR), and cumulative credits consumed.
- **Plan Catalog Management**: Allows administrators to create custom pricing tiers, toggle plan visibility, modify pricing/credits, and mark plans as "Popular".
- **Database Reset**: One-click restore to restore default system plans (Seed, Growth, Scale).