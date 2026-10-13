import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callContentAI } from './_lib/llm.js';
import { parseJsonResponse } from './_lib/groq.js';
import { getApiTemplate } from './_lib/templates.js';
import { buildCuratedImages } from './_lib/images.js';

const SYSTEM_PROMPT = `You are a world-class copywriter and content strategist. You tailor a website's existing content to a specific business.

You will receive:
- NICHE: the industry of the business
- DESCRIPTION: the owner's description of the business
- BASELINE: the current content of the site, as a JSON object

Return ONE valid JSON object that is a PARTIAL EDIT of the BASELINE.

How partial edits work:
- Only include the fields whose content should CHANGE for this business.
- Every field you omit keeps its current value from the BASELINE automatically.
- If an entire section already fits the business, omit it entirely — do not restate it.
- Arrays: include only the items you want to change (e.g. rename a service, tweak one testimonial). Omitted items keep their defaults. Never return a full copy of the array unchanged.

RULES:
1. Match the BASELINE structure exactly. Do not add or remove keys. Do not invent new section names.
2. Every field you DO include must be realistic, specific, compelling content FOR THIS BUSINESS AND NICHE. No lorem ipsum, no leftover placeholder text.
3. BE SHORT. This runs over a live API with a time budget, so brevity is a feature:
   - tagline: 3-5 words. Section headings: 2-4 words. Buttons/CTA: 2-3 words.
   - descriptions/testimonials: ONE short sentence, at most 12 words each. No filler, no fluff.
   - Arrays: output at most 2 changed items (missing items are kept from the BASELINE).
4. When a field has an allowed-list comment (e.g. "pick one of: ..."), choose the most fitting value from that list.
5. Never output URLs, image links, HTML, or code. Images are assigned automatically.
6. brandName: use a name from the description if present, otherwise invent a believable business name for the niche. Only include it if it must change from the BASELINE.
7. Numbers must be plain numbers (e.g. 2021, 120) without units or commas.
8. Return ONLY the JSON object. No markdown fences, no explanation.
9. Output compact JSON: no pretty-printing, no indentation, no line breaks, no commentary before or after. Start writing the JSON object as the very first character.
10. Every extra token you generate delays the result. Change only what needs changing — the BASELINE already contains good content.`;

// The system prompt enforces very short content and partial edits, so a
// typical response is now only the changed fields (~150-350 tokens) instead
// of a full site rebuild. 800 gives safe headroom without letting models pad.
const OUTPUT_TOKEN_BUDGET = 800;

// Used on regeneration so each fresh attempt is clearly different from before.
const VARIATION_DIRECTIONS = [
  '',
  'Reframe the brand around a different angle: focus on craft, artisans and hands-on quality.',
  'Adopt a bold, energetic voice with punchy, confident phrasing and stronger claims.',
  'Take a warm, community-first direction: emphasize people, trust, and shared experience.',
  'Lean minimal and premium: short, elegant phrasing with a refined, editorial tone.',
  'Go modern and tech-forward: emphasize innovation, convenience, and forward-thinking results.',
  'Try a playful, friendly personality with vivid, casual language and memorable specifics.',
];

function variationDirection(variation: number): string {
  const idx = Math.abs(Math.floor(variation)) % VARIATION_DIRECTIONS.length;
  return VARIATION_DIRECTIONS[idx];
}

// ============================================================
// Baseline introspection (builds a masked, type-aware spec for the LLM)
//
// Unlike a pure schema (which would show only "<string>" placeholders and
// force the model to regenerate everything), we ship the REAL default values
// as the baseline. The model sees good copy it can keep, and is told to
// return a partial edit — only the fields that should change. This slashes
// output tokens (only ~150-350 vs 600-800 for a full rebuild).
// ============================================================
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function collectEnums(sections: unknown): Map<string, Set<string>> {
  const enums = new Map<string, Set<string>>();
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!isRecord(value)) return;
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' && v.length > 0 && v.length <= 24) {
        if (!enums.has(k)) enums.set(k, new Set());
        enums.get(k)!.add(v);
      } else if (typeof v === 'number' || typeof v === 'boolean') {
        if (!enums.has(k)) enums.set(k, new Set());
        enums.get(k)!.add(String(v));
      }
      walk(v);
    }
  };
  walk(sections);
  for (const [k, set] of enums) {
    if (set.size > 8) enums.delete(k);
  }
  return enums;
}

