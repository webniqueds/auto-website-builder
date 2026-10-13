import React from 'react';
import { SiteConfig } from '../../types';
import { getSectionImage, getSectionImages } from '../../lib/images';
import { SiteCtaButton, PhoneLink } from '../actions';

interface Props {
  config: SiteConfig;
}

const FALLBACK_GALLERY = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=450&fit=crop',
  'https://images.unsplash.com/photo-1521498449612-5f318d5f0df5?w=500&h=450&fit=crop',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=450&fit=crop',
  'https://images.unsplash.com/photo-1590736969955-71cc9490111e?w=500&h=450&fit=crop',
];

const FALLBACK_BARBERS = [
  'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=300&h=360&fit=crop',
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=360&fit=crop',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=360&fit=crop',
];

const CHARCOAL = '#141312';
const GOLD = '#C9A45C';

const Renderer: React.FC<Props> = ({ config }) => {
  const { theme, sections, brandName, tagline, ctaPrimary, ctaSecondary } = config;
  const hero = sections.hero as { title?: string; subtitle?: string; badge?: string } | undefined;
  const services = sections.services as { title?: string; subtitle?: string; items?: Array<{ id: string; name: string; price: string; duration: string; description: string }> } | undefined;
  const gallery = sections.gallery as { title?: string; subtitle?: string } | undefined;
  const barbers = sections.barbers as { title?: string; items?: Array<{ id: string; name: string; role: string; bio: string }> } | undefined;
  const hours = sections.hours as { title?: string; items?: Array<{ id: string; days: string; time: string }> } | undefined;
  const booking = sections.booking as { title?: string; subtitle?: string; phone?: string } | undefined;

  const galleryImages = getSectionImages(config, 'gallery', 4, FALLBACK_GALLERY);
  const barberImages = getSectionImages(config, 'team', 3, FALLBACK_BARBERS);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.foreground, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,164,92,0.25)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Bebas Neue', 'Oswald', sans-serif" }}>{brandName}</div>
        <div style={{ display: 'flex', gap: 30, alignItems: 'center', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: theme.muted }}>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#barbers" style={{ color: 'inherit', textDecoration: 'none' }}>Barbers</a>
          <a href="#hours" style={{ color: 'inherit', textDecoration: 'none' }}>Hours</a>
          <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: GOLD, color: CHARCOAL, border: 'none', padding: '11px 24px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 2 }} />
        </div>
      </nav>

      <section className="tpl-hero" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 56, alignItems: 'center' }}>
        <div>
          {hero?.badge && (
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: GOLD, marginBottom: 16 }}>{hero.badge}</div>
          )}
          <h1 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(52px, 8vw, 92px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 20 }}>
            {hero?.title}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: theme.muted, maxWidth: 460, marginBottom: 36 }}>{hero?.subtitle}</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: GOLD, color: CHARCOAL, border: 'none', padding: '15px 34px', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 2 }} /><SiteCtaButton config={config} label={ctaSecondary} className="tpl-btn" style={{ backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${GOLD}66`, padding: '15px 34px', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: 400, aspectRatio: '3/3.6', marginLeft: 'auto', overflow: 'hidden', borderRadius: 4 }}>
          <img src={getSectionImage(config, 'hero', 0, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=520&fit=crop')} alt="Barbershop" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.05)' }} />
        </div>
      </section>

      {services && (
        <section id="services" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: GOLD, marginBottom: 10 }}>The Menu</div>
            <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(34px, 5vw, 52px)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>{services.title}</h2>
            {services.subtitle && <p style={{ fontSize: 14, color: theme.muted, marginTop: 6 }}>{services.subtitle}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {services.items?.map((s) => (
              <div key={s.id} className="tpl-card" style={{ padding: '26px 28px', border: '1px solid rgba(201,164,92,0.2)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: theme.muted, margin: '6px 0 2px' }}>{s.description}</div>
                  <div style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>{s.duration}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "'Bebas Neue', 'Oswald', sans-serif" }}>${s.price}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {gallery && (
        <section className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(34px, 5vw, 52px)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>{gallery.title}</h2>
          {gallery.subtitle && <p style={{ fontSize: 14, color: theme.muted, textAlign: 'center', marginBottom: 32 }}>{gallery.subtitle}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {galleryImages.map((src, i) => (
              <div key={i} style={{ borderRadius: 4, overflow: 'hidden', height: 200 }}>
                <img src={src} alt={`Cut ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(25%)' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {barbers && (
        <section id="barbers" className="tpl-section" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(34px, 5vw, 52px)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', marginBottom: 44 }}>{barbers.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {barbers.items?.map((b, i) => (
              <div key={b.id} style={{ textAlign: 'center' }}>
                <div style={{ borderRadius: 4, overflow: 'hidden', height: 300, marginBottom: 16, filter: 'grayscale(20%)' }}>
                  <img src={barberImages[i] || barberImages[0]} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Bebas Neue', 'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>{b.name}</div>
                <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 10px' }}>{b.role}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: theme.muted, maxWidth: 260, margin: '0 auto' }}>{b.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hours && (
        <section id="hours" className="tpl-section" style={{ padding: '70px 48px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(34px, 5vw, 52px)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{hours.title}</h2>
          <div style={{ borderTop: `1px solid ${theme.muted}30` }}>
            {hours.items?.map((h) => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 8px', borderBottom: `1px solid ${theme.muted}30` }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{h.days}</span>
                <span style={{ fontSize: 15, color: h.time === 'Closed' ? theme.muted : GOLD, fontWeight: h.time === 'Closed' ? 400 : 600 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {booking && (
        <section className="tpl-section" style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ backgroundColor: GOLD, color: CHARCOAL, borderRadius: 6, padding: '56px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: 'clamp(30px, 4vw, 44px)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{booking.title}</h2>
              {booking.subtitle && <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85 }}>{booking.subtitle}</p>}
              {booking.phone && <div style={{ fontSize: 18, fontWeight: 700, marginTop: 14 }}><PhoneLink phone={booking.phone} style={{ color: CHARCOAL }} /></div>}
            </div>
            <SiteCtaButton config={config} label={ctaPrimary} className="tpl-btn" style={{ backgroundColor: CHARCOAL, color: '#fff', border: 'none', padding: '16px 40px', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 2, flexShrink: 0 }} />
          </div>
        </section>
      )}

      <footer style={{ padding: '28px 48px', fontSize: 13, color: theme.muted, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(201,164,92,0.2)' }}>
        <span>&copy; 2025 {brandName}. All rights reserved.</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{tagline}</span>
      </footer>
    </div>
  );
};

export default Renderer;