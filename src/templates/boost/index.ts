import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'boost',
  name: 'Boost',
  category: 'Marketing / Agency',
  description: 'A high-octane template for marketing and growth agencies. Electric lime on deep blue, punchy type, and proof-heavy sections that sell results.',
  style: ['energetic', 'playful', 'modern', 'conversion-focused'],
  designCharacteristics: ['electric lime & blue palette', 'bold type', 'playful shapes', 'results-first', 'high contrast'],
  sections: ['hero', 'services', 'results', 'process', 'testimonials', 'contact'],
  theme: {
    background: '#0E1832',
    foreground: '#F8FAFC',
    accent: '#D8FF3E',
    muted: '#8FA0BF',
  },
  defaultContent: {
    site: {
      brandName: 'Boost&',
      tagline: 'Marketing that moves the numbers.',
      description: 'A full-funnel growth agency helping brands turn attention into revenue with paid media, SEO, and creative.',
      ctaPrimary: 'Get a Free Audit',
      ctaSecondary: 'See Our Work',
    },
    sections: {
      hero: {
        title: 'Stop guessing. Start growing.',
        subtitle: 'We build, launch, and scale marketing machines that deliver measurable revenue \u2014 not vanity metrics.',
        badge: 'Average client ROI · 4.2x',
      },
      services: {
        title: 'What We Do',
        items: [
          { id: 's1', title: 'Paid Social', description: 'Meta, TikTok, and LinkedIn campaigns engineered for the click and the close.', icon: 'target' },
          { id: 's2', title: 'SEO & Content', description: 'Compound traffic growth through search-first content and technical SEO.', icon: 'chart' },
          { id: 's3', title: 'Creative Studio', description: 'Scroll-stopping ads, emails, and landing pages built to convert.', icon: 'palette' },
          { id: 's4', title: 'CRO & Analytics', description: 'Test-driven optimization of your funnel from landing page to checkout.', icon: 'database' },
        ],
      },
      results: {
        title: 'Results We\'ve Earned',
        items: [
          { id: 'r1', value: '340%', label: 'Avg. ROAS across paid clients' },
          { id: 'r2', value: '2.1M', label: 'Visitors driven annually' },
          { id: 'r3', value: '+61%', label: 'Organic traffic lift in 12 months' },
        ],
      },
      process: {
        title: 'Our Process',
        items: [
          { id: 'p1', step: '01', title: 'Audit', description: 'We dig into your data, funnel, and market to find the biggest levers.' },
          { id: 'p2', step: '02', title: 'Strategy', description: 'A 90-day growth plan with clear targets, channels, and creative briefs.' },
          { id: 'p3', step: '03', title: 'Launch & Optimize', description: 'We ship campaigns, then test relentlessly against your KPIs.' },
          { id: 'p4', step: '04', title: 'Scale', description: 'Double down on what works and reinvest into durable growth.' },
        ],
      },
      testimonials: {
        title: 'Clients Who Grew With Us',
        items: [
          { id: 't1', quote: 'We went from 6x to 14x ROAS in two quarters. Boost paid for itself ten times over.', author: 'Mira Patel', role: 'CMO, Headspace Labs' },
          { id: 't2', quote: 'The only agency that treated our budget like it was their own money.', author: 'Ryan Cole', role: 'Founder, Brewly' },
        ],
      },
      contact: {
        title: 'Ready for a Marketing Partner?',
        subtitle: 'Get a free, no-obligation audit of your current funnel \u2014 delivered in 48 hours.',
        email: 'hello@boostamp.io',
      },
    },
  },
};

export const defaultContent = template.defaultContent;