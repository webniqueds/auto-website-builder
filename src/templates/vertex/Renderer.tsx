import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage } from '../../lib/images';
import { SiteCtaButton } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_GRAPHICS = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
];

const GRADIENT = 'linear-gradient(135deg, #7C6CFF 0%, #4DD4F5 100%)';

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, tagline, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const features = sections.features as { title?: string; subtitle?: string; items?: Array<{ id: string; title: string; description: string; icon: string }> } | undefined;
  const metrics = sections.metrics as { title?: string; items?: Array<{ id: string; value: string; label: string }> } | undefined;
  const testimonials = sections.testimonials as { title?: string; items?: Array<{ id: string; quote: string; author: string; role: string }> } | undefined;
  const pricing = sections.pricing as { title?: string; subtitle?: string; tiers?: Array<{ id: string; name: string; price: string; period: string; description: string; features: string[]; highlighted?: boolean; cta: string }> } | undefined;
  const cta = sections.cta as { title?: string; subtitle?: string; primaryButton?: string; secondaryButton?: string } | undefined;

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Space Grotesk, sans-serif' }}>
          {brandName}<span style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 14, fontWeight: 500, color: theme.muted }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
          <a href="#cta" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ background: GRADIENT, color: '#fff', border: 'none', padding: '10px 22px', fontSize: 14, fontWeight: 600, borderRadius: 10, display: 'inline-block', textDecoration: 'none' }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '72px 48px 40px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        {hero?.badge && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(124,108,255,0.12)', border: '1px solid rgba(124,108,255,0.3)', color: '#A5B4FC', padding: '6px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DD4F5' }} />
            {hero.badge}
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif' }}>
          {hero?.title}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px', color: theme.muted }}>
          {hero?.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 56 }}>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ background: GRADIENT, color: '#fff', border: 'none', padding: '14px 36px', fontSize: 15, fontWeight: 600, borderRadius: 12, boxShadow: '0 8px 32px rgba(124,108,255,0.35)' }} />
          <SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: theme.foreground, border: '1px solid rgba(255,255,255,0.12)', padding: '14px 36px', fontSize: 15, fontWeight: 600, borderRadius: 12 }} />
        </div>
        <div style={{ width: '100%', maxWidth: 840, height: 380, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
          <img src={getSectionImage(config, 'hero', 0, FALLBACK_GRAPHICS[0])} alt="Vertex dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          <div style={{ position: 'absolute', inset: 0, background: GRADIENT, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
        </div>
      </section>

      {features && (
        <section id="features" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#A5B4FC', marginBottom: 12 }}>Product</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>{features.title}</h2>
            {features.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{features.subtitle}</p>}
          </div>
          {features.items && (
            <div className="tpl-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {features.items.map((f, i) => (
                <div key={f.id} style={{ padding: 28, borderRight: i % 3 === 2 ? 'none' : '1px solid rgba(255,255,255,0.06)', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(124,108,255,0.15)`, color: '#A5B4FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: theme.muted }}>{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {metrics && (
        <section className="tpl-section" style={{ padding: '60px 48px', background: GRADIENT, color: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 40, opacity: 0.9 }}>{metrics.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {metrics.items?.map((m) => (
                <div key={m.id}>
                  <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif' }}>{m.value}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials && (
        <section className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', textAlign: 'center', marginBottom: 48 }}>{testimonials.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {testimonials.items?.map((t) => (
              <div key={t.id} style={{ padding: 32, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 40, lineHeight: 0.8, color: '#7C6CFF', marginBottom: 14 }}>"</div>
                <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>{t.quote}</p>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.author}</div>
                <div style={{ fontSize: 13, color: theme.muted }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pricing && (
        <section id="pricing" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>{pricing.title}</h2>
            {pricing.subtitle && <p style={{ fontSize: 15, color: theme.muted }}>{pricing.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
            {pricing.tiers?.map((tier) => (
              <div key={tier.id} style={{
                borderRadius: 20,
                padding: 32,
                border: tier.highlighted ? '1px solid rgba(124,108,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                background: tier.highlighted ? 'rgba(124,108,255,0.08)' : 'rgba(255,255,255,0.02)',
                boxShadow: tier.highlighted ? '0 12px 48px rgba(124,108,255,0.2)' : 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: tier.highlighted ? '#A5B4FC' : theme.muted }}>{tier.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 4px' }}>
                  <span style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>${tier.price}</span>
                  <span style={{ fontSize: 13, color: theme.muted }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: 13.5, color: theme.muted, marginBottom: 20 }}>{tier.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ fontSize: 13.5, display: 'flex', gap: 8 }}><span style={{ color: '#7C6CFF' }}>✓</span>{f}</li>
                  ))}
                </ul>
                <SiteCtaButton config={config} label={tier.cta} target="cta" className="tpl-btn" style={{ width: '100%', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.15)', background: tier.highlighted ? GRADIENT : 'transparent', color: tier.highlighted ? '#fff' : theme.foreground }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {cta && (
        <section id="cta" className="tpl-section" style={{ padding: '90px 48px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ padding: '64px 48px', borderRadius: 28, background: GRADIENT, color: '#fff' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 14 }}>{cta.title}</h2>
            <p style={{ fontSize: 15, opacity: 0.9, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>{cta.subtitle}</p>
            <SiteCtaButton config={config} label={cta.primaryButton} target="cta" className="tpl-btn" style={{ backgroundColor: '#fff', color: '#0B0E1A', border: 'none', padding: '14px 36px', fontSize: 15, fontWeight: 700, borderRadius: 12 }} />
          </div>
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
        <span style={{ fontFamily: 'monospace' }}>{tagline}</span>
      </footer>
    </div>
  );
};

export default Renderer;