function jsonLiteral(v: unknown): string {
  return JSON.stringify(v);
}

function serializeSpecLines(
  value: unknown,
  enums: Map<string, Set<string>>,
  key: string | null,
  indent: string
): string[] {
  if (Array.isArray(value)) {
    const out = [];
    const head = key !== null ? `"${key}": ` : '';
    out.push(`${indent}${head}[`);
    const item = value[0];
    if (item !== undefined) {
      if (isRecord(item)) {
        out.push(...serializeSpecLines(item, enums, null, `${indent}  `));
      } else {
        out.push(`${indent}  ${jsonLiteral(item)}`);
      }
    }
    out.push(`${indent}]  // ${value.length} items in the BASELINE — keep the ones that fit, change the rest`);
    return out;
  }
  if (isRecord(value)) {
    const out = [];
    const head = key !== null ? `"${key}": ` : '';
    out.push(`${indent}${head}{`);
    for (const k of Object.keys(value)) {
      out.push(...serializeSpecLines(value[k], enums, k, `${indent}  `));
    }
    out.push(`${indent}}`);
    return out;
  }
  let note = '';
  if (key !== null && enums.has(key)) {
    note = `  // pick one of: ${[...enums.get(key)!].join(' | ')}`;
  }
  const head = key !== null ? `"${key}": ` : '';
  return [`${indent}${head}${jsonLiteral(value)}${note}`];
}

function buildSchemaSpec(defaultContent: Record<string, unknown>): string {
  const enums = collectEnums(defaultContent.sections);
  const lines: string[] = ['// BASELINE — the site current content. Return ONLY the fields to change.'];
  lines.push('{');
  if (isRecord(defaultContent.site)) {
    lines.push(...serializeSpecLines(defaultContent.site, enums, 'site', '  '));
  }
  if (isRecord(defaultContent.sections)) {
    lines.push(...serializeSpecLines(defaultContent.sections, enums, 'sections', '  '));
  }
  lines.push('}');
  return lines.join('\n');
}

// ============================================================
// Deep, type-aware merge of AI content into template defaults
// ============================================================
function mergeDeep(templateValue: unknown, aiValue: unknown): unknown {
  if (aiValue === null || aiValue === undefined) return templateValue;

  if (Array.isArray(templateValue)) {
    if (!Array.isArray(aiValue) || aiValue.length === 0) return templateValue;
    return templateValue.map((tpl, i) => {
      const av = i < aiValue.length ? aiValue[i] : undefined;
      return av === undefined ? tpl : mergeDeep(tpl, av);
    });
  }

  if (isRecord(templateValue) && isRecord(aiValue)) {
    const out: Record<string, unknown> = { ...templateValue };
    for (const k of Object.keys(templateValue)) {
      if (!(k in aiValue)) continue;
      const av = aiValue[k];
      if (av === null || av === undefined) continue;
      out[k] = mergeDeep(templateValue[k], av);
    }
    return out;
  }

  if (typeof aiValue === 'string') {
    if (typeof templateValue === 'string') {
      if (aiValue.trim() === '') return templateValue;
      return aiValue;
    }
    if (typeof templateValue === 'number') {
      const n = Number(aiValue.replace(/[^0-9.-]/g, ''));
      return Number.isFinite(n) ? n : templateValue;
    }
    return aiValue;
  }

  if (typeof aiValue === 'number' && Number.isFinite(aiValue)) {
    if (typeof templateValue === 'string') return String(aiValue);
    return aiValue;
  }

  if (typeof aiValue === 'boolean') return aiValue;

  return templateValue;
}

const IMAGE_FIELDS = new Set(['image', 'src', 'url', 'photo', 'backgroundImage', 'logo']);

