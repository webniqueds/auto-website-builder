import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'shoreline',
  name: 'Shoreline',
  category: 'Real Estate / Property',
  description: 'A refined, trustworthy template for real estate agents and agencies. Deep navy seating against generous white space, with crisp listing cards and a calm, premium feel.',
  style: ['refined', 'trustworthy', 'premium', 'calm'],
  designCharacteristics: ['clean white layouts', 'deep navy accents', 'large listing photography', 'refined typography', 'structured grids'],
  sections: ['hero', 'listings', 'services', 'neighborhoods', 'testimonials', 'contact'],
  theme: {
    background: '#FFFFFF',
    foreground: '#14213D',
    accent: '#1D3557',
    muted: '#6B7280',
  },
  defaultContent: {
    site: {
      brandName: 'Shoreline Estates',
      tagline: 'Find your place by the water.',
      description: 'A boutique real estate firm specializing in waterfront homes, condos, and investment properties along the coast.',
      ctaPrimary: 'View Listings',
      ctaSecondary: 'Talk to an Agent',
    },
    sections: {
      hero: {
        title: 'Homes with a view, agents with a plan.',
        subtitle: 'Shoreline connects you with the coast\u2019s finest properties and the market knowledge to secure them.',
        badge: '320+ homes sold last year',
      },
      listings: {
        title: 'Featured Listings',
        subtitle: 'A hand-picked selection of current waterfront opportunities.',
        items: [
          { id: 'l1', name: 'Marlin Point Retreat', price: '1,250,000', beds: 4, baths: 3, area: '2,800 sq ft', status: 'For Sale', location: 'Marina District' },
          { id: 'l2', name: 'Harborview Penthouse', price: '890,000', beds: 2, baths: 2, area: '1,450 sq ft', status: 'For Sale', location: 'Seaport' },
          { id: 'l3', name: 'Dune Crest Cottage', price: '540,000', beds: 3, baths: 2, area: '1,700 sq ft', status: 'New', location: 'Beachside' },
          { id: 'l4', name: 'Cliffwalk Modern', price: '1,980,000', beds: 5, baths: 4, area: '3,900 sq ft', status: 'For Sale', location: 'Headland' },
        ],
      },
      services: {
        title: 'What We Do',
        subtitle: 'Full-service brokerage built around your goals.',
        items: [
          { id: 's1', title: 'Buyer Representation', description: 'From search to closing, we negotiate for your best interest at every step.', icon: 'key' },
          { id: 's2', title: 'Seller Services', description: 'Staging, pricing strategy, and marketing that move homes in days, not months.', icon: 'home' },
          { id: 's3', title: 'Property Management', description: 'End-to-end care for owners renting out coastal properties.', icon: 'clipboard' },
          { id: 's4', title: 'Market Insights', description: 'Data-rich reports to help you decide when to buy, sell, or hold.', icon: 'chart' },
        ],
      },
      neighborhoods: {
        title: 'Neighborhoods We Know',
        items: [
          { id: 'n1', name: 'Marina District', description: 'Walkable piers, sunset views, and top-rated schools.' },
          { id: 'n2', name: 'Seaport', description: 'Bohemian cafes, lofts, and a thriving arts scene.' },
          { id: 'n3', name: 'Beachside', description: 'Quiet streets and sand within five minutes of every door.' },
          { id: 'n4', name: 'Headland', description: 'Clifftop estates with panoramic ocean horizons.' },
        ],
      },
      testimonials: {
        title: 'Client Stories',
        items: [
          { id: 't1', quote: 'Shoreline found us a home we had missed entirely and negotiated below asking. Flawless.', author: 'Elena & Jake', role: 'Bought in Marina District' },
          { id: 't2', quote: 'Our place sold in nine days. The staging and marketing were next level.', author: 'Priya Nair', role: 'Sold in Beachside' },
        ],
      },
      contact: {
        title: 'Start a Conversation',
        subtitle: 'Book a free valuation or a first-time buyer consultation.',
        email: 'hello@shorelineestates.com',
        phone: '+1 (858) 555-0113',
        address: '420 Harbor Drive, San Diego, CA 92101',
      },
    },
  },
};

export const defaultContent = template.defaultContent;