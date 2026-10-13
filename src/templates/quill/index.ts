import { TemplateMetadata } from '../../types';

export const template: TemplateMetadata = {
  id: 'quill',
  name: 'Quill',
  category: 'Law / Professional Services',
  description: 'A dignified, trust-building template for law firms and professional advisors. Serif storytelling, deep forest green, and a formal, assured tone.',
  style: ['formal', 'trustworthy', 'serif', 'authoritative'],
  designCharacteristics: ['serif headlines', 'deep green accents', 'creamy paper background', 'formal symmetry', 'quiet luxury'],
  sections: ['hero', 'practiceAreas', 'attorneys', 'statistics', 'testimonials', 'contact'],
  theme: {
    background: '#F5F3EE',
    foreground: '#18231D',
    accent: '#2D5A47',
    muted: '#7C857E',
  },
  defaultContent: {
    site: {
      brandName: 'Quill & Cole LLP',
      tagline: 'Counsel you can count on.',
      description: 'A boutique law firm advising founders, families, and institutions on matters that matter most.',
      ctaPrimary: 'Book a Consultation',
      ctaSecondary: 'Our Practice',
    },
    sections: {
      hero: {
        title: 'Clear counsel for complex matters.',
        subtitle: 'For more than thirty years, our attorneys have guided clients through business, property, and family law with rigor and care.',
        badge: 'Established 1992',
      },
      practiceAreas: {
        title: 'Practice Areas',
        subtitle: 'Focused expertise across the matters that shape your life and business.',
        items: [
          { id: 'p1', title: 'Corporate Law', description: 'Formation, governance, contracts, and M&A for companies at every stage.', icon: 'briefcase' },
          { id: 'p2', title: 'Real Estate', description: 'Purchases, development, leasing, and title disputes handled end to end.', icon: 'building' },
          { id: 'p3', title: 'Estate Planning', description: 'Wills, trusts, and succession planning that protect your legacy.', icon: 'scroll' },
          { id: 'p4', title: 'Family Law', description: 'Divorce, custody, and mediation with discretion and empathy.', icon: 'scale' },
        ],
      },
      attorneys: {
        title: 'Our Attorneys',
        subtitle: 'Senior lawyers who take personal responsibility for your matter.',
        items: [
          { id: 'a1', name: 'Margaret Quill', role: 'Managing Partner', bio: 'Corporate and M&A specialist. 28 years of practice, led 200+ transactions.' },
          { id: 'a2', name: 'Daniel Cole', role: 'Partner, Estate Planning', bio: 'Trusts and succession advisor to several prominent family offices.' },
          { id: 'a3', name: 'Sofia Marchetti', role: 'Senior Counsel, Family Law', bio: 'Certified mediator known for resolving complex custody matters.' },
        ],
      },
      statistics: {
        title: 'A record of results',
        items: [
          { id: 's1', value: '30+', label: 'Years of practice' },
          { id: 's2', value: '2,400+', label: 'Matters resolved' },
          { id: 's3', value: '98%', label: 'Client satisfaction' },
        ],
      },
      testimonials: {
        title: 'Client Testimonials',
        items: [
          { id: 't1', quote: 'Quill & Cole negotiated terms we didn\'t know were possible. Professional, thorough, and genuinely on our side.', author: 'James Okafor', role: 'Founder, Meridian Foods' },
          { id: 't2', quote: 'They handled a delicate family matter with complete discretion and deep care.', author: 'R. Anderson', role: 'Private client' },
        ],
      },
      contact: {
        title: 'Request a Consultation',
        subtitle: 'Initial consultations are confidential and complimentary.',
        email: 'counsel@quillandcole.com',
        phone: '+1 (212) 555-0142',
        address: '7 Wall Street, Suite 400, New York, NY 10005',
      },
    },
  },
};

export const defaultContent = template.defaultContent;