function poolFor(sectionId: string): string {
  if (/team|trainer|staff/.test(sectionId)) return 'team';
  if (/work|project|portfolio|case/.test(sectionId)) return 'work';
  if (/product|menu|shop/.test(sectionId)) return 'product';
  return 'service';
}

function pickImage(imageMap: Record<string, string>, pool: string, index: number): string {
  return (
    imageMap[`${pool}-${index % 4}`] ||
    imageMap[`service-${index % 4}`] ||
    imageMap['general-0'] ||
    ''
  );
}

function fillImages(sectionId: string, deep: Record<string, unknown>, imageMap: Record<string, string>): void {
  let idx = 0;
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!isRecord(value)) return;
    for (const [k, v] of Object.entries(value)) {
      if (IMAGE_FIELDS.has(k)) {
        if (typeof v === 'string' && (v.trim() === '' || v.includes('images.unsplash.com'))) {
          value[k] = pickImage(imageMap, poolFor(sectionId), idx);
          idx++;
        }
      } else if (typeof v === 'string' && v.includes('images.unsplash.com')) {
        value[k] = pickImage(imageMap, poolFor(sectionId), idx);
        idx++;
      }
      walk(v);
    }
  };
  walk(deep);
}

// ============================================================
// Assembly — merges AI copy into a renderer-safe SiteConfig
// ============================================================
function assembleSiteConfig(opts: {
  aiSections: unknown;
  nimSite: unknown;
  templateDefault: Record<string, unknown>;
  sectionIds: string[];
  theme: Record<string, string>;
  imageMap: Record<string, string>;
  niche: string;
  description: string;
}): Record<string, unknown> {
  const { aiSections, nimSite, templateDefault, sectionIds, theme, imageMap, niche, description } = opts;

  const defaultSite = (templateDefault.site as Record<string, unknown>) || {};
  const site: Record<string, unknown> = { ...defaultSite };
  if (isRecord(nimSite)) {
    for (const k of Object.keys(site)) {
      const v = nimSite[k];
      if (typeof v === 'string' && v.trim() !== '') site[k] = v;
      else if (typeof v === 'number') site[k] = String(v);
    }
  }

  const templateSections = (templateDefault.sections as Record<string, unknown>) || {};
  const sections: Record<string, unknown> = {};

  for (const sectionId of sectionIds) {
    const tpl = templateSections[sectionId];
    if (!isRecord(tpl)) continue;
    const deep = JSON.parse(JSON.stringify(tpl)) as Record<string, unknown>;
    const aiSec = isRecord(aiSections) ? aiSections[sectionId] : undefined;
    if (isRecord(aiSec)) {
      const merged = mergeDeep(deep, aiSec) as Record<string, unknown>;
      fillImages(sectionId, merged, imageMap);
      sections[sectionId] = merged;
    } else {
      fillImages(sectionId, deep, imageMap);
      sections[sectionId] = deep;
    }
  }

  return {
    brandName: (site.brandName as string) || '',
    tagline: (site.tagline as string) || '',
    description: (site.description as string) || description || '',
    ctaPrimary: (site.ctaPrimary as string) || 'Get Started',
    ctaSecondary: (site.ctaSecondary as string) || 'Learn More',
    niche,
    theme,
    sections,
    imagePrompts: imageMap,
  };
}

// ============================================================
// Instant mode — rule-based starter site, no AI call (~ms)
// ============================================================
interface InstantService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface InstantStarter {
  brandName: string;
  tagline: string;
  heroTitle: string;
  services: InstantService[];
}

function titleCaseWords(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'in', 'on', 'of', 'for', 'and', 'is', 'small', 'my', 'our', 'we', 'you']);

function wordsFromDescription(description: string, count: number): string[] {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return words.slice(0, count);
}

/**
 * Small curated start-packs for common niches so instant mode
 * produces believable, on-topic content instead of generic filler.
 */
