import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'petals',
  name: 'Petals',
  category: 'Weddings / Events',
  description: 'A soft, romantic template for wedding planners and event designers. Blush florals, airy whites, and an elegant editorial rhythm.',
  style: ['romantic', 'elegant', 'airy', 'editorial'],
  designCharacteristics: ['blush pink palette', 'airy whites', 'script accents', 'soft imagery', 'zenithal spacing'],
  sections: ['hero', 'services', 'gallery', 'realWeddings', 'testimonials', 'contact'],
  theme: {
    background: '#FDF9F6',
    foreground: '#4A3A3A',
    accent: '#D98BA6',
    muted: '#A48B8B',
  },
  defaultContent: {
    site: {
      brandName: 'Petals & Vows',
      tagline: 'Weddings, designed with heart.',
      description: 'Full-service wedding and event planning for couples who want every detail to feel effortless and entirely their own.',
      ctaPrimary: 'Plan With Us',
      ctaSecondary: 'View Portfolio',
    },
    sections: {
      hero: {
        title: 'Your love story, beautifully planned.',
        subtitle: 'From the first consult to the final dance, Petals & Vows designs celebrations as unique as the two of you.',
        badge: '200+ weddings designed since 2014',
      },
      services: {
        title: 'What We Plan',
        subtitle: 'Pick a package, or let us weave a custom plan around your day.',
        items: [
          { id: 's1', title: 'Full Planning', description: 'Every detail from venue to send-off, handled by your dedicated planner.', icon: 'rings' },
          { id: 's2', title: 'Design & Styling', description: 'Florals, tablescapes, and lighting crafted around one cohesive vision.', icon: 'bouquet' },
          { id: 's3', title: 'Month-of Coordination', description: 'We take over the final 30 days so you can simply be present.', icon: 'calendar' },
          { id: 's4', title: 'Destination Weddings', description: 'From beach vows to castle halls \u2014 we handle travel and logistics.', icon: 'plane' },
        ],
      },
      gallery: {
        title: 'Moments We\'ve Made',
        subtitle: 'A glimpse of recent celebrations.',
      },
      realWeddings: {
        title: 'Real Weddings',
        items: [
          { id: 'r1', name: 'Maya & Arjun', location: 'Cliffside Chapel, Big Sur', details: '120 guests \u00b7 garden-to-table dinner' },
          { id: 'r2', name: 'Charlotte & Ben', location: 'The Orchard Barn, Hudson Valley', details: '180 guests \u00b7 festival light finale' },
          { id: 'r3', name: 'Sophie & Daniel', location: 'Villa Rosa, Lake Como', details: '60 guests \u00b7 lakefront ceremony' },
        ],
      },
      testimonials: {
        title: 'From the Couples',
        items: [
          { id: 't1', quote: 'Petals & Vows turned our Pinterest board into a weekend we still dream about. Worth every penny.', author: 'Maya & Arjun', role: 'Big Sur, 2024' },
          { id: 't2', quote: 'Planners who anticipate everything. We did absolutely nothing on our wedding day.', author: 'Charlotte & Ben', role: 'Hudson Valley, 2025' },
        ],
      },
      contact: {
        title: 'Let\'s Plan Something Beautiful',
        subtitle: 'Tell us about your date, venue, and vision \u2014 we\u2019ll take it from there.',
        email: 'hello@petalsandvows.com',
        phone: '+1 (310) 555-0149',
      },
    },
  },
};

export const defaultContent = template.defaultContent;