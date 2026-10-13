import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'vertex',
  name: 'Vertex',
  category: 'AI / Tech Startup',
  description: 'A dark, high-energy template for AI products and startups. Electric gradients, glass cards, and dense data-rich sections that feel fast, precise and futuristic.',
  style: ['dark', 'techy', 'gradient', 'futuristic'],
  designCharacteristics: ['near-black backgrounds', 'electric violet-blue gradient', 'glassmorphism cards', 'monospace accents', 'metric-heavy'],
  sections: ['hero', 'features', 'metrics', 'testimonials', 'pricing', 'cta'],
  theme: {
    background: '#07090F',
    foreground: '#F1F5F9',
    accent: '#7C6CFF',
    muted: '#64748B',
  },
  defaultContent: {
    site: {
      brandName: 'Vertex AI',
      tagline: 'Intelligence that ships.',
      description: 'Vertex helps product teams ship AI features faster with one API for models, evals, and observability.',
      ctaPrimary: 'Start Building',
      ctaSecondary: 'View Docs',
    },
    sections: {
      hero: {
        title: 'Give every product a superpower.',
        subtitle: 'One API to integrate, evaluate, and monitor language models across every stack you ship.',
        badge: 'v2.4 now in public beta',
      },
      features: {
        title: 'The AI stack, bundled.',
        subtitle: 'Everything between prompt and production, in one place.',
        items: [
          { id: 'f1', title: 'Model Gateway', description: 'Route to 60+ models with automatic fallbacks and smart caching.', icon: 'router' },
          { id: 'f2', title: 'Prompt Studio', description: 'Version, test, and ship prompts with production-grade tracing.', icon: 'code' },
          { id: 'f3', title: 'Eval Engine', description: 'Score outputs against your own criteria on every release.', icon: 'gauge' },
          { id: 'f4', title: 'Real-time Spans', description: 'Watch every call across your fleet with sub-100ms latency.', icon: 'activity' },
          { id: 'f5', title: 'Guardrails', description: 'Schema validation and safety filters enforced before responses ship.', icon: 'shield' },
          { id: 'f6', title: 'Edge CDN', description: 'Serve completions from the nearest of 48 global regions.', icon: 'globe' },
        ],
      },
      metrics: {
        title: 'Powering production systems',
        items: [
          { id: 'm1', value: '2.4B', label: 'Calls / month' },
          { id: 'm2', value: '99.99%', label: 'Uptime SLA' },
          { id: 'm3', value: '38ms', label: 'p50 latency' },
          { id: 'm4', value: '4,800+', label: 'Active teams' },
        ],
      },
      testimonials: {
        title: 'Loved by builders',
        items: [
          { id: 't1', quote: 'We swapped five internal tools for Vertex and cut our AI feature timeline in half.', author: 'Aisha Rahman', role: 'CTO, Lumira' },
          { id: 't2', quote: 'The eval engine alone is worth the price. We catch regressions before users ever do.', author: 'Noah Kim', role: 'Staff Eng, Helix' },
        ],
      },
      pricing: {
        title: 'Pricing that scales with you',
        subtitle: 'Start free, pay as you grow.',
        tiers: [
          { id: 'p1', name: 'Hacker', price: '0', period: 'forever', description: 'For side projects and hackathons.', features: ['10k calls / month', '2 models', 'Community support'], highlighted: false, cta: 'Get Started' },
          { id: 'p2', name: 'Pro', price: '49', period: 'per month', description: 'For teams shipping to production.', features: ['1M calls / month', 'All models', 'Prompt Studio', 'Eval engine', 'Email support'], highlighted: true, cta: 'Start Free Trial' },
          { id: 'p3', name: 'Scale', price: 'Custom', period: 'tailored', description: 'For high-volume platforms.', features: ['Dedicated capacity', 'Custom SLAs', 'SSO & audit logs', 'Solutions engineer'], highlighted: false, cta: 'Contact Sales' },
        ],
      },
      cta: {
        title: 'Ready to ship your first AI feature?',
        subtitle: 'Join 4,800+ teams building faster with Vertex. Free tier, no credit card.',
        primaryButton: 'Start Building',
        secondaryButton: 'Talk to us',
      },
    },
  },
};

export const defaultContent = template.defaultContent;