const NICHES: Record<string, InstantStarter> = {
  bakery: {
    brandName: 'Golden Crust Bakery',
    tagline: 'Freshly baked every morning',
    heroTitle: 'Baked fresh, every single morning',
    services: [
      { id: 'artisan-bread', title: 'Artisan Breads', description: 'Slow-fermented loaves baked in a stone oven.', icon: 'sparkles' },
      { id: 'custom-cakes', title: 'Custom Cakes', description: 'Made-to-order cakes for every celebration.', icon: 'heart' },
      { id: 'pastries', title: 'Pastries', description: 'Butter croissants, buns, and seasonal treats.', icon: 'star' },
    ],
  },
  restaurant: {
    brandName: 'The Rustic Table',
    tagline: 'Farm-to-table dining',
    heroTitle: 'Honest food, cooked with fire',
    services: [
      { id: 'dining', title: 'Dinner Service', description: 'Seasonal tasting menus built around local farms.', icon: 'sparkles' },
      { id: 'catering', title: 'Private Catering', description: 'Family-style feasts for events and gatherings.', icon: 'truck' },
      { id: 'events', title: 'Private Events', description: 'Reserve the dining room for celebrations.', icon: 'users' },
    ],
  },
  cafe: {
    brandName: 'Morning Brew',
    tagline: 'Coffee, crafted with care',
    heroTitle: 'Slow coffee, good company',
    services: [
      { id: 'coffee', title: 'Specialty Coffee', description: 'Single-origin beans brewed to order.', icon: 'coffee' },
      { id: 'brunch', title: 'All-Day Brunch', description: 'Fresh, seasonal plates from our open kitchen.', icon: 'leaf' },
      { id: 'roasting', title: 'House Blends', description: 'Small-batch roasts available to take home.', icon: 'star' },
    ],
  },
  gym: {
    brandName: 'Iron Peak Fitness',
    tagline: 'Stronger every day',
    heroTitle: 'Train hard. Feel unstoppable.',
    services: [
      { id: 'coaching', title: 'Personal Coaching', description: 'One-on-one programming tailored to your goals.', icon: 'users' },
      { id: 'classes', title: 'Group Classes', description: 'HIIT, strength, and functional circuits daily.', icon: 'zap' },
      { id: 'nutrition', title: 'Nutrition Plans', description: 'Simple eating plans that support training.', icon: 'leaf' },
    ],
  },
  salon: {
    brandName: 'Velvet Hair Studio',
    tagline: 'Your style, refined',
    heroTitle: 'Hair that turns heads',
    services: [
      { id: 'cut', title: 'Haircuts', description: 'Precision cuts finished with a style you love.', icon: 'scissors' },
      { id: 'color', title: 'Color & Balayage', description: 'Custom shades created for your skin tone.', icon: 'palette' },
      { id: 'treatments', title: 'Treatments', description: 'Deep-repair masks and scalp therapies.', icon: 'sparkles' },
    ],
  },
  photography: {
    brandName: 'Lens & Light Studio',
    tagline: 'Capturing real moments',
    heroTitle: 'Moments, beautifully preserved',
    services: [
      { id: 'portrait', title: 'Portrait Sessions', description: 'Natural-light portraits that feel like you.', icon: 'camera' },
      { id: 'events', title: 'Event Coverage', description: 'Full-day coverage for weddings and parties.', icon: 'heart' },
      { id: 'commercial', title: 'Brand Shoots', description: 'Product and editorial imagery for your brand.', icon: 'briefcase' },
    ],
  },
  agency: {
    brandName: 'Bright Studio',
    tagline: 'We grow brands',
    heroTitle: 'Ideas that move businesses forward',
    services: [
      { id: 'strategy', title: 'Brand Strategy', description: 'Positioning, naming, and messaging that sticks.', icon: 'compass' },
      { id: 'design', title: 'Design', description: 'Identities and interfaces with real personality.', icon: 'palette' },
      { id: 'development', title: 'Development', description: 'Fast, reliable sites and web apps.', icon: 'code' },
    ],
  },
};

