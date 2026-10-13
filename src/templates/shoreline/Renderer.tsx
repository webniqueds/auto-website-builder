import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage, getSectionImages } from '../../lib/images';
import { SiteCtaButton, PhoneLink, EmailLink, SiteLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_LISTINGS = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
];

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, tagline, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const listings = sections.listings as { title?: string; subtitle?: string; items?: Array<{ id: string; name: string; price: string; beds: number; baths: number; area: string; status?: string; location?: string }> } | undefined;
  const services = sections.services as { title?: string; subtitle?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const neighborhoods = sections.neighborhoods as { title?: string; items?: Array<{ id: string; name: string; description: string }> } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const contact = sections.contact as { title?: string; subtitle?: string; email?: string; phone?: string; address?: string } | undefined;

  const listingImages = getSectionImages(config, 'listings', listings?.items?.length || 4, FALLBACK_LISTINGS);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.muted}20` }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Space Grotesk, sans-serif' }}>{brandName}</div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 14, fontWeight: 500, color: theme.muted }}>
          <a href="#listings" style={{ color: 'inherit', textDecoration: 'none' }}>Listings</a>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 6 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '64px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            {hero?.badge && (
              <div style={{ display: 'inline-block', backgroundColor: `${theme.accent}10`, color: theme.accent, padding: '6px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 22, letterSpacing: '0.2px' }}>
                {hero.badge}
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif' }}>
              {hero?.title}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: theme.muted, maxWidth: 460, marginBottom: 36 }}>{hero?.subtitle}</p>
            <div style={{ display: 'flex', gap: 14 }}>
              <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '15px 34px', fontSize: 15, fontWeight: 600, borderRadius: 6 }} />
              <SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.muted}40`, padding: '15px 34px', fontSize: 15, fontWeight: 600, borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 460 }}>
              <img src={getSectionImage(config, 'hero', 0, FALLBACK_LISTINGS[0])} alt="Waterfront home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -18, left: -18, backgroundColor: theme.accent, color: '#fff', padding: '16px 22px', borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>320+</div>
              <div style={{ fontSize: 11, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px' }}>Homes sold</div>
            </div>
          </div>
        </div>
      </section>

      {listings && (
        <section id="listings" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: theme.accent, marginBottom: 8 }}>Market</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif' }}>{listings.title}</h2>
              {listings.subtitle && <p style={{ fontSize: 15, color: theme.muted, marginTop: 6 }}>{listings.subtitle}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {listings.items?.map((item, i) => (
              <div key={item.id} className="tpl-card" style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${theme.muted}16`, backgroundColor: '#fff' }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={listingImages[i] || listingImages[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {item.status && (
                    <span style={{ position: 'absolute', top: 10, left: 10, backgroundColor: item.status === 'For Sale' ? theme.foreground : theme.accent, color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 5 }}>
                      {item.status}
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>${item.price}</span>
                    <span style={{ fontSize: 11, color: theme.muted }}>{item.location}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: theme.muted }}>
                    {item.beds} bd · {item.baths} ba · {item.area}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {services && (
        <section id="services" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>{services.title}</h2>
            {services.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{services.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {services.items?.map((s) => (
              <div key={s.id} className="tpl-card" style={{ padding: '28px 24px', borderRadius: 12, backgroundColor: `${theme.accent}06`, border: `1px solid ${theme.accent}15` }}>
                <div style={{ fontSize: 26, marginBottom: 18 }}>{s.icon === 'key' ? '🔑' : s.icon === 'home' ? '🏠' : s.icon === 'chart' ? '📈' : '📋'}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {neighborhoods && (
        <section className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'center', marginBottom: 48 }}>{neighborhoods.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {neighborhoods.items?.map((n, i) => (
              <div key={n.id} className="tpl-card" style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${theme.muted}16`, backgroundColor: '#fff' }}>
                <div style={{ height: 120, overflow: 'hidden' }}>
                  <img src={`https://images.unsplash.com/photo-${['1568605114967-8130f3a36994', '1477959858617-67f85cf4f1df', '1449824913935-59a10b8d2000', '1464144792291-81c8f5f5dfb3'][i % 4]}?w=300&h=140&fit=crop`} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{n.name}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: theme.muted }}>{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'center', marginBottom: 48 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ padding: 36, borderRadius: 14, backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}15` }}>
                <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 22, fontStyle: 'italic' }}>&quot;{t.quote}&quot;</p>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.author}</div>
                <div style={{ fontSize: 13, color: theme.muted }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact && (
        <section id="contact" className="tpl-section" style={{ padding: '60px 48px 90px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ backgroundColor: theme.accent, color: '#fff', borderRadius: 16, padding: '56px 48px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>{contact.title}</h2>
              {contact.subtitle && <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 24 }}>{contact.subtitle}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, opacity: 0.92 }}>
                {contact.email && <span>✉ <EmailLink email={contact.email} /></span>}
                {contact.phone && <span>☎ <PhoneLink phone={contact.phone} /></span>}
                {contact.address && <span>⌂ <SiteLink url={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address)}>{contact.address}</SiteLink></span>}
              </div>
            </div>
            <SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: '#fff', color: theme.accent, border: 'none', padding: '16px 40px', fontSize: 16, fontWeight: 700, borderRadius: 6, justifySelf: 'start' }} />
          </div>
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.muted}20` }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
        <span>{tagline}</span>
      </footer>
    </div>
  );
};

export default Renderer;