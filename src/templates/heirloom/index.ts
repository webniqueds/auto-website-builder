import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'heirloom',
  name: 'Heirloom',
  category: 'Florist / Botanical',
  description: 'A soft, botanical template for florists and plant studios. Uses airy whites, sage greens, and wispy serif accents to feel fresh, organic and welcoming.',
  style: ['botanical', 'soft', 'serif', 'organic'],
  designCharacteristics: ['airy whites', 'sage green accent', 'large imagery', 'serif headings', 'rounded organic shapes'],
  sections: ['hero', 'services', 'arrangements', 'story', 'testimonials', 'contact'],
  theme: {
    background: '#FBFCF7',
    foreground: '#22301F',
    accent: '#5B7B4C',
    muted: '#94A08C',
  },
  defaultContent: {
    site: {
      brandName: 'Heirloom',
      tagline: 'Flowers, grown with care.',
      description: 'A small-batch florist and plant studio crafting seasonal arrangements from local, farm-grown blooms.',
      ctaPrimary: 'Order Flowers',
      ctaSecondary: 'Our Story',
    },
    sections: {
      hero: {
        title: 'Fresh flowers, arranged slowly and thoughtfully.',
        subtitle: 'We grow, source and hand-tie every stem from small local farms within a day of delivery.',
        badge: 'Seasonal menu now open',
      },
      services: {
        title: 'What We Offer',
        subtitle: 'Simple services for every kind of celebration.',
        items: [
          { id: 'svc-1', title: 'Weekly Bouquets', description: 'A rotating bouquet of the freshest stems of the week, delivered to your door.', icon: 'flower' },
          { id: 'svc-2', title: 'Weddings', description: 'Whimsical, garden-style florals designed around your palette and venue.', icon: 'rings' },
          { id: 'svc-3', title: 'Corporate', description: 'Low-maintenance weekly installations for lobbies, offices and events.', icon: 'briefcase' },
          { id: 'svc-4', title: 'Plant Care', description: 'Repotting, styling and long-term care for your indoor plants.', icon: 'leaf' },
        ],
      },
      arrangements: {
        title: 'Seasonal Arrangements',
        subtitle: 'This week\'s lineup, straight from the studio.',
        items: [
          { id: 'arr-1', name: 'Garden Rose Bundle', price: '65', description: 'A dozen garden roses in blush and cream, wrapped in linen.', category: 'Bouquets' },
          { id: 'arr-2', name: 'Wildflower Stem Jar', price: '48', description: 'Loose wildflower stems arranged in a vintage glass jar.', category: 'Jars' },
          { id: 'arr-3', name: 'Terracotta Companion', price: '55', description: 'A potted olive or fig paired with a vase of fresh greens.', category: 'Plants' },
          { id: 'arr-4', name: 'Evening Table Sette', price: '120', description: 'A low, lush centerpiece built for a dinner party of eight.', category: 'Table' },
        ],
      },
      story: {
        title: 'Our Studio',
        description: 'Heirloom began in a backyard cutting garden in 2016. Today we still source from the same handful of farms we started with.',
        founded: 2016,
        farms: 12,
        stems: '200k',
      },
      testimonials: {
        title: 'Kind Words',
        items: [
          { id: 't-1', quote: 'The flowers arrived looking like they were still growing in a field. Unreal quality.', author: 'Maya Chen', role: 'Wedding client' },
          { id: 't-2', quote: 'Our office flowers are the highlight of the week. Everyone stops to ask about them.', author: 'Devon Patel', role: 'Studio manager' },
        ],
      },
      contact: {
        title: 'Visit the Studio',
        subtitle: 'Walk-ins welcome Friday to Sunday, or book a consultation below.',
        email: 'hello@heirloom.studio',
        phone: '+1 (415) 555-0198',
        address: '18 Cedar Lane, Portland, OR 97204',
      },
    },
  },
};

export const defaultContent = template.defaultContent;