function deriveInstantContent(niche: string, description: string): InstantStarter {
  const lower = niche.toLowerCase();
  let pack: InstantStarter | null = null;
  if (/(bakery|baker|bread|pastr|cake|patiss)/.test(lower)) pack = NICHES.bakery;
  else if (/(restaurant|diner|bistro|eatery|grill|food|kitchen)/.test(lower)) pack = NICHES.restaurant;
  else if (/(cafe|coffee|tea|juice|smoothie)/.test(lower)) pack = NICHES.cafe;
  else if (/(gym|fitness|workout|training|crossfit|yoga|pilates)/.test(lower)) pack = NICHES.gym;
  else if (/(salon|hair|barber|spa|beaust|beaut)/.test(lower)) pack = NICHES.salon;
  else if (/(photo|photograph|camera|wedding)/.test(lower)) pack = NICHES.photography;
  else if (/(agency|studio|creative|marketing|brand|consult|design)/.test(lower)) pack = NICHES.agency;

  if (pack) return pack;

  const words = wordsFromDescription(description || niche, 2);
  const brand = words.length > 0 ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Our Business';
  return {
    brandName: brand,
    tagline: 'Quality you can trust',
    heroTitle: `Welcome to ${brand}`,
    services: [
      { id: 'core', title: 'Core Service', description: 'What we do best, done to a high standard.', icon: 'star' },
      { id: 'custom', title: 'Custom Work', description: 'Tailored solutions built around your needs.', icon: 'settings' },
      { id: 'consult', title: 'Free Consultation', description: 'Let\'s talk about what you need.', icon: 'users' },
    ],
  };
}

function buildInstantSections(starter: InstantStarter, sectionIds: string[]): Record<string, unknown> {
  const sections: Record<string, unknown> = {
    hero: { title: starter.heroTitle, subtitle: starter.tagline },
  };
  const serviceId = sectionIds.includes('services')
    ? 'services'
    : sectionIds.includes('features')
      ? 'features'
      : sectionIds.includes('benefits')
        ? 'benefits'
        : null;
  if (serviceId) {
    sections[serviceId] = {
      title: serviceId === 'services' ? 'Our Services' : 'Why Choose Us',
      subtitle: 'Everything you need, in one place',
      items: starter.services,
    };
  }
  return sections;
}

