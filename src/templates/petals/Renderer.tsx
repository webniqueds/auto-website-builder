import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage, getSectionImages } from '../../lib/images';
import { SiteCtaButton, PhoneLink, EmailLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_WEDDINGS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=520&fit=crop',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&h=520&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=520&fit=crop',
];

const FALLBACK_GALLERY = [
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4911?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
];

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const services = sections.services as { title?: string; subtitle?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const gallery = sections.gallery as { title?: string; subtitle?: string } | undefined;
  const realWeddings = sections.realWeddings as { title?: string; items?: Array<{ id: string; name: string; location: string; details: string }> } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const contact = sections.contact as { title?: string; subtitle?: string; email?: string; phone?: string } | undefined;

  const weddingImages = getSectionImages(config, 'weddings', realWeddings?.items?.length || 3, FALLBACK_WEDDINGS);
  const galleryImages = getSectionImages(config, 'gallery', 4, FALLBACK_GALLERY);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', Georgia, serif" }}>
      <nav style={{ padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.accent}22` }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.2px' }}>{brandName}</div>
        <div style={{ display: 'flex', gap: 30, alignItems: 'center', fontSize: 14, fontWeight: 500, color: theme.muted }}>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#weddings" style={{ color: 'inherit', textDecoration: 'none' }}>Real Weddings</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 999 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '70px 48px 60px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        {hero?.badge && (
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: theme.accent, marginBottom: 18 }}>{hero.badge}</div>
        )}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-1px', maxWidth: 680, margin: '0 auto 22px' }}>
          {hero?.title}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: theme.muted, maxWidth: 480, margin: '0 auto 40px' }}>{hero?.subtitle}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 56 }}>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '15px 36px', fontSize: 15, fontWeight: 600, borderRadius: 999 }} /><SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.accent}44`, padding: '15px 36px', fontSize: 15, fontWeight: 600, borderRadius: 999 }} />
        </div>
        <div style={{ width: '100%', maxWidth: 860, height: 420, margin: '0 auto', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(217,139,166,0.25)' }}>
          <img src={getSectionImage(config, 'hero', 0, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=860&h=420&fit=crop')} alt="Wedding celebration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {services && (
        <section id="services" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, marginBottom: 8 }}>{services.title}</h2>
            {services.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{services.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {services.items?.map((s) => (
              <div key={s.id} className="tpl-card" style={{ padding: '30px 26px', borderRadius: 14, backgroundColor: '#fff', border: `1px solid ${theme.accent}18`, textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 16 }}>{s.icon === 'rings' ? '💍' : s.icon === 'bouquet' ? '💐' : s.icon === 'calendar' ? '🗓' : '✈️'}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {gallery && (
        <section className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>{gallery.title}</h2>
          {gallery.subtitle && <p style={{ fontSize: 15, color: theme.muted, textAlign: 'center', marginBottom: 32 }}>{gallery.subtitle}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {galleryImages.map((src, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', height: 220 }}>
                <img src={src} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {realWeddings && (
        <section id="weddings" className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, textAlign: 'center', marginBottom: 40 }}>{realWeddings.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {realWeddings.items?.map((w, i) => (
              <div key={w.id} className="tpl-card" style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${theme.accent}18`, backgroundColor: '#fff' }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={weddingImages[i] || weddingImages[0]} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '22px 24px 26px' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>{w.name}</div>
                  <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, margin: '4px 0 8px' }}>{w.location}</div>
                  <div style={{ fontSize: 13.5, color: theme.muted }}>{w.details}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, textAlign: 'center', marginBottom: 40 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ padding: 34, borderRadius: 14, backgroundColor: '#fff', border: `1px solid ${theme.accent}18` }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>&quot;{t.quote}&quot;</p>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.author}</div>
                <div style={{ fontSize: 13, color: theme.muted }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact && (
        <section id="contact" className="tpl-section" style={{ padding: '60px 48px 80px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ padding: '56px 48px', borderRadius: 18, backgroundColor: `${theme.accent}0D`, border: `1px solid ${theme.accent}22` }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 600, marginBottom: 10 }}>{contact.title}</h2>
            {contact.subtitle && <p style={{ fontSize: 15, color: theme.muted, marginBottom: 24 }}>{contact.subtitle}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, color: theme.accent, fontWeight: 600, fontSize: 14, marginBottom: 28 }}>
              {contact.email && <span><EmailLink email={contact.email} /></span>}
              {contact.phone && <span><PhoneLink phone={contact.phone} /></span>}
            </div>
            <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '15px 40px', fontSize: 15, fontWeight: 600, borderRadius: 999 }} />
          </div>
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'center', borderTop: `1px solid ${theme.accent}22` }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Renderer;