import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage, getSectionImages } from '../../lib/images';
import { SiteCtaButton, PhoneLink, EmailLink, SiteLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_ARRANGEMENTS = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=400&fit=crop',
];

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, tagline, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const services = sections.services as { title?: string; subtitle?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const arrangements = sections.arrangements as { title?: string; subtitle?: string; items?: Array<{ id: string; name: string; price: string; description: string; category?: string }> } | undefined;
  const story = sections.story as { title?: string; description?: string; founded?: number; farms?: number; stems?: string } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const contact = sections.contact as { title?: string; subtitle?: string; email?: string; phone?: string; address?: string } | undefined;

  const arrangementImages = getSectionImages(config, 'arrangements', arrangements?.items?.length || 4, FALLBACK_ARRANGEMENTS);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{brandName}</div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 14, fontWeight: 500, color: theme.muted }}>
          <a href="#arrangements" style={{ color: 'inherit', textDecoration: 'none' }}>Arrangements</a>
          <a href="#story" style={{ color: 'inherit', textDecoration: 'none' }}>Our Story</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 9999 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '56px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            {hero?.badge && (
              <div style={{ display: 'inline-block', backgroundColor: `${theme.accent}10`, color: theme.accent, padding: '6px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                {hero.badge}
              </div>
            )}
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 20 }}>
              {hero?.title}
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: theme.muted, maxWidth: 440, marginBottom: 32 }}>
              {hero?.subtitle}
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '14px 32px', fontSize: 15, fontWeight: 600, borderRadius: 9999 }} />
              <SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.muted}45`, padding: '14px 32px', fontSize: 15, fontWeight: 600, borderRadius: 9999 }} />
            </div>
          </div>
          <div style={{ borderRadius: '40% 40% 12px 12px', overflow: 'hidden', height: 460 }}>
            <img
              src={getSectionImage(config, 'hero', 0, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&h=460&fit=crop')}
              alt="Fresh flowers"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {services && (
        <section className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 500, marginBottom: 8 }}>{services.title}</h2>
            {services.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{services.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {services.items?.map((s) => (
              <div key={s.id} className="tpl-card" style={{ textAlign: 'center', padding: '36px 24px', borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${theme.muted}18` }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: `${theme.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>
                  🌿
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: theme.muted }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {arrangements && (
        <section id="arrangements" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 500, marginBottom: 8 }}>{arrangements.title}</h2>
            {arrangements.subtitle && <p style={{ fontSize: 15, color: theme.muted, maxWidth: 480 }}>{arrangements.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {arrangements.items?.map((item, i) => (
              <div key={item.id} className="tpl-card" style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', border: `1px solid ${theme.muted}18` }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={arrangementImages[i] || arrangementImages[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 20 }}>
                  {item.category && <div style={{ fontSize: 11, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{item.category}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 600 }}>{item.name}</h3>
                    <span style={{ fontSize: 15, fontWeight: 700, color: theme.accent }}>${item.price}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: theme.muted }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {story && (
        <section id="story" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', height: 380 }}>
            <img src={getSectionImage(config, 'story', 0, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=380&fit=crop')} alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 500, marginBottom: 16 }}>{story.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: theme.muted, marginBottom: 32 }}>{story.description}</p>
            <div style={{ display: 'flex', gap: 40 }}>
              {story.founded && <div><div style={{ fontSize: 26, fontWeight: 700 }}>{story.founded}</div><div style={{ fontSize: 12, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Founded</div></div>}
              {story.farms && <div><div style={{ fontSize: 26, fontWeight: 700 }}>{story.farms}</div><div style={{ fontSize: 12, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Partner farms</div></div>}
              {story.stems && <div><div style={{ fontSize: 26, fontWeight: 700 }}>{story.stems}</div><div style={{ fontSize: 12, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Stems / year</div></div>}
            </div>
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '90px 48px', backgroundColor: `${theme.accent}08`, maxWidth: 1200, margin: '0 auto', borderRadius: 28 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 500, textAlign: 'center', marginBottom: 48 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, border: `1px solid ${theme.muted}15` }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 44, lineHeight: 0.6, color: theme.accent, marginBottom: 14 }}>"</div>
                <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.author}</div>
                <div style={{ fontSize: 13, color: theme.muted }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact && (
        <section id="contact" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 500, marginBottom: 10 }}>{contact.title}</h2>
            {contact.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{contact.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {contact.email && <div style={{ textAlign: 'center', padding: 28, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${theme.muted}18` }}><div style={{ fontSize: 12, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Email</div><EmailLink email={contact.email || ''} style={{ fontSize: 15, fontWeight: 600 }} /></div>}
            {contact.phone && <div style={{ textAlign: 'center', padding: 28, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${theme.muted}18` }}><div style={{ fontSize: 12, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Phone</div><PhoneLink phone={contact.phone || ''} style={{ fontSize: 15, fontWeight: 600 }} /></div>}
            {contact.address && <div style={{ textAlign: 'center', padding: 28, borderRadius: 16, backgroundColor: '#fff', border: `1px solid ${theme.muted}18` }}><div style={{ fontSize: 12, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Studio</div><SiteLink url={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address || '')} style={{ fontSize: 15, fontWeight: 600 }}>{contact.address}</SiteLink></div>}
          </div>
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.muted}20` }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
        <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{tagline}</span>
      </footer>
    </div>
  );
};

export default Renderer;