import React from 'react';
import { SiteConfig } from '../../types';
import { SiteCtaButton, EmailLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const LIME = '#D8FF3E';
const NAVY = '#0E1832';

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const services = sections.services as { title?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const results = sections.results as { title?: string; items?: Array<{ id: string; value: string; label: string }> } | undefined;
  const process = sections.process as { title?: string; items?: Array<{ id: string; step: string; title: string; description: string }> } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const contact = sections.contact as { title?: string; subtitle?: string; email?: string } | undefined;

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
          {brandName}
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 14, fontWeight: 600, color: theme.muted }}>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#results" style={{ color: 'inherit', textDecoration: 'none' }}>Results</a>
          <a href="#process" style={{ color: 'inherit', textDecoration: 'none' }}>Process</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: LIME, color: NAVY, border: 'none', padding: '11px 24px', fontSize: 14, fontWeight: 800, borderRadius: 999 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '72px 48px 40px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {hero?.badge && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: `${LIME}18`, color: LIME, padding: '8px 18px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME }} />
            {hero.badge}
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(42px, 7vw, 84px)', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-2px', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", maxWidth: 720, marginBottom: 22 }}>
          {hero?.title?.split(' ').map((w, i) =>
            i === 0 ? <span key={i}>{w} </span> : <span key={i} style={{ color: LIME }}>{w} </span>
          )}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: theme.muted, maxWidth: 520, textAlign: 'center', marginBottom: 36 }}>{hero?.subtitle}</p>
        <div style={{ display: 'flex', gap: 14 }}>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: LIME, color: NAVY, border: 'none', padding: '15px 36px', fontSize: 15, fontWeight: 800, borderRadius: 999, boxShadow: '0 10px 32px rgba(216,255,62,0.25)' }} />
          <SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.muted}55`, padding: '15px 36px', fontSize: 15, fontWeight: 700, borderRadius: 999 }} />
        </div>
      </section>

      {services && (
        <section id="services" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', fontFamily: "'Space Grotesk', sans-serif" }}>{services.title}</h2>
            <div style={{ fontSize: 14, color: theme.muted }}>4 core services, one growth partner</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            {services.items?.map((s, i) => (
              <div key={s.id} className="tpl-card" style={{ padding: 28, borderRadius: 16, backgroundColor: i === 0 ? LIME : '#fff', color: i === 0 ? NAVY : theme.foreground, gridRow: i === 3 ? '2 / 3' : 'auto', gridColumn: i === 3 ? '2 / 4' : 'auto' }}>
                <div style={{ fontSize: 22, marginBottom: 14 }}>{s.icon === 'target' ? '🎯' : s.icon === 'chart' ? '📈' : s.icon === 'palette' ? '🎨' : '🗄️'}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: i === 0 ? `${NAVY}a0` : theme.muted }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {results && (
        <section id="results" className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ borderRadius: 20, backgroundColor: LIME, color: NAVY, padding: '52px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, textAlign: 'center' }}>
            {results.items?.map((r) => (
              <div key={r.id}>
                <div style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 900, letterSpacing: '-2px', fontFamily: "'Space Grotesk', sans-serif" }}>{r.value}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.85, marginTop: 6 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {process && (
        <section id="process" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', fontFamily: "'Space Grotesk', sans-serif", textAlign: 'center', marginBottom: 44 }}>{process.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {process.items?.map((p, i) => (
              <div key={p.id} style={{ padding: 26, borderRadius: 16, border: `1px solid ${theme.muted}25` }}>
                <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: LIME, marginBottom: 10 }}>{p.step}</div>
                <div style={{ width: 32, height: 4, borderRadius: 2, backgroundColor: `${LIME}`, marginBottom: 14 }} />
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: theme.muted }}>{p.description}</p>
                {i < 3 && <div style={{ position: 'absolute', display: 'none' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', fontFamily: "'Space Grotesk', sans-serif", textAlign: 'center', marginBottom: 40 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ padding: 32, borderRadius: 16, backgroundColor: '#fff', color: NAVY }}>
                <div style={{ color: LIME, backgroundColor: LIME, width: 14, height: 14, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', marginBottom: 16 }} />
                <p style={{ fontSize: 16, lineHeight: 1.75, marginBottom: 20, fontWeight: 500 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{t.author}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact && (
        <section id="contact" className="tpl-section" style={{ padding: '60px 48px 80px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 900, letterSpacing: '-2px', fontFamily: "'Space Grotesk', sans-serif", color: LIME, marginBottom: 12 }}>{contact.title}</h2>
          {contact.subtitle && <p style={{ fontSize: 15, color: theme.muted, maxWidth: 480, margin: '0 auto 30px' }}>{contact.subtitle}</p>}
          <SiteCtaButton config={config} label={ctaPrimary} target="contact" className="tpl-btn" style={{ backgroundColor: LIME, color: NAVY, border: 'none', padding: '16px 44px', fontSize: 16, fontWeight: 800, borderRadius: 999, boxShadow: '0 12px 36px rgba(216,255,62,0.3)' }} />
          {contact.email && <div style={{ fontSize: 14, color: theme.muted, marginTop: 20 }}><EmailLink email={contact.email || ''} style={{ color: theme.muted }} /></div>}
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.muted}25` }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
        <span>Stop guessing. Start growing.</span>
      </footer>
    </div>
  );
};

export default Renderer;