// ============================================================
// Main handler — streams real build progress to the client (SSE)
// ============================================================
function writeEvent(res: VercelResponse, event: Record<string, unknown>): void {
  try {
    if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
  } catch {
    // client may have disconnected mid-stream
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  if (req.method !== 'POST') {
    writeEvent(res, { type: 'error', message: 'Method not allowed' });
    return res.end();
  }

  const startedAt = Date.now();
  const emit = (type: string, payload: Record<string, unknown> = {}) => {
    writeEvent(res, { type, ...payload });
  };

  try {
    const { templateId, niche, palette, description, additionalInstructions } = req.body;
    const mode = (req.body.mode as string) === 'instant' ? 'instant' : 'ai';
    const priority = Boolean(req.body.priority);
    const variation = typeof req.body.variation === 'number' ? Math.floor(req.body.variation) : 0;

    const templateDef = getApiTemplate(templateId);
    if (!templateDef || !templateDef.metadata || !templateDef.defaultContent) {
      emit('error', { message: 'Template not found' });
      return res.end();
    }

    console.log(`[v2] Start: niche="${niche}", template="${templateId}", mode="${mode}"`);

    const theme = (palette?.theme as Record<string, string>) ?? {};
    const sectionIds = templateDef.metadata.sections;
    const templateDefault = templateDef.defaultContent as Record<string, unknown>;

    emit('step', { step: 'prepare', message: 'Reading your business brief…' });

    const assemble = (
      aiSections: Record<string, unknown>,
      siteFields: Record<string, unknown>,
      imageMap: Record<string, string>
    ): Record<string, unknown> => {
      emit('step', { step: 'images', message: 'Matching niche imagery…' });
      const finalConfig = assembleSiteConfig({
        aiSections,
        nimSite: siteFields,
        templateDefault,
        sectionIds,
        theme,
        imageMap,
        niche,
        description: description || '',
      });
      emit('step', { step: 'assembly', message: 'Assembling your site…' });
      return finalConfig;
    };

    // ---- Instant mode: no AI, returns in a few ms ----
    if (mode === 'instant') {
      const starter = deriveInstantContent(niche, description || '');
      const finalConfig = assemble(
        buildInstantSections(starter, sectionIds),
        {
          brandName: starter.brandName,
          tagline: starter.tagline,
          description: description || `${starter.tagline} Serving customers with care and attention.`,
          ctaPrimary: 'Get Started',
          ctaSecondary: 'Learn More',
        },
        buildCuratedImages(niche, sectionIds, variation)
      );
      emit('result', { config: finalConfig, elapsedMs: Date.now() - startedAt });
      console.log('[v2] Instant done. Sections:', Object.keys(finalConfig.sections as Record<string, unknown>));
      return res.end();
    }

    const schemaSpec = buildSchemaSpec(templateDefault);

    const userMessage = `NICHE: ${niche}
DESCRIPTION: ${description || '(no description given)'}
${additionalInstructions ? `EXTRA DIRECTION: ${additionalInstructions}` : ''}
${
  variationDirection(variation)
    ? `DIFFERENTIATION:
${variationDirection(variation)}
This is a fresh attempt — write copy clearly different from any previous version: different tagline shape, different word choices, different numbers and specifics. Never reuse the exact same phrasing twice.
`
    : ''
}
BASELINE (current content — return ONLY the fields to change):
${schemaSpec}`;

    emit('step', { step: 'connect', message: 'Contacting the AI provider…' });

    let writtenChars = 0;
    let lastTokenEmit = 0;

    const { source, content } = await callContentAI(SYSTEM_PROMPT, userMessage, {
      temperature: variation ? 0.9 : 0.8,
      maxTokens: OUTPUT_TOKEN_BUDGET,
      priority,
      onToken: (delta) => {
        writtenChars += delta.length;
        const now = Date.now();
        if (now - lastTokenEmit >= 250) {
          lastTokenEmit = now;
          emit('progress', {
            step: 'writing',
            message: `Writing your copy… ${writtenChars} characters, ${Math.round((now - startedAt) / 1000)}s`,
            chars: writtenChars,
            elapsedMs: now - startedAt,
          });
        }
      },
    });
    console.log(`[v2] Content generated via "${source}"`);

    let aiSections: Record<string, unknown> | null = null;
    let siteFields: Record<string, unknown> | null = null;
    let parsedOk = false;
    try {
      const parsed = parseJsonResponse(content);
      parsedOk = true;
      if (parsed) {
        if (isRecord(parsed.sections)) aiSections = parsed.sections;
        if (isRecord(parsed.site)) siteFields = parsed.site;
      }
    } catch {
      aiSections = null;
    }

    // If the model output can't be parsed at all (truncation, weird output),
    // fall back to deterministic instant content so the build never hangs.
    // A well-formed partial edit that simply omits `sections` (i.e. "keep the
    // baseline sections") is NOT a parse failure — it keeps every default.
    if (!parsedOk) {
      console.warn(
        `[v2] AI content unparseable (${(content ?? '').length} chars): ${(content ?? '').trim().slice(0, 200)}`
      );
      const starter = deriveInstantContent(niche, description || '');
      aiSections = buildInstantSections(starter, sectionIds);
      siteFields = {
        brandName: starter.brandName,
        tagline: starter.tagline,
        description: description || `${starter.tagline} Serving customers with care and attention.`,
        ctaPrimary: 'Get Started',
        ctaSecondary: 'Learn More',
      };
    }

    const imageMap = buildCuratedImages(niche, sectionIds, variation);
    const finalConfig = assemble(aiSections ?? {}, siteFields ?? {}, imageMap);

    emit('result', { config: finalConfig, source, elapsedMs: Date.now() - startedAt });
    console.log('[v2] Done. Sections:', Object.keys(finalConfig.sections as Record<string, unknown>));
    return res.end();
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[v2] Fatal error:', detail);
    emit('error', {
      message: `Generation failed. ${detail.slice(0, 300)}`,
    });
    return res.end();
  }
}