export interface ThemeTokens {
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  surface?: string;
  border?: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  style: string[];
  designCharacteristics: string[];
  sections: string[];
  theme: ThemeTokens;
}

export interface TemplateDefinition {
  metadata: TemplateMetadata;
  defaultContent: Record<string, unknown>;
}

const templates: TemplateDefinition[] = [
  {
    metadata: {
      id: 'atelier',
      name: 'Atelier',
      category: 'Creative Agency / Studio',
      description: 'A warm, sophisticated template for creative agencies and design studios. Balances editorial elegance with bold visual presence.',
      style: ['editorial', 'warm', 'minimal', 'typography-driven'],
      designCharacteristics: ['asymmetric layouts', 'large typography', 'warm neutrals', 'bold accent color', 'generous whitespace'],
      sections: ['hero', 'services', 'work', 'about', 'testimonial', 'contact'],
      theme: {
        background: '#F4F1EB',
        foreground: '#111111',
        accent: '#FF5A36',
        muted: '#D9D4C8',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Atelier Studio',
        tagline: 'We shape ideas into experiences.',
        description: 'A multidisciplinary creative studio specializing in brand identity, digital design, and art direction for forward-thinking companies.',
        ctaPrimary: 'Start a Project',
        ctaSecondary: 'View Our Work',
      },
      sections: {
        hero: {
          title: 'Design is a conversation between form and purpose.',
          subtitle: 'Atelier Studio crafts brands, digital experiences, and visual identities that resonate and endure.',
          mediaType: 'image',
        },
        services: {
          title: 'What We Do',
          subtitle: 'End-to-end creative services tailored to elevate your brand.',
          items: [
            {
              id: 'svc-1',
              title: 'Brand Identity',
              description: 'We develop cohesive visual systems — from logo design and typography to color palettes and brand guidelines — that communicate your essence with clarity and personality.',
              icon: 'palette',
            },
            {
              id: 'svc-2',
              title: 'Web Design',
              description: 'Custom websites built at the intersection of aesthetics and performance. Every pixel is intentional, every interaction considered.',
              icon: 'layout',
            },
            {
              id: 'svc-3',
              title: 'Art Direction',
              description: 'From campaign concepts to photo shoots, we orchestrate visual narratives that capture attention and drive emotional connection.',
              icon: 'image',
            },
            {
              id: 'svc-4',
              title: 'Motion Design',
              description: 'Animated logos, explainer videos, and dynamic interfaces that bring static brands to life through movement and rhythm.',
              icon: 'play',
            },
          ],
        },
        work: {
          title: 'Selected Work',
          subtitle: 'A curated selection of projects we are proud of.',
          items: [
            {
              id: 'work-1',
              title: 'Meridian Wine Co.',
              category: 'Brand Identity',
              description: 'A complete rebrand for a boutique vineyard, blending heritage typography with a modern palette inspired by the Sonoma landscape.',
            },
            {
              id: 'work-2',
              title: 'Neon Circuit Festival',
              category: 'Art Direction',
              description: 'Visual identity and environmental graphics for an electronic music festival, using generative patterns and high-contrast neon palettes.',
            },
            {
              id: 'work-3',
              title: 'Lumina Health',
              category: 'Web Design',
              description: 'A wellness platform redesign focused on accessibility, calm visual language, and seamless appointment booking flows.',
            },
            {
              id: 'work-4',
              title: 'Paper & Thread',
              category: 'Brand Identity',
              description: 'Brand system for a sustainable stationery company, featuring hand-drawn letterforms and an earthy, tactile material palette.',
            },
          ],
        },
        about: {
          title: 'About Us',
          description: 'Atelier Studio was founded in 2018 with a simple belief: great design emerges from deep listening. We are a team of designers, strategists, and makers who thrive on complexity and deliver clarity. Based in Brooklyn, we work with clients across industries — from emerging startups to established cultural institutions — who share our appetite for thoughtful, courageous work.',
          values: [
            { id: 'val-1', title: 'Craft', description: 'We obsess over details because details are the design.' },
            { id: 'val-2', title: 'Honesty', description: 'We believe transparent processes lead to authentic outcomes.' },
            { id: 'val-3', title: 'Ambition', description: 'We push past safe choices to find work that truly stands apart.' },
          ],
          teamSize: 14,
          founded: 2018,
        },
        testimonial: {
          title: 'What Clients Say',
          items: [
            {
              id: 'test-1',
              quote: 'Atelier didn\'t just design our brand — they uncovered who we actually are. The process was collaborative, rigorous, and genuinely inspiring. Our new identity has transformed how clients perceive and engage with us.',
              author: 'Samantha Reyes',
              role: 'CEO, Lumina Health',
              company: 'Lumina Health',
            },
          ],
        },
        contact: {
          title: 'Let\'s Work Together',
          subtitle: 'Have a project in mind? We\'d love to hear about it.',
          email: 'hello@atelierstudio.co',
          phone: '+1 (718) 555-0192',
          address: '47 Bergen Street, Brooklyn, NY 11217',
          socialLinks: [
            { platform: 'Instagram', url: 'https://instagram.com/atelierstudio' },
            { platform: 'Dribbble', url: 'https://dribbble.com/atelierstudio' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/company/atelierstudio' },
          ],
        },
      },
    },
  },
  {
    metadata: {
      id: 'northline',
      name: 'Northline',
      category: 'SaaS / Technology',
      description: 'A clean, confidence-inspiring template for SaaS products and technology companies. Designed to build trust and drive conversions.',
      style: ['clean', 'modern', 'trust-building', 'conversion-focused'],
      designCharacteristics: ['structured grid', 'card-based layouts', 'blue accent', 'subtle gradients', 'data-friendly'],
      sections: ['hero', 'features', 'statistics', 'testimonials', 'pricing', 'cta'],
      theme: {
        background: '#FAFBFC',
        foreground: '#0F172A',
        accent: '#3B82F6',
        muted: '#94A3B8',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Northline',
        tagline: 'Project management that scales with your ambition.',
        description: 'Northline helps teams plan, track, and deliver complex projects with clarity. Built for modern product teams who refuse to let process slow them down.',
        ctaPrimary: 'Start Free Trial',
        ctaSecondary: 'Watch Demo',
      },
      sections: {
        hero: {
          title: 'Ship projects faster with your team in sync.',
          subtitle: 'Northline brings your tasks, timelines, and team communication into one fluid workspace. No more context-switching, no more missed deadlines.',
          mediaType: 'image',
          badge: 'New: AI-Powered Sprint Planning',
        },
        features: {
          title: 'Everything your team needs. Nothing it doesn\'t.',
          subtitle: 'Purpose-built features that replace your patchwork of tools.',
          items: [
            {
              id: 'feat-1',
              title: 'Smart Task Boards',
              description: 'Kanban, list, timeline, and calendar views that adapt to how your team works. Automatically surface blockers before they become problems.',
              icon: 'columns',
            },
            {
              id: 'feat-2',
              title: 'Real-Time Collaboration',
              description: 'Comment threads, @mentions, and live cursors keep everyone aligned without another status meeting.',
              icon: 'users',
            },
            {
              id: 'feat-3',
              title: 'Custom Workflows',
              description: 'Design workflows that mirror your process — from intake to delivery — with conditional automations and approval gates.',
              icon: 'git-branch',
            },
            {
              id: 'feat-4',
              title: 'Time Tracking',
              description: 'Built-in time logging tied directly to tasks and projects. Generate reports in one click for client billing or sprint retrospectives.',
              icon: 'clock',
            },
            {
              id: 'feat-5',
              title: 'Integrations',
              description: 'Connect Slack, GitHub, Figma, Notion, and 200+ other tools. Northline becomes the hub of your existing workflow.',
              icon: 'puzzle',
            },
            {
              id: 'feat-6',
              title: 'Advanced Reporting',
              description: 'Dashboards that surface project health, team velocity, and resource allocation — updated in real time from actual work data.',
              icon: 'bar-chart',
            },
          ],
        },
        statistics: {
          title: 'Trusted by high-performing teams',
          items: [
            { id: 'stat-1', value: '12,400+', label: 'Teams worldwide' },
            { id: 'stat-2', value: '99.98%', label: 'Uptime SLA' },
            { id: 'stat-3', value: '34%', label: 'Faster delivery on average' },
          ],
        },
        testimonials: {
          title: 'Hear from teams who made the switch',
          items: [
            {
              id: 'test-1',
              quote: 'We migrated from three separate tools to Northline and haven\'t looked back. Our sprint velocity improved by 28% in the first quarter alone.',
              author: 'Marcus Chen',
              role: 'VP of Engineering, Crestline',
              company: 'Crestline',
            },
            {
              id: 'test-2',
              quote: 'The custom workflows feature alone justified the switch. We finally have a tool that adapts to our process instead of forcing us into someone else\'s.',
              author: 'Priya Sharma',
              role: 'Head of Product, Vantage AI',
              company: 'Vantage AI',
            },
          ],
        },
        pricing: {
          title: 'Simple, transparent pricing',
          subtitle: 'Start free. Upgrade when you\'re ready.',
          tiers: [
            {
              id: 'tier-1',
              name: 'Starter',
              price: '0',
              period: 'forever',
              description: 'For small teams getting started.',
              features: ['Up to 10 users', '3 active projects', 'Kanban & list views', 'Basic reporting', 'Email support'],
              cta: 'Get Started Free',
              highlighted: false,
            },
            {
              id: 'tier-2',
              name: 'Professional',
              price: '12',
              period: 'per user / month',
              description: 'For growing teams that need more.',
              features: ['Unlimited users', 'Unlimited projects', 'All board views', 'Time tracking', 'Custom workflows', 'Integrations', 'Priority support'],
              cta: 'Start Free Trial',
              highlighted: true,
            },
            {
              id: 'tier-3',
              name: 'Enterprise',
              price: 'Custom',
              period: 'tailored to you',
              description: 'For organizations with complex needs.',
              features: ['Everything in Professional', 'SSO & SAML', 'Advanced permissions', 'Audit logs', 'Dedicated account manager', 'Custom SLA', 'On-premise option'],
              cta: 'Contact Sales',
              highlighted: false,
            },
          ],
        },
        cta: {
          title: 'Ready to transform how your team works?',
          subtitle: 'Join 12,400+ teams already delivering better work with Northline. Free for up to 10 users — no credit card required.',
          primaryButton: 'Start Free Trial',
          secondaryButton: 'Book a Demo',
        },
      },
    },
  },
  {
    metadata: {
      id: 'forma',
      name: 'Forma',
      category: 'Architecture / Interior Design',
      description: 'A refined, gallery-like template for architects and interior designers. Emphasizes visual storytelling through large imagery and restrained typography.',
      style: ['editorial', 'minimal', 'gallery', 'sophisticated'],
      designCharacteristics: ['full-bleed imagery', 'serif typography', 'warm neutrals', 'gold accent', 'asymmetric grids'],
      sections: ['hero', 'projects', 'about', 'services', 'contact'],
      theme: {
        background: '#F8F5F0',
        foreground: '#1A1A1A',
        accent: '#B8860B',
        muted: '#A69882',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Forma Architects',
        tagline: 'Spaces that inspire.',
        description: 'Forma Architects is a boutique architecture and interior design studio creating thoughtful, context-driven spaces across residential, commercial, and cultural projects.',
        ctaPrimary: 'View Projects',
        ctaSecondary: 'Get in Touch',
      },
      sections: {
        hero: {
          title: 'Architecture begins with listening — to the site, the light, and the people who will inhabit the space.',
          subtitle: 'Forma Architects delivers bespoke design solutions that honor context, material, and craft.',
          mediaType: 'image',
        },
        projects: {
          title: 'Selected Projects',
          subtitle: 'A selection of recent work spanning residential, hospitality, and cultural spaces.',
          items: [
            {
              id: 'proj-1',
              title: 'The Ridge House',
              category: 'Residential',
              location: 'Hudson Valley, NY',
              year: 2024,
              description: 'A cantilevered residence perched on a wooded hillside, designed to frame panoramic valley views while maintaining a deep connection to the surrounding forest canopy.',
              area: '3,200 sq ft',
            },
            {
              id: 'proj-2',
              title: 'Atelier Miro',
              category: 'Commercial',
              location: 'SoHo, New York',
              year: 2023,
              description: 'A dual-level gallery and studio space carved from a century-old cast-iron building. Exposed structural elements meet refined finishes to create a dialogue between past and present.',
              area: '5,800 sq ft',
            },
            {
              id: 'proj-3',
              title: 'Cedar & Stone Residence',
              category: 'Interior Design',
              location: 'Montauk, NY',
              year: 2024,
              description: 'A complete interior renovation of a coastal retreat, introducing warm wood tones, natural stone surfaces, and custom millwork that echo the rugged Long Island landscape.',
              area: '2,100 sq ft',
            },
            {
              id: 'proj-4',
              title: 'Canopy Public Library',
              category: 'Cultural',
              location: 'Portland, OR',
              year: 2023,
              description: 'A community library designed around the concept of a "knowledge forest" — branching timber columns support reading nooks, collaborative zones, and a central atrium filled with natural light.',
              area: '18,500 sq ft',
            },
          ],
        },
        about: {
          title: 'About Forma',
          description: 'Founded in 2015 by architects Elena Voss and David Kwan, Forma Architects was born from a shared conviction that architecture should respond to its context with intelligence and sensitivity. Our studio of 22 professionals operates from a converted warehouse in Brooklyn, where we approach each project as a unique set of spatial, cultural, and environmental conditions. We believe in material honesty, structural clarity, and the power of well-considered details to transform everyday experience.',
          founded: 2015,
          teamSize: 22,
          values: [
            { id: 'val-1', title: 'Context', description: 'Every project begins with understanding the site, the climate, and the culture it belongs to.' },
            { id: 'val-2', title: 'Material Honesty', description: 'We celebrate materials for what they are, not what they pretend to be.' },
            { id: 'val-3', title: 'Craft', description: 'Precision in detail and execution is non-negotiable.' },
          ],
        },
        services: {
          title: 'Our Services',
          subtitle: 'Comprehensive design services from concept through completion.',
          items: [
            {
              id: 'svc-1',
              title: 'Residential Architecture',
              description: 'Custom homes, renovations, and additions designed around how you live. We guide clients from site selection through construction, creating residences that are both deeply personal and enduringly crafted.',
              icon: 'home',
            },
            {
              id: 'svc-2',
              title: 'Commercial & Workplace',
              description: 'Offices, retail spaces, and hospitality environments that reflect brand identity and enhance the human experience. We design spaces where people genuinely want to spend time.',
              icon: 'building',
            },
            {
              id: 'svc-3',
              title: 'Interior Design',
              description: 'Furniture selection, material palettes, custom millwork, and spatial planning that bring architectural vision to life at the human scale.',
              icon: 'armchair',
            },
            {
              id: 'svc-4',
              title: 'Design Consultation',
              description: 'Feasibility studies, zoning analysis, and concept development for clients who need expert guidance before committing to a full design engagement.',
              icon: 'compass',
            },
          ],
        },
        contact: {
          title: 'Begin a Conversation',
          subtitle: 'Whether you have a site, a vision, or just a question — we welcome the dialogue.',
          email: 'studio@forma-architects.com',
          phone: '+1 (718) 555-0234',
          address: '128 Union Avenue, Brooklyn, NY 11211',
          socialLinks: [
            { platform: 'Instagram', url: 'https://instagram.com/formaarchitects' },
            { platform: 'Archinect', url: 'https://archinect.com/forma' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/company/formaarchitects' },
          ],
        },
      },
    },
  },
  {
    metadata: {
      id: 'local-table',
      name: 'Local Table',
      category: 'Restaurant / Cafe',
      description: 'A warm, inviting template for restaurants, cafes, and food establishments. Conveys a sense of place, craft, and hospitality.',
      style: ['warm', 'inviting', 'rustic-modern', 'storytelling'],
      designCharacteristics: ['warm tones', 'organic shapes', 'handcrafted feel', 'food-focused imagery', 'earthy palette'],
      sections: ['hero', 'menu', 'story', 'location', 'reservation'],
      theme: {
        background: '#FBF8F3',
        foreground: '#2C2420',
        accent: '#C45D3E',
        muted: '#9C8B7A',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Local Table',
        tagline: 'Seasonal. Honest. Community.',
        description: 'A farm-to-table restaurant celebrating regional ingredients, thoughtful preparation, and the simple joy of gathering around a well-set table.',
        ctaPrimary: 'Reserve a Table',
        ctaSecondary: 'View Menu',
      },
      sections: {
        hero: {
          title: 'Where every dish tells the story of the land it came from.',
          subtitle: 'Local Table is a seasonal restaurant rooted in the belief that the best meals begin in the soil, not the kitchen.',
          mediaType: 'image',
        },
        menu: {
          title: 'Our Menu',
          subtitle: 'Seasonal dishes crafted from ingredients sourced within 50 miles of our kitchen.',
          categories: [
            {
              id: 'cat-1',
              name: 'Starters',
              items: [
                { id: 'item-1', name: 'Heirloom Tomato Gazpacho', description: 'Chilled summer soup with crème fraîche, basil oil, and sourdough croutons', price: '14' },
                { id: 'item-2', name: 'Burrata & Stone Fruit', description: 'Creamy burrata, grilled peaches, arugula, aged balsamic, and candied walnuts', price: '17' },
                { id: 'item-3', name: 'Mushroom Tartine', description: 'Roasted wild mushrooms on house-baked levain with whipped ricotta and thyme', price: '15' },
                { id: 'item-4', name: 'Beet Carpaccio', description: 'Thinly sliced roasted beets, goat cheese mousse, pistachio, and citrus vinaigrette', price: '13' },
              ],
            },
            {
              id: 'cat-2',
              name: 'Mains',
              items: [
                { id: 'item-5', name: 'Pan-Seared Trout', description: 'Local rainbow trout, brown butter, fingerling potatoes, and sautéed kale', price: '32' },
                { id: 'item-6', name: 'Braised Short Rib', description: 'Twelve-hour braised beef, celery root purée, roasted root vegetables, red wine jus', price: '38' },
                { id: 'item-7', name: 'Wild Mushroom Risotto', description: 'Arborio rice, foraged chanterelles, truffle oil, aged Parmigiano-Reggiano', price: '26' },
                { id: 'item-8', name: 'Herb-Roasted Chicken', description: 'Half chicken, roasted garlic, seasonal greens, and house-made herb bread', price: '29' },
              ],
            },
            {
              id: 'cat-3',
              name: 'Desserts',
              items: [
                { id: 'item-9', name: 'Panna Cotta', description: 'Vanilla bean custard, macerated berries, and shortbread crumble', price: '12' },
                { id: 'item-10', name: 'Dark Chocolate Torte', description: 'Flourless chocolate cake, salted caramel, and espresso crème', price: '14' },
                { id: 'item-11', name: 'Apple Galette', description: 'Rustic pastry, honeycrisp apples, brown sugar, and vanilla bean ice cream', price: '13' },
              ],
            },
          ],
        },
        story: {
          title: 'Our Story',
          description: 'Local Table opened in 2019 with a simple mission: serve honest food made from ingredients we trust. Chef-owner Maria Delgado spent a decade cooking in fine dining kitchens before returning to her rural roots, determined to build a restaurant that honored the farmers, foragers, and producers of the Hudson Valley region.',
          paragraphs: [
            'Every dish on our menu begins with a conversation — with our farmers at dawn, with our foragers after rain, with our cheesemaker in the aging room. We don\'t design menus around trends; we design them around what the land offers us each week.',
            'Our kitchen is deliberately small. Our sourcing network is deliberately tight. We believe these constraints produce not limitation, but creativity — and food that genuinely tastes like where it comes from.',
          ],
          chef: {
            name: 'Maria Delgado',
            title: 'Chef & Owner',
            bio: 'Trained at the Culinary Institute of America, staged at Blue Hill at Stone Barns and Noma, returned to the Hudson Valley to cook close to home.',
          },
        },
        location: {
          title: 'Find Us',
          address: '87 Main Street, Hudson, NY 12534',
          neighborhood: 'Historic Hudson Downtown',
          hours: [
            { days: 'Monday', time: 'Closed' },
            { days: 'Tuesday – Thursday', time: '5:00 PM – 10:00 PM' },
            { days: 'Friday – Saturday', time: '5:00 PM – 11:00 PM' },
            { days: 'Sunday', time: '10:00 AM – 3:00 PM (Brunch)' },
          ],
          parking: 'Street parking available on Main and Warren Streets. Lot parking behind the building after 5 PM.',
          phone: '+1 (518) 555-0178',
        },
        reservation: {
          title: 'Reserve a Table',
          subtitle: 'We accept reservations for parties of 1–8. Walk-ins welcome at the bar.',
          phone: '+1 (518) 555-0178',
          email: 'reservations@localtable.com',
          bookingUrl: 'https://resy.com/local-table',
          notes: 'For parties larger than 8, please contact us directly for private dining options.',
        },
      },
    },
  },
  {
    metadata: {
      id: 'forge',
      name: 'Forge',
      category: 'Construction / Industrial',
      description: 'A strong, authoritative template for construction companies and industrial firms. Conveys reliability, scale, and expertise through bold layouts and grounded tones.',
      style: ['bold', 'industrial', 'authoritative', 'no-nonsense'],
      designCharacteristics: ['bold typography', 'warm industrial tones', 'structured grid', 'project photography', 'strong visual hierarchy'],
      sections: ['hero', 'services', 'projects', 'statistics', 'team', 'contact'],
      theme: {
        background: '#F0EDE8',
        foreground: '#1C1917',
        accent: '#D97706',
        muted: '#78716C',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Forge Construction',
        tagline: 'Built right. Built to last.',
        description: 'Forge Construction delivers commercial, institutional, and residential construction services with a reputation for quality craftsmanship and uncompromising safety standards.',
        ctaPrimary: 'Get a Quote',
        ctaSecondary: 'View Projects',
      },
      sections: {
        hero: {
          title: 'We build the structures that shape communities.',
          subtitle: 'From groundbreaking to ribbon-cutting, Forge Construction manages every phase with precision, transparency, and a relentless commitment to quality.',
          mediaType: 'image',
        },
        services: {
          title: 'Our Services',
          subtitle: 'Comprehensive construction solutions backed by 25 years of field experience.',
          items: [
            {
              id: 'svc-1',
              title: 'General Contracting',
              description: 'Full-scope project management from pre-construction through final inspection. We coordinate trades, manage budgets, and deliver on schedule — every time.',
              icon: 'hard-hat',
            },
            {
              id: 'svc-2',
              title: 'Pre-Construction',
              description: 'Cost estimation, value engineering, constructability reviews, and scheduling. Our pre-construction team identifies risks early and saves clients significant capital.',
              icon: 'clipboard',
            },
            {
              id: 'svc-3',
              title: 'Design-Build',
              description: 'A single point of accountability for design and construction. This integrated approach reduces timelines by 15–30% and eliminates the gaps between architect and contractor.',
              icon: 'ruler',
            },
            {
              id: 'svc-4',
              title: 'Self-Perform',
              description: 'Our in-house concrete, carpentry, and demolition teams give us direct control over critical-path work — ensuring quality and schedule certainty where it matters most.',
              icon: 'wrench',
            },
          ],
        },
        projects: {
          title: 'Featured Projects',
          subtitle: 'A selection of projects that demonstrate our range and capability.',
          items: [
            {
              id: 'proj-1',
              title: 'Hudson Valley Medical Center',
              category: 'Healthcare',
              value: '$84M',
              year: 2024,
              description: 'A 180,000 sq ft regional medical facility featuring advanced structural steel framing, seismic-resistant design, and LEED Gold certification. Completed 4 weeks ahead of schedule.',
              duration: '22 months',
            },
            {
              id: 'proj-2',
              title: 'The Ironworks Lofts',
              category: 'Mixed-Use Residential',
              value: '$42M',
              year: 2023,
              description: 'Adaptive reuse of a 1920s steel mill into 120 luxury residential units with ground-floor retail, a rooftop amenity deck, and preserved industrial heritage elements throughout.',
              duration: '18 months',
            },
            {
              id: 'proj-3',
              title: 'Cascade Logistics Hub',
              category: 'Industrial',
              value: '$67M',
              year: 2024,
              description: 'A 350,000 sq ft distribution center with automated sorting systems, cold storage integration, and 180 truck-loading bays. Designed for operational efficiency at scale.',
              duration: '14 months',
            },
          ],
        },
        statistics: {
          title: 'By the Numbers',
          items: [
            { id: 'stat-1', value: '$1.2B+', label: 'Total project value delivered' },
            { id: 'stat-2', value: '250+', label: 'Projects completed since 1999' },
            { id: 'stat-3', value: '0.8M', label: 'Safe work hours without lost time' },
          ],
        },
        team: {
          title: 'Leadership',
          subtitle: 'Experienced professionals who take personal ownership of every project.',
          members: [
            {
              id: 'team-1',
              name: 'Robert Haines',
              role: 'President & CEO',
              bio: '30 years in commercial construction. Former VP at Turner Construction. Licensed Professional Engineer.',
            },
            {
              id: 'team-2',
              name: 'Diana Morales',
              role: 'VP of Operations',
              bio: 'Oversees all field operations and project delivery. LEED AP, OSHA 500-hour certified.',
            },
            {
              id: 'team-3',
              name: 'James Whitfield',
              role: 'Director of Pre-Construction',
              bio: 'Estimating and value engineering specialist with experience across healthcare, education, and industrial sectors.',
            },
          ],
        },
        contact: {
          title: 'Let\'s Build Together',
          subtitle: 'Tell us about your project. We\'ll respond within one business day.',
          email: 'estimates@forgeconstruction.com',
          phone: '+1 (845) 555-0341',
          address: '220 Route 9, Cold Spring, NY 10516',
          socialLinks: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/company/forgeconstruction' },
            { platform: 'Instagram', url: 'https://instagram.com/forgeconstruction' },
          ],
        },
      },
    },
  },
  {
    metadata: {
      id: 'motion',
      name: 'Motion',
      category: 'Fitness / Sports',
      description: 'A high-energy, dark-mode template for gyms, fitness studios, and athletic brands. Built to motivate action with bold contrast and dynamic layouts.',
      style: ['bold', 'dark', 'energetic', 'athletic', 'high-contrast'],
      designCharacteristics: ['dark background', 'bold red accent', 'uppercase headings', 'high-contrast imagery', 'aggressive typography'],
      sections: ['hero', 'programs', 'trainers', 'testimonials', 'membership', 'contact'],
      theme: {
        background: '#0A0A0A',
        foreground: '#FAFAFA',
        accent: '#EF4444',
        muted: '#737373',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Motion Fitness',
        tagline: 'Train harder. Recover smarter.',
        description: 'Motion Fitness is a performance-driven training facility offering group classes, personal coaching, and athletic conditioning in a no-ego environment.',
        ctaPrimary: 'Join Now',
        ctaSecondary: 'View Programs',
      },
      sections: {
        hero: {
          title: 'Your strongest chapter starts here.',
          subtitle: 'Elite training. Expert coaching. A community that pushes you further than you\'d go alone.',
          mediaType: 'video',
          ctaPrimary: 'Start Free Week',
          ctaSecondary: 'Take a Tour',
        },
        programs: {
          title: 'Training Programs',
          subtitle: 'Structured programs designed by coaches, backed by science, and tested by athletes.',
          items: [
            {
              id: 'prog-1',
              title: 'Strength & Power',
              description: 'Barbell-focused program built around compound lifts — squat, bench, deadlift, and overhead press. Progressive overload with deload cycles. Perfect for building raw strength.',
              frequency: '4x per week',
              level: 'Intermediate',
            },
            {
              id: 'prog-2',
              title: 'HIIT Circuit',
              description: 'High-intensity interval training combining bodyweight movements, kettlebells, and rowing. Burns maximum calories in 45-minute sessions. All fitness levels welcome.',
              frequency: '3–5x per week',
              level: 'All Levels',
            },
            {
              id: 'prog-3',
              title: 'Athletic Conditioning',
              description: 'Sport-specific training for competitive athletes. Agility drills, plyometrics, speed work, and mobility. Built to translate directly to on-field performance.',
              frequency: '3x per week',
              level: 'Advanced',
            },
            {
              id: 'prog-4',
              title: 'Recovery & Mobility',
              description: 'Guided recovery sessions including yoga flow, foam rolling protocols, breath work, and active stretching. Essential for injury prevention and long-term performance.',
              frequency: '2x per week',
              level: 'All Levels',
            },
          ],
        },
        trainers: {
          title: 'Meet Your Coaches',
          subtitle: 'Certified professionals who lead by example.',
          items: [
            {
              id: 'trainer-1',
              name: 'Marcus Webb',
              title: 'Head Coach & Founder',
              specialties: ['Strength & Power', 'Olympic Lifting'],
              certifications: 'CSCS, USAW Level 2',
              bio: 'Former D1 football strength coach. 12 years of experience training competitive athletes and dedicated beginners alike.',
            },
            {
              id: 'trainer-2',
              name: 'Aisha Patel',
              title: 'Performance Coach',
              specialties: ['HIIT Circuit', 'Athletic Conditioning'],
              certifications: 'NASM-CPT, Precision Nutrition L1',
              bio: 'Marathon runner and CrossFit competitor. Specializes in metabolic conditioning and body composition coaching.',
            },
            {
              id: 'trainer-3',
              name: 'Daniel Ortega',
              title: 'Mobility Specialist',
              specialties: ['Recovery & Mobility', 'Injury Prevention'],
              certifications: 'FRC, Licensed Physical Therapist',
              bio: 'Doctor of Physical Therapy focused on movement quality. Helps athletes train pain-free and move better in and outside the gym.',
            },
          ],
        },
        testimonials: {
          title: 'Real Results',
          subtitle: 'Members who transformed their training and their lives.',
          items: [
            {
              id: 'test-1',
              quote: 'I\'d been going to a big-box gym for years with zero progress. In three months at Motion, I added 60 lbs to my squat and dropped two clothing sizes. The coaching here is in a different league.',
              author: 'Tyler Richardson',
              role: 'Member since 2023',
            },
            {
              id: 'test-2',
              quote: 'The Recovery & Mobility program changed everything for me. I\'m 47 and moving better than I did at 30. Daniel\'s approach to mobility is genuine, not just stretching — it\'s structural.',
              author: 'Karen Liu',
              role: 'Member since 2022',
            },
            {
              id: 'test-3',
              quote: 'Motion is the only gym where I\'ve actually stuck with a program. The community is incredibly supportive, and the coaches hold you accountable without making it feel like punishment.',
              author: 'Jordan Ellis',
              role: 'Member since 2024',
            },
          ],
        },
        membership: {
          title: 'Membership Plans',
          subtitle: 'No contracts. Cancel anytime. Your first week is on us.',
          tiers: [
            {
              id: 'tier-1',
              name: 'Essentials',
              price: '79',
              period: 'per month',
              description: 'Everything you need to get started.',
              features: ['Unlimited HIIT Circuit classes', 'Open gym access', 'Recovery & Mobility sessions', 'Motion app access', 'Onboarding assessment'],
              highlighted: false,
            },
            {
              id: 'tier-2',
              name: 'Performance',
              price: '149',
              period: 'per month',
              description: 'For members serious about results.',
              features: ['Everything in Essentials', 'Strength & Power program', 'Athletic Conditioning', '2 personal training sessions/month', 'Nutrition guidance', 'Priority class booking'],
              highlighted: true,
            },
            {
              id: 'tier-3',
              name: 'Elite',
              price: '249',
              period: 'per month',
              description: 'The full Motion experience.',
              features: ['Everything in Performance', 'Unlimited personal training', 'Custom programming', 'Body composition tracking', 'Recovery suite access', 'Guest passes (2/month)', 'Exclusive athlete events'],
              highlighted: false,
            },
          ],
        },
        contact: {
          title: 'Start Your Free Week',
          subtitle: 'Walk in, call, or book online. No commitment required.',
          email: 'info@motionfitness.com',
          phone: '+1 (312) 555-0456',
          address: '940 West Randolph Street, Chicago, IL 60607',
          hours: 'Mon–Fri 5:00 AM – 9:00 PM · Sat–Sun 7:00 AM – 5:00 PM',
          socialLinks: [
            { platform: 'Instagram', url: 'https://instagram.com/motionfitness' },
            { platform: 'YouTube', url: 'https://youtube.com/motionfitness' },
            { platform: 'TikTok', url: 'https://tiktok.com/@motionfitness' },
          ],
        },
      },
    },
  },
  {
    metadata: {
      id: 'mono',
      name: 'Mono',
      category: 'Personal Portfolio',
      description: 'A stark, minimal black-and-white template for designers, developers, and creatives. Lets the work speak through radical simplicity.',
      style: ['minimal', 'monochrome', 'typographic', 'brutalist-inspired'],
      designCharacteristics: ['strictly black and white', 'large type', 'generous negative space', 'grid-based layout', 'no decorative elements'],
      sections: ['hero', 'about', 'work', 'skills', 'experience', 'contact'],
      theme: {
        background: '#FFFFFF',
        foreground: '#000000',
        accent: '#000000',
        muted: '#888888',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Mono',
        tagline: 'Design with intent.',
        description: 'A portfolio of select projects by a product designer focused on clarity, systems thinking, and craft.',
        ctaPrimary: 'View Work',
        ctaSecondary: 'Get in Touch',
      },
      sections: {
        hero: {
          title: 'I design digital products that are clear, useful, and worth using.',
          subtitle: 'Product designer based in Berlin. Previously at Figma, now available for select projects.',
          mediaType: 'text',
        },
        about: {
          title: 'About',
          paragraphs: [
            'I\'m a product designer with eight years of experience shaping digital tools used by millions. My work sits at the intersection of systems design, interaction craft, and user psychology.',
            'I believe the best interfaces disappear. They don\'t demand attention — they earn trust through consistency, clarity, and respect for the user\'s time and intelligence.',
            'Currently based in Berlin, working independently after four years at Figma where I led design for the FigJam product line.',
          ],
        },
        work: {
          title: 'Selected Work',
          subtitle: 'A focused selection of projects I\'m proud of.',
          items: [
            {
              id: 'work-1',
              title: 'FigJam Widget System',
              category: 'Product Design',
              year: '2022',
              description: 'Designed the widget ecosystem for FigJam — including the developer SDK, widget marketplace, and permission model — enabling thousands of third-party integrations.',
              role: 'Lead Designer',
            },
            {
              id: 'work-2',
              title: 'Orbital',
              category: 'Side Project',
              year: '2023',
              description: 'A minimal habit tracker built around a single idea: visualize your consistency as an orbit. Shipped to 12,000+ users in the first month.',
              role: 'Design & Development',
            },
            {
              id: 'work-3',
              title: 'Mono Type Specimen',
              category: 'Typography',
              year: '2024',
              description: 'An interactive type specimen for a variable font I designed. Explores axes of weight, width, and optical size through real-time manipulation.',
              role: 'Type Design & Development',
            },
            {
              id: 'work-4',
              title: 'Meridian Design System',
              category: 'Design Systems',
              year: '2021',
              description: 'Built and maintained the component library and design tokens for Meridian\'s B2B platform, serving 40+ designers and 200+ engineers.',
              role: 'Systems Designer',
            },
            {
              id: 'work-5',
              title: 'Weather Journal',
              category: 'App Design',
              year: '2024',
              description: 'A reflective daily app that pairs weather data with mood tracking and journaling. Designed for people who want to understand their patterns over time.',
              role: 'Design & Development',
            },
          ],
        },
        skills: {
          title: 'Skills & Tools',
          categories: [
            {
              id: 'cat-1',
              name: 'Design',
              items: ['Product Design', 'UI/UX', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design', 'Visual Design'],
            },
            {
              id: 'cat-2',
              name: 'Development',
              items: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript', 'Framer Motion', 'SVG Animation'],
            },
            {
              id: 'cat-3',
              name: 'Tools',
              items: ['Figma', 'Framer', 'Linear', 'VS Code', 'Blender', 'After Effects'],
            },
            {
              id: 'cat-4',
              name: 'Disciplines',
              items: ['Typography', 'Design Systems', 'Brand Identity', 'Motion Design', 'Accessibility'],
            },
          ],
        },
        experience: {
          title: 'Experience',
          items: [
            {
              id: 'exp-1',
              company: 'Independent',
              role: 'Product Designer',
              period: '2024 – Present',
              description: 'Select projects in product design, type design, and interactive media. Clients include early-stage startups and cultural institutions.',
            },
            {
              id: 'exp-2',
              company: 'Figma',
              role: 'Product Designer',
              period: '2020 – 2024',
              description: 'Led design for FigJam\'s widget platform, collaborated on core editor features, and contributed to the Figma design system.',
            },
            {
              id: 'exp-3',
              company: 'Meridian',
              role: 'Senior Designer',
              period: '2018 – 2020',
              description: 'Built and scaled the design system from 20 to 200+ components. Led the redesign of the core B2B dashboard, improving task completion rate by 34%.',
            },
          ],
        },
        contact: {
          title: 'Let\'s Talk',
          subtitle: 'Currently accepting select projects for Q2 2025.',
          email: 'hello@mono.design',
          socialLinks: [
            { platform: 'Twitter', url: 'https://twitter.com/monodesign' },
            { platform: 'Dribbble', url: 'https://dribbble.com/monodesign' },
            { platform: 'GitHub', url: 'https://github.com/monodesign' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/monodesign' },
          ],
        },
      },
    },
  },
  {
    metadata: {
      id: 'commerce',
      name: 'Commerce',
      category: 'Product / E-commerce',
      description: 'A premium, conversion-optimized template for product brands and e-commerce stores. Balances brand storytelling with clear purchase pathways.',
      style: ['premium', 'clean', 'conversion-focused', 'brand-forward'],
      designCharacteristics: ['product-centric layouts', 'purple accent', 'card-based products', 'trust signals', 'clean product grids'],
      sections: ['hero', 'products', 'benefits', 'testimonials', 'story', 'cta'],
      theme: {
        background: '#FAFAF9',
        foreground: '#1C1917',
        accent: '#7C3AED',
        muted: '#A1A1AA',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Commerce',
        tagline: 'Designed for everyday. Built to last.',
        description: 'Commerce creates premium everyday essentials — thoughtfully designed, responsibly made, and guaranteed for life.',
        ctaPrimary: 'Shop Now',
        ctaSecondary: 'Our Story',
      },
      sections: {
        hero: {
          title: 'Essentials that earn their place in your life.',
          subtitle: 'Every Commerce product is designed to solve a real problem, made from materials that age beautifully, and backed by a lifetime guarantee.',
          mediaType: 'image',
          badge: 'New Collection — Spring 2025',
        },
        products: {
          title: 'Our Products',
          subtitle: 'Curated essentials. No filler. No compromise.',
          items: [
            {
              id: 'prod-1',
              name: 'The Everyday Wallet',
              price: '89',
              description: 'Full-grain leather bifold with RFID shielding. Slim profile holds 8 cards and cash without the bulk. Develops a rich patina over time.',
              category: 'Accessories',
              badge: 'Best Seller',
            },
            {
              id: 'prod-2',
              name: 'The Commuter Bag',
              price: '245',
              description: 'Waxed canvas messenger with reinforced seams and a padded laptop sleeve. Designed for daily use in all weather. Water-resistant zippers throughout.',
              category: 'Bags',
              badge: 'New',
            },
            {
              id: 'prod-3',
              name: 'The Field Notebook',
              price: '32',
              description: 'Archival-grade paper, lay-flat binding, and a waterproof cover. 160 pages of dot-grid sheets for notes, sketches, and plans that won\'t bleed through.',
              category: 'Stationery',
            },
            {
              id: 'prod-4',
              name: 'The Camp Mug',
              price: '48',
              description: 'Double-walled titanium mug that holds 12 oz. Keeps coffee hot for 2 hours. Collapsible handle, dishwasher safe. The last mug you\'ll ever buy.',
              category: 'Drinkware',
            },
          ],
        },
        benefits: {
          title: 'Why Commerce',
          subtitle: 'We believe everyday objects should be extraordinary.',
          items: [
            {
              id: 'ben-1',
              title: 'Lifetime Guarantee',
              description: 'Every product is backed by our unconditional lifetime guarantee. If it breaks, we fix it or replace it — no questions asked, no receipt needed.',
              icon: 'shield',
            },
            {
              id: 'ben-2',
              title: 'Responsibly Sourced',
              description: 'Full supply chain transparency. We partner exclusively with suppliers who meet our standards for fair labor, environmental stewardship, and material quality.',
              icon: 'leaf',
            },
            {
              id: 'ben-3',
              title: 'Free Shipping & Returns',
              description: 'Complimentary shipping on every order. Hassle-free 60-day returns with prepaid labels. We want you to love what you buy — or send it back.',
              icon: 'truck',
            },
            {
              id: 'ben-4',
              title: 'Designed to Last',
              description: 'We engineer products for decades, not seasons. Premium materials, reinforced construction, and timeless design mean you buy once and forget about replacements.',
              icon: 'clock',
            },
          ],
        },
        testimonials: {
          title: 'What Our Customers Say',
          items: [
            {
              id: 'test-1',
              quote: 'I bought the Everyday Wallet three years ago and it looks better now than the day it arrived. The leather has this incredible patina. I\'ve gifted it to four people since.',
              author: 'Elena Torres',
              role: 'Customer since 2022',
            },
            {
              id: 'test-2',
              quote: 'The Commuter Bag survived a full year of NYC subway commuting, rain, snow, and being shoved under train seats. Not a single seam has given out. This is what quality means.',
              author: 'James Kowalski',
              role: 'Customer since 2023',
            },
          ],
        },
        story: {
          title: 'Our Story',
          description: 'Commerce was started in 2021 by two industrial designers frustrated with disposable products that fell apart after a season. We asked a simple question: why can\'t everyday objects be made with the same care as heirloom furniture?',
          paragraphs: [
            'We spent two years developing our first product — the Everyday Wallet — testing 47 leather samples and 12 thread types before finding materials that met our durability standards.',
            'Today, we serve over 80,000 customers in 40 countries. We\'re still a small team of 12, and we still test every new product ourselves before it ships. Our guarantee isn\'t a marketing gesture — it\'s a promise we built the business around.',
          ],
          founded: 2021,
          customers: '80,000+',
          countries: 40,
        },
        cta: {
          title: 'Your first order ships free.',
          subtitle: 'Experience the difference that thoughtful design and honest materials make. Backed by our lifetime guarantee.',
          primaryButton: 'Shop the Collection',
          secondaryButton: 'Read Our Story',
        },
      },
    },
  },
  {
    metadata: {
      id: 'heirloom',
      name: 'Heirloom',
      category: 'Florist / Botanical',
      description: 'A botanical, earthy template for florists and garden studios. Sage green palettes, organic imagery, and warm editorial layouts.',
      style: ['natural', 'organic', 'warm', 'editorial'],
      designCharacteristics: ['sage green palette', 'organic imagery', 'serif accents', 'soft editorial layouts', 'wholesome warmth'],
      sections: ['hero', 'services', 'arrangements', 'story', 'testimonials', 'contact'],
      theme: {
        background: '#FBFCF7',
        foreground: '#22301F',
        accent: '#5B7B4C',
        muted: '#94A08C',
      },
    },
    defaultContent: {
      site: {
        brandName: 'Bloom & Stem',
        tagline: 'Botanical art, grown with care.',
        description: 'An artisan florist creating hand-crafted arrangements for weddings, events, and everyday moments.',
        ctaPrimary: 'Book a Session',
        ctaSecondary: 'Our Work',
      },
      sections: {
        hero: {
          title: 'Flowers, arranged with love.',
          subtitle: 'Every stem is hand-selected and every arrangement tells a story. Voted the neighborhood\'s favorite florist for 8 years running.',
          badge: 'Rated 4.9\u2605 by 2,100+ customers',
        },
        services: {
          title: 'What We Offer',
          subtitle: 'Fresh flowers for every occasion, crafted same-day.',
          items: [
            { id: 'svc-1', title: 'Weddings', description: 'Bridal bouquets, ceremony arches, and table florals that match your vision.', icon: 'bouquet' },
            { id: 'svc-2', title: 'Events', description: 'Corporate gatherings, galas, and parties styled from concept to completion.', icon: 'sparkle' },
            { id: 'svc-3', title: 'Daily Delivery', description: 'Same-day locally grown bouquets delivered in compostable wrapping.', icon: 'truck' },
            { id: 'svc-4', title: 'Subscription', description: 'Weekly or bi-weekly arrangements that keep your home or office blooming.', icon: 'calendar' },
          ],
        },
        arrangements: {
          title: 'Featured Arrangements',
          subtitle: 'Our most-loved designs, ready to order.',
          items: [
            { id: 'arr-1', title: 'The Garden Rose', description: 'Seasonal garden roses, lisianthus, and seeded eucalyptus.', price: 'From $65' },
            { id: 'arr-2', title: 'Wild Meadow', description: 'A relaxed mix of wildflowers, grasses, and soft textural fillers.', price: 'From $55' },
            { id: 'arr-3', title: 'Parisian Chic', description: 'Blush peonies, ranunculus, and trailing jasmine in a vintage vessel.', price: 'From $85' },
          ],
        },
        story: {
          title: 'Our Story',
          description: 'Bloom & Stem began as a weekend stall at the farmers\' market with a single bucket of sunflowers and a big dream.',
        },
        testimonials: {
          title: 'Kind Words from Customers',
          items: [
            { id: 'test-1', quote: 'The wedding flowers exceeded every expectation. Bloom & Stem transformed our venue into something magical.', author: 'Emma & Liam', role: 'Wedding, June 2024' },
            { id: 'test-2', quote: 'My office subscription is the highlight of my week. Fresh, gorgeous, and always on time.', author: 'Marcus Reed', role: 'Monthly subscriber' },
          ],
        },
        contact: {
          title: 'Let\'s Create Something Beautiful',
          subtitle: 'Tell us about your event and we\'ll craft the perfect proposal.',
          email: 'hello@bloomandstem.com',
          phone: '(555) 012-3456',
        },
      },
    },
  },
  {
    metadata: {
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
            { id: 'f-1', title: 'Model Gateway', description: 'Route to 60+ models with automatic fallbacks and smart caching.', icon: 'router' },
            { id: 'f-2', title: 'Prompt Studio', description: 'Version, test, and ship prompts with production-grade tracing.', icon: 'code' },
            { id: 'f-3', title: 'Eval Engine', description: 'Score outputs against your own criteria on every release.', icon: 'gauge' },
            { id: 'f-4', title: 'Real-time Spans', description: 'Watch every call across your fleet with sub-100ms latency.', icon: 'activity' },
            { id: 'f-5', title: 'Guardrails', description: 'Schema validation and safety filters enforced before responses ship.', icon: 'shield' },
            { id: 'f-6', title: 'Edge CDN', description: 'Serve completions from the nearest of 48 global regions.', icon: 'globe' },
          ],
        },
        metrics: {
          title: 'Powering production systems',
          items: [
            { id: 'm-1', value: '2.4B', label: 'Calls / month' },
            { id: 'm-2', value: '99.99%', label: 'Uptime SLA' },
            { id: 'm-3', value: '38ms', label: 'p50 latency' },
            { id: 'm-4', value: '4,800+', label: 'Active teams' },
          ],
        },
        testimonials: {
          title: 'Loved by builders',
          items: [
            { id: 't-1', quote: 'We swapped five internal tools for Vertex and cut our AI feature timeline in half.', author: 'Aisha Rahman', role: 'CTO, Lumira' },
            { id: 't-2', quote: 'The eval engine alone is worth the price. We catch regressions before users ever do.', author: 'Noah Kim', role: 'Staff Eng, Helix' },
          ],
        },
        pricing: {
          title: 'Pricing that scales with you',
          subtitle: 'Start free, pay as you grow.',
          tiers: [
            { id: 'p-1', name: 'Hacker', price: '0', period: 'forever', description: 'For side projects and hackathons.', features: ['10k calls / month', '2 models', 'Community support'], highlighted: false, cta: 'Get Started' },
            { id: 'p-2', name: 'Pro', price: '49', period: 'per month', description: 'For teams shipping to production.', features: ['1M calls / month', 'All models', 'Prompt Studio', 'Eval engine', 'Email support'], highlighted: true, cta: 'Start Free Trial' },
            { id: 'p-3', name: 'Scale', price: 'Custom', period: 'tailored', description: 'For high-volume platforms.', features: ['Dedicated capacity', 'Custom SLAs', 'SSO & audit logs', 'Solutions engineer'], highlighted: false, cta: 'Contact Sales' },
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
  },
  {
    metadata: {
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
          subtitle: 'Shoreline connects you with the coast\'s finest properties and the market knowledge to secure them.',
          badge: '320+ homes sold last year',
        },
        listings: {
          title: 'Featured Listings',
          subtitle: 'A hand-picked selection of current waterfront opportunities.',
          items: [
            { id: 'l-1', name: 'Marlin Point Retreat', price: '1,250,000', beds: 4, baths: 3, area: '2,800 sq ft', status: 'For Sale', location: 'Marina District' },
            { id: 'l-2', name: 'Harborview Penthouse', price: '890,000', beds: 2, baths: 2, area: '1,450 sq ft', status: 'For Sale', location: 'Seaport' },
            { id: 'l-3', name: 'Dune Crest Cottage', price: '540,000', beds: 3, baths: 2, area: '1,700 sq ft', status: 'New', location: 'Beachside' },
            { id: 'l-4', name: 'Cliffwalk Modern', price: '1,980,000', beds: 5, baths: 4, area: '3,900 sq ft', status: 'For Sale', location: 'Headland' },
          ],
        },
        services: {
          title: 'What We Do',
          subtitle: 'Full-service brokerage built around your goals.',
          items: [
            { id: 's-1', title: 'Buyer Representation', description: 'From search to closing, we negotiate for your best interest at every step.', icon: 'key' },
            { id: 's-2', title: 'Seller Services', description: 'Staging, pricing strategy, and marketing that move homes in days, not months.', icon: 'home' },
            { id: 's-3', title: 'Property Management', description: 'End-to-end care for owners renting out coastal properties.', icon: 'clipboard' },
            { id: 's-4', title: 'Market Insights', description: 'Data-rich reports to help you decide when to buy, sell, or hold.', icon: 'chart' },
          ],
        },
        neighborhoods: {
          title: 'Neighborhoods We Know',
          items: [
            { id: 'n-1', name: 'Marina District', description: 'Walkable piers, sunset views, and top-rated schools.' },
            { id: 'n-2', name: 'Seaport', description: 'Bohemian cafes, lofts, and a thriving arts scene.' },
            { id: 'n-3', name: 'Beachside', description: 'Quiet streets and sand within five minutes of every door.' },
            { id: 'n-4', name: 'Headland', description: 'Clifftop estates with panoramic ocean horizons.' },
          ],
        },
        testimonials: {
          title: 'Client Stories',
          items: [
            { id: 't-1', quote: 'Shoreline found us a home we had missed entirely and negotiated below asking. Flawless.', author: 'Elena & Jake', role: 'Bought in Marina District' },
            { id: 't-2', quote: 'Our place sold in nine days. The staging and marketing were next level.', author: 'Priya Nair', role: 'Sold in Beachside' },
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
  },
  {
    metadata: {
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
            { id: 'p-1', title: 'Corporate Law', description: 'Formation, governance, contracts, and M&A for companies at every stage.', icon: 'briefcase' },
            { id: 'p-2', title: 'Real Estate', description: 'Purchases, development, leasing, and title disputes handled end to end.', icon: 'building' },
            { id: 'p-3', title: 'Estate Planning', description: 'Wills, trusts, and succession planning that protect your legacy.', icon: 'scroll' },
            { id: 'p-4', title: 'Family Law', description: 'Divorce, custody, and mediation with discretion and empathy.', icon: 'scale' },
          ],
        },
        attorneys: {
          title: 'Our Attorneys',
          subtitle: 'Senior lawyers who take personal responsibility for your matter.',
          items: [
            { id: 'a-1', name: 'Margaret Quill', role: 'Managing Partner', bio: 'Corporate and M&A specialist. 28 years of practice, led 200+ transactions.' },
            { id: 'a-2', name: 'Daniel Cole', role: 'Partner, Estate Planning', bio: 'Trusts and succession advisor to several prominent family offices.' },
            { id: 'a-3', name: 'Sofia Marchetti', role: 'Senior Counsel, Family Law', bio: 'Certified mediator known for resolving complex custody matters.' },
          ],
        },
        statistics: {
          title: 'A record of results',
          items: [
            { id: 's-1', value: '30+', label: 'Years of practice' },
            { id: 's-2', value: '2,400+', label: 'Matters resolved' },
            { id: 's-3', value: '98%', label: 'Client satisfaction' },
          ],
        },
        testimonials: {
          title: 'Client Testimonials',
          items: [
            { id: 't-1', quote: 'Quill & Cole negotiated terms we didn\'t know were possible. Professional, thorough, and genuinely on our side.', author: 'James Okafor', role: 'Founder, Meridian Foods' },
            { id: 't-2', quote: 'They handled a delicate family matter with complete discretion and deep care.', author: 'R. Anderson', role: 'Private client' },
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
  },
  {
    metadata: {
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
          subtitle: 'Walk in a client. Walk out a gentleman. Crown & Blade\'s master barbers have honed their craft for over a decade.',
          badge: 'Walk-ins welcome · 9am\u20139pm',
        },
        services: {
          title: 'Our Services',
          subtitle: 'Every service begins with a consult and ends with a hot towel.',
          items: [
            { id: 's-1', name: 'Classic Cut', price: '35', duration: '45 min', description: 'Precision scissor or clipper cut with styling.' },
            { id: 's-2', name: 'Skin Fade', price: '45', duration: '60 min', description: 'Our signature fade, sharpened to the skin.' },
            { id: 's-3', name: 'Hot Towel Shave', price: '50', duration: '50 min', description: 'Traditional straight-razor shave with steam.' },
            { id: 's-4', name: 'Beard Sculpt', price: '30', duration: '30 min', description: 'Shape, line-up, and oil finish for your beard.' },
          ],
        },
        gallery: {
          title: 'The Cutting Floor',
          subtitle: 'Recent work from the floor.',
        },
        barbers: {
          title: 'Meet the Barbers',
          items: [
            { id: 'b-1', name: 'Marco Ruiz', role: 'Master Barber', bio: '15 years behind the chair. Fading like an artist.' },
            { id: 'b-2', name: 'Devon Carter', role: 'Senior Barber', bio: 'Sharp-edge lines and razorwork specialist.' },
            { id: 'b-3', name: 'Leo Adler', role: 'Barber', bio: 'Young gun with old-school attention to detail.' },
          ],
        },
        hours: {
          title: 'Shop Hours',
          items: [
            { id: 'h-1', days: 'Monday \u2013 Friday', time: '9:00 AM \u2013 9:00 PM' },
            { id: 'h-2', days: 'Saturday', time: '8:00 AM \u2013 8:00 PM' },
            { id: 'h-3', days: 'Sunday', time: 'Closed' },
          ],
        },
        booking: {
          title: 'Claim Your Chair',
          subtitle: 'Book online in under a minute. Cancellations free up to 4 hours before.',
          phone: '+1 (415) 555-0147',
        },
      },
    },
  },
  {
    metadata: {
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
            { id: 's-1', title: 'Full Planning', description: 'Every detail from venue to send-off, handled by your dedicated planner.', icon: 'rings' },
            { id: 's-2', title: 'Design & Styling', description: 'Florals, tablescapes, and lighting crafted around one cohesive vision.', icon: 'bouquet' },
            { id: 's-3', title: 'Month-of Coordination', description: 'We take over the final 30 days so you can simply be present.', icon: 'calendar' },
            { id: 's-4', title: 'Destination Weddings', description: 'From beach vows to castle halls \u2014 we handle travel and logistics.', icon: 'plane' },
          ],
        },
        gallery: {
          title: 'Moments We\'ve Made',
          subtitle: 'A glimpse of recent celebrations.',
        },
        realWeddings: {
          title: 'Real Weddings',
          items: [
            { id: 'r-1', name: 'Maya & Arjun', location: 'Cliffside Chapel, Big Sur', details: '120 guests · garden-to-table dinner' },
            { id: 'r-2', name: 'Charlotte & Ben', location: 'The Orchard Barn, Hudson Valley', details: '180 guests · festival light finale' },
            { id: 'r-3', name: 'Sophie & Daniel', location: 'Villa Rosa, Lake Como', details: '60 guests · lakefront ceremony' },
          ],
        },
        testimonials: {
          title: 'From the Couples',
          items: [
            { id: 't-1', quote: 'Petals & Vows turned our Pinterest board into a weekend we still dream about. Worth every penny.', author: 'Maya & Arjun', role: 'Big Sur, 2024' },
            { id: 't-2', quote: 'Planners who anticipate everything. We did absolutely nothing on our wedding day.', author: 'Charlotte & Ben', role: 'Hudson Valley, 2025' },
          ],
        },
        contact: {
          title: 'Let\'s Plan Something Beautiful',
          subtitle: 'Tell us about your date, venue, and vision \u2014 we\'ll take it from there.',
          email: 'hello@petalsandvows.com',
          phone: '+1 (310) 555-0149',
        },
      },
    },
  },
  {
    metadata: {
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
            { id: 's-1', title: 'Paid Social', description: 'Meta, TikTok, and LinkedIn campaigns engineered for the click and the close.', icon: 'target' },
            { id: 's-2', title: 'SEO & Content', description: 'Compound traffic growth through search-first content and technical SEO.', icon: 'chart' },
            { id: 's-3', title: 'Creative Studio', description: 'Scroll-stopping ads, emails, and landing pages built to convert.', icon: 'palette' },
            { id: 's-4', title: 'CRO & Analytics', description: 'Test-driven optimization of your funnel from landing page to checkout.', icon: 'database' },
          ],
        },
        results: {
          title: 'Results We\'ve Earned',
          items: [
            { id: 'r-1', value: '340%', label: 'Avg. ROAS across paid clients' },
            { id: 'r-2', value: '2.1M', label: 'Visitors driven annually' },
            { id: 'r-3', value: '+61%', label: 'Organic traffic lift in 12 months' },
          ],
        },
        process: {
          title: 'Our Process',
          items: [
            { id: 'p-1', step: '01', title: 'Audit', description: 'We dig into your data, funnel, and market to find the biggest levers.' },
            { id: 'p-2', step: '02', title: 'Strategy', description: 'A 90-day growth plan with clear targets, channels, and creative briefs.' },
            { id: 'p-3', step: '03', title: 'Launch & Optimize', description: 'We ship campaigns, then test relentlessly against your KPIs.' },
            { id: 'p-4', step: '04', title: 'Scale', description: 'Double down on what works and reinvest into durable growth.' },
          ],
        },
        testimonials: {
          title: 'Clients Who Grew With Us',
          items: [
            { id: 't-1', quote: 'We went from 6x to 14x ROAS in two quarters. Boost paid for itself ten times over.', author: 'Mira Patel', role: 'CMO, Headspace Labs' },
            { id: 't-2', quote: 'The only agency that treated our budget like it was their own money.', author: 'Ryan Cole', role: 'Founder, Brewly' },
          ],
        },
        contact: {
          title: 'Ready for a Marketing Partner?',
          subtitle: 'Get a free, no-obligation audit of your current funnel \u2014 delivered in 48 hours.',
          email: 'hello@boostamp.io',
        },
      },
    },
  },
];

export function getAllApiTemplates(): TemplateDefinition[] {
  return templates;
}

export function getApiTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.metadata.id === id);
}
