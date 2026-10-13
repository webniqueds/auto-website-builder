import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage, getSectionImages } from '../../lib/images';
import { SiteCtaButton, PhoneLink, EmailLink, SiteLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_HEADSHOTS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
];

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, tagline, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const practiceAreas = sections.practiceAreas as { title?: string; subtitle?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const attorneys = sections.attorneys as { title?: string; subtitle?: string; items?: Array<{ id: string; name: string; role: string; bio: string }> } | undefined;
  const statistics = sections.statistics as { title?: string; items?: Array<{ id: string; value: string; label: string }> } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const contact = sections.contact as { title?: string; subtitle?: string; email?: string; phone?: string; address?: string } | undefined;

  const attorneyImages = getSectionImages(config, 'team', 3, FALLBACK_HEADSHOTS);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', Georgia, 'Times New Roman', serif" }}>
      <nav style={{ padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.2px' }}>{brandName}</div>
        <div style={{ display: 'flex', gap: 30, alignItems: 'center', fontSize: 14, fontWeight: 500, color: theme.muted }}>
          <a href="#practice" style={{ color: 'inherit', textDecoration: 'none' }}>Practice</a>
          <a href="#team" style={{ color: 'inherit', textDecoration: 'none' }}>Our Team</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 22px', fontSize: 14, fontWeight: 600, borderRadius: 4 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '60px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          {hero?.badge && (
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: theme.accent, marginBottom: 16 }}>{hero.badge}</div>
          )}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.5px', marginBottom: 20 }}>
            {hero?.title}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: theme.muted, maxWidth: 480, marginBottom: 36 }}>{hero?.subtitle}</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '14px 32px', fontSize: 15, fontWeight: 600, borderRadius: 4 }} /><SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.muted}40`, padding: '14px 32px', fontSize: 15, fontWeight: 600, borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ borderRadius: 8, overflow: 'hidden', height: 420 }}>
          <img src={getSectionImage(config, 'hero', 0, 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=420&fit=crop')} alt="Law library" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {practiceAreas && (
        <section id="practice" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 56, alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 500, marginBottom: 14 }}>{practiceAreas.title}</h2>
            {practiceAreas.subtitle && <p style={{ fontSize: 15, lineHeight: 1.8, color: theme.muted }}>{practiceAreas.subtitle}</p>}
            <div style={{ width: 48, height: 3, backgroundColor: theme.accent, marginTop: 24 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {practiceAreas.items?.map((p) => (
              <div key={p.id} className="tpl-card" style={{ padding: '28px 24px', borderRadius: 8, border: `1px solid ${theme.muted}18`, backgroundColor: '#fff' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${theme.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
                  {p.icon === 'briefcase' ? '💼' : p.icon === 'building' ? '🏛' : p.icon === 'scroll' ? '📜' : '⚖️'}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: theme.muted }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {attorneys && (
        <section id="team" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 500, marginBottom: 6 }}>{attorneys.title}</h2>
            {attorneys.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{attorneys.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {attorneys.items?.map((a, i) => (
              <div key={a.id} style={{ textAlign: 'center' }}>
                <div style={{ borderRadius: '50%', overflow: 'hidden', width: 140, height: 140, margin: '0 auto 20px' }}>
                  <img src={attorneyImages[i] || attorneyImages[0]} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, marginBottom: 10 }}>{a.role}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: theme.muted, maxWidth: 280, margin: '0 auto' }}>{a.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {statistics && (
        <section className="tpl-section" style={{ padding: '60px 48px', backgroundColor: theme.accent, color: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            {statistics.title && <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 500, marginBottom: 36, opacity: 0.9 }}>{statistics.title}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {statistics.items?.map((s) => (
                <div key={s.id}>
                  <div style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 500, textAlign: 'center', marginBottom: 44 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ padding: 32, borderRadius: 8, border: `1px solid ${theme.muted}18`, backgroundColor: '#fff' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 17, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>&quot;{t.quote}&quot;</p>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.author}</div>
                <div style={{ fontSize: 13, color: theme.muted }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact && (
        <section id="contact" className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 500, marginBottom: 10 }}>{contact.title}</h2>
              {contact.subtitle && <p style={{ fontSize: 15, color: theme.muted, marginBottom: 32 }}>{contact.subtitle}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: theme.muted }}>
                {contact.email && <span><EmailLink email={contact.email} /></span>}
                {contact.phone && <span><PhoneLink phone={contact.phone} /></span>}
                {contact.address && <span><SiteLink url={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address)}>{contact.address}</SiteLink></span>}
              </div>
            </div>
            <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '16px 40px', fontSize: 16, fontWeight: 600, borderRadius: 4, width: '100%' }} />
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