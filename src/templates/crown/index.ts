import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'crown',
  name: 'Crown',
  category: 'Barbershop / Salon',
  description: 'A bold, masculine template for barbershops and premium grooming studios. Charcoal black with gilded gold accents and a strong, heritage feel.',
  style: ['bold', 'masculine', 'luxury', 'heritage'],
  designCharacteristics: ['charcoal black backgrounds', 'gold accents', 'bold condensed display type', 'black and white photography', 'confident spacing'],
  sections: ['hero', 'services', 'gallery', 'barbers', 'hours', 'booking'],
  theme: {
    background: '#141312',
    foreground: '#F7F2E9',
    accent: '#C9A45C',
    muted: '#94897A',
  },
  defaultContent: {
    site: {
      brandName: 'Crown & Blade',
      tagline: 'Barbering done right.',
      description: 'A modern barbershop rooted in tradition. Precision cuts, classic shaves, and a chair you won\'t want to leave.',
      ctaPrimary: 'Book Your Chair',
      ctaSecondary: 'View Services',
    },
    sections: {
      hero: {
        title: 'Sharp by tradition. Sharp by craft.',
        subtitle: 'Walk in a client. Walk out a gentleman. Crown & Blade\u2019s master barbers have honed their craft for over a decade.',
        badge: 'Walk-ins welcome · 9am\u20139pm',
      },
      services: {
        title: 'Our Services',
        subtitle: 'Every service begins with a consult and ends with a hot towel.',
        items: [
          { id: 's1', name: 'Classic Cut', price: '35', duration: '45 min', description: 'Precision scissor or clipper cut with styling.' },
          { id: 's2', name: 'Skin Fade', price: '45', duration: '60 min', description: 'Our signature fade, sharpened to the skin.' },
          { id: 's3', name: 'Hot Towel Shave', price: '50', duration: '50 min', description: 'Traditional straight-razor shave with steam.' },
          { id: 's4', name: 'Beard Sculpt', price: '30', duration: '30 min', description: 'Shape, line-up, and oil finish for your beard.' },
        ],
      },
      gallery: {
        title: 'The Cutting Floor',
        subtitle: 'Recent work from the floor.',
      },
      barbers: {
        title: 'Meet the Barbers',
        items: [
          { id: 'b1', name: 'Marco Ruiz', role: 'Master Barber', bio: '15 years behind the chair. Fading like an artist.' },
          { id: 'b2', name: 'Devon Carter', role: 'Senior Barber', bio: 'Sharp-edge lines and razorwork specialist.' },
          { id: 'b3', name: 'Leo Adler', role: 'Barber', bio: 'Young gun with old-school attention to detail.' },
        ],
      },
      hours: {
        title: 'Shop Hours',
        items: [
          { id: 'h1', days: 'Monday \u2013 Friday', time: '9:00 AM \u2013 9:00 PM' },
          { id: 'h2', days: 'Saturday', time: '8:00 AM \u2013 8:00 PM' },
          { id: 'h3', days: 'Sunday', time: 'Closed' },
        ],
      },
      booking: {
        title: 'Claim Your Chair',
        subtitle: 'Book online in under a minute. Cancellations free up to 4 hours before.',
        phone: '+1 (415) 555-0147',
      },
    },
  },
};

export const defaultContent = template.defaultContent;