import React from 'react';

interface Props {
  templateId: string;
  theme: { background: string; foreground: string; accent: string; muted: string };
  width?: number;
  height?: number;
}

function AtelierPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#F4F1EB" rx="8" />
      {/* Nav */}
      <rect x="20" y="12" width="60" height="10" rx="2" fill={theme.foreground} opacity="0.8" />
      <rect x="240" y="14" width="30" height="6" rx="1" fill={theme.foreground} opacity="0.3" />
      <rect x="280" y="14" width="30" height="6" rx="1" fill={theme.foreground} opacity="0.3" />
      <rect x="320" y="14" width="30" height="6" rx="1" fill={theme.foreground} opacity="0.3" />
      {/* Hero headline */}
      <rect x="20" y="40" width="200" height="10" rx="2" fill={theme.foreground} opacity="0.85" />
      <rect x="20" y="56" width="260" height="10" rx="2" fill={theme.foreground} opacity="0.85" />
      <rect x="20" y="72" width="140" height="10" rx="2" fill={theme.foreground} opacity="0.85" />
      {/* Subtitle */}
      <rect x="20" y="92" width="180" height="5" rx="1" fill={theme.muted} opacity="0.6" />
      {/* CTA buttons */}
      <rect x="20" y="108" width="70" height="22" rx="4" fill={theme.accent} />
      <rect x="100" y="108" width="70" height="22" rx="4" fill="none" stroke={theme.foreground} strokeWidth="1.5" opacity="0.5" />
      {/* Hero image area */}
      <rect x="20" y="142" width="360" height="80" rx="6" fill={theme.muted} opacity="0.35" />
      <rect x="160" y="165" width="80" height="30" rx="3" fill={theme.foreground} opacity="0.08" />
      {/* Service cards */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 120}, 232)`}>
          <rect width="108" height="38" rx="4" fill="white" opacity="0.5" />
          <circle cx="14" cy="14" r="6" fill={theme.accent} opacity="0.5" />
          <rect x="26" y="11" width="50" height="5" rx="1" fill={theme.foreground} opacity="0.5" />
          <rect x="26" y="21" width="65" height="3" rx="1" fill={theme.muted} opacity="0.4" />
          <rect x="26" y="27" width="55" height="3" rx="1" fill={theme.muted} opacity="0.3" />
        </g>
      ))}
    </g>
  );
}

function NorthlinePreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FAFBFC" rx="8" />
      {/* Nav */}
      <rect x="20" y="14" width="55" height="9" rx="2" fill={theme.foreground} opacity="0.8" />
      <rect x="170" y="13" width="36" height="11" rx="5.5" fill={theme.muted} opacity="0.2" />
      <rect x="214" y="13" width="36" height="11" rx="5.5" fill={theme.muted} opacity="0.2" />
      <rect x="258" y="13" width="36" height="11" rx="5.5" fill={theme.muted} opacity="0.2" />
      <rect x="350" y="13" width="30" height="11" rx="5.5" fill={theme.accent} opacity="0.9" />
      {/* Hero badge */}
      <rect x="120" y="34" width="160" height="10" rx="5" fill={theme.accent} opacity="0.12" />
      {/* Hero headline */}
      <rect x="90" y="52" width="220" height="10" rx="2" fill={theme.foreground} opacity="0.9" />
      <rect x="110" y="68" width="180" height="10" rx="2" fill={theme.foreground} opacity="0.9" />
      {/* Subtitle */}
      <rect x="100" y="88" width="200" height="5" rx="1" fill={theme.muted} opacity="0.5" />
      <rect x="120" y="97" width="160" height="5" rx="1" fill={theme.muted} opacity="0.4" />
      {/* CTA */}
      <rect x="145" y="110" width="110" height="22" rx="5" fill={theme.accent} />
      {/* Product mockup */}
      <rect x="50" y="142" width="300" height="65" rx="6" fill="white" opacity="0.9" />
      <rect x="50" y="142" width="60" height="65" rx="6" fill={theme.muted} opacity="0.15" />
      <rect x="58" y="150" width="44" height="6" rx="2" fill={theme.foreground} opacity="0.15" />
      <rect x="58" y="162" width="44" height="4" rx="1" fill={theme.foreground} opacity="0.08" />
      <rect x="58" y="170" width="44" height="4" rx="1" fill={theme.foreground} opacity="0.08" />
      <rect x="58" y="178" width="44" height="4" rx="1" fill={theme.foreground} opacity="0.08" />
      <rect x="120" y="150" width="100" height="40" rx="3" fill={theme.muted} opacity="0.1" />
      <rect x="235" y="150" width="100" height="40" rx="3" fill={theme.muted} opacity="0.1" />
      {/* Feature grid */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <g key={i} transform={`translate(${20 + col * 124}, ${215 + row * 30})`}>
            <rect width="112" height="24" rx="3" fill="white" opacity="0.6" />
            <circle cx="12" cy="8" r="4" fill={theme.accent} opacity="0.35" />
            <rect x="22" y="5" width="55" height="4" rx="1" fill={theme.foreground} opacity="0.35" />
            <rect x="22" y="13" width="70" height="3" rx="1" fill={theme.muted} opacity="0.25" />
          </g>
        );
      })}
    </g>
  );
}

function FormaPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#F8F5F0" rx="8" />
      {/* Nav */}
      <rect x="24" y="14" width="70" height="8" rx="1" fill={theme.foreground} opacity="0.7" />
      <rect x="310" y="15" width="25" height="6" rx="1" fill={theme.foreground} opacity="0.25" />
      <rect x="345" y="15" width="25" height="6" rx="1" fill={theme.foreground} opacity="0.25" />
      <rect x="380" y="15" width="8" height="6" rx="1" fill={theme.foreground} opacity="0.25" />
      {/* Hero large headline */}
      <text x="24" y="52" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill={theme.foreground} opacity="0.9">Architecture begins</text>
      <text x="24" y="68" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill={theme.foreground} opacity="0.9">with listening —</text>
      <text x="24" y="84" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill={theme.foreground} opacity="0.65">to the site, the light.</text>
      {/* Subtitle */}
      <rect x="24" y="96" width="160" height="4" rx="1" fill={theme.muted} opacity="0.5" />
      {/* Two project images */}
      <rect x="24" y="114" width="170" height="90" rx="4" fill={theme.muted} opacity="0.3" />
      <rect x="206" y="114" width="170" height="55" rx="4" fill={theme.muted} opacity="0.25" />
      <rect x="206" y="177" width="82" height="27" rx="4" fill={theme.muted} opacity="0.15" />
      <rect x="294" y="177" width="82" height="27" rx="4" fill={theme.muted} opacity="0.2" />
      {/* Project labels */}
      <rect x="32" y="190" width="80" height="5" rx="1" fill="white" opacity="0.6" />
      <rect x="32" y="198" width="50" height="4" rx="1" fill="white" opacity="0.4" />
      {/* Accent line */}
      <rect x="24" y="218" width="352" height="1" fill={theme.accent} opacity="0.4" />
      {/* Services labels */}
      <text x="24" y="235" fontFamily="Georgia, serif" fontSize="7" fontWeight="600" fill={theme.foreground} opacity="0.45" letterSpacing="0.5">RESIDENTIAL</text>
      <text x="114" y="235" fontFamily="Georgia, serif" fontSize="7" fontWeight="600" fill={theme.foreground} opacity="0.45" letterSpacing="0.5">COMMERCIAL</text>
      <text x="214" y="235" fontFamily="Georgia, serif" fontSize="7" fontWeight="600" fill={theme.foreground} opacity="0.45" letterSpacing="0.5">INTERIOR</text>
      <text x="300" y="235" fontFamily="Georgia, serif" fontSize="7" fontWeight="600" fill={theme.foreground} opacity="0.45" letterSpacing="0.5">CONSULTATION</text>
      {/* Bottom decorative */}
      <rect x="24" y="246" width="60" height="3" rx="1" fill={theme.accent} opacity="0.25" />
      <rect x="24" y="256" width="352" height="1" fill={theme.foreground} opacity="0.06" />
      <text x="24" y="268" fontFamily="Georgia, serif" fontSize="6" fill={theme.foreground} opacity="0.3" letterSpacing="1">FORMA ARCHITECTS</text>
    </g>
  );
}

function LocalTablePreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FBF8F3" rx="8" />
      {/* Nav centered */}
      <rect x="150" y="10" width="100" height="10" rx="2" fill={theme.foreground} opacity="0.75" />
      <rect x="280" y="12" width="28" height="6" rx="1" fill={theme.foreground} opacity="0.25" />
      <rect x="318" y="12" width="28" height="6" rx="1" fill={theme.foreground} opacity="0.25" />
      {/* Hero image */}
      <rect x="20" y="30" width="360" height="100" rx="5" fill={theme.muted} opacity="0.3" />
      {/* Overlaid text */}
      <rect x="30" y="55" width="160" height="10" rx="2" fill="white" opacity="0.7" />
      <rect x="30" y="70" width="200" height="10" rx="2" fill="white" opacity="0.7" />
      <rect x="30" y="86" width="100" height="5" rx="1" fill="white" opacity="0.5" />
      {/* Decorative accent on hero */}
      <rect x="30" y="100" width="30" height="3" rx="1.5" fill={theme.accent} />
      {/* Menu section */}
      <rect x="20" y="140" width="50" height="8" rx="1" fill={theme.foreground} opacity="0.7" />
      <rect x="20" y="152" width="360" height="1" fill={theme.muted} opacity="0.25" />
      {/* Menu items - left column */}
      {[0, 1, 2].map((i) => (
        <g key={`ml${i}`} transform={`translate(20, ${160 + i * 20})`}>
          <rect width="150" height="4" rx="1" fill={theme.foreground} opacity="0.5" />
          <rect x="0" y="6" width="110" height="3" rx="1" fill={theme.muted} opacity="0.35" />
          <rect x="155" y="0" width="15" height="4" rx="1" fill={theme.foreground} opacity="0.35" />
          <line x1="135" y1="2" x2="153" y2="2" stroke={theme.muted} strokeWidth="0.5" strokeDasharray="1,2" opacity="0.4" />
        </g>
      ))}
      {/* Menu items - right column */}
      {[0, 1, 2].map((i) => (
        <g key={`mr${i}`} transform={`translate(210, ${160 + i * 20})`}>
          <rect width="150" height="4" rx="1" fill={theme.foreground} opacity="0.5" />
          <rect x="0" y="6" width="110" height="3" rx="1" fill={theme.muted} opacity="0.35" />
          <rect x="155" y="0" width="15" height="4" rx="1" fill={theme.foreground} opacity="0.35" />
          <line x1="135" y1="2" x2="153" y2="2" stroke={theme.muted} strokeWidth="0.5" strokeDasharray="1,2" opacity="0.4" />
        </g>
      ))}
      {/* Story section */}
      <rect x="20" y="232" width="70" height="50" rx="4" fill={theme.muted} opacity="0.25" />
      <rect x="100" y="234" width="130" height="5" rx="1" fill={theme.foreground} opacity="0.5" />
      <rect x="100" y="244" width="280" height="3" rx="1" fill={theme.muted} opacity="0.3" />
      <rect x="100" y="251" width="260" height="3" rx="1" fill={theme.muted} opacity="0.25" />
      <rect x="100" y="258" width="240" height="3" rx="1" fill={theme.muted} opacity="0.2" />
      {/* Reservation button */}
      <rect x="300" y="235" width="80" height="20" rx="4" fill={theme.accent} />
      <rect x="308" y="242" width="64" height="5" rx="1" fill="white" opacity="0.9" />
    </g>
  );
}

function ForgePreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#F0EDE8" rx="8" />
      {/* Bold uppercase nav */}
      <text x="20" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="900" fill={theme.foreground} opacity="0.85" letterSpacing="1">FORGE</text>
      <text x="280" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="700" fill={theme.foreground} opacity="0.3" letterSpacing="0.5">SERVICES</text>
      <text x="320" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="700" fill={theme.foreground} opacity="0.3" letterSpacing="0.5">PROJECTS</text>
      <text x="365" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="700" fill={theme.foreground} opacity="0.3" letterSpacing="0.5">CONTACT</text>
      {/* Very large bold hero text */}
      <text x="20" y="42" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill={theme.foreground} opacity="0.9" letterSpacing="-0.5">WE BUILD THE</text>
      <text x="20" y="64" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill={theme.foreground} opacity="0.9" letterSpacing="-0.5">STRUCTURES THAT</text>
      <text x="20" y="86" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill={theme.accent} letterSpacing="-0.5">SHAPE COMMUNITIES</text>
      {/* Geometric accent block */}
      <rect x="20" y="96" width="60" height="6" rx="0" fill={theme.accent} opacity="0.7" />
      {/* Subtitle */}
      <rect x="20" y="110" width="200" height="4" rx="1" fill={theme.muted} opacity="0.4" />
      <rect x="20" y="118" width="170" height="4" rx="1" fill={theme.muted} opacity="0.3" />
      {/* 4 service blocks with numbers */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 93}, 132)`}>
          <rect width="85" height="50" rx="0" fill="white" opacity="0.4" />
          <text x="8" y="18" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="900" fill={theme.accent} opacity="0.5">0{i + 1}</text>
          <rect x="8" y="26" width="55" height="4" rx="1" fill={theme.foreground} opacity="0.45" />
          <rect x="8" y="34" width="65" height="3" rx="1" fill={theme.muted} opacity="0.3" />
          <rect x="8" y="40" width="50" height="3" rx="1" fill={theme.muted} opacity="0.2" />
        </g>
      ))}
      {/* Statistics row */}
      <rect x="20" y="192" width="360" height="1" fill={theme.muted} opacity="0.2" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 122}, 200)`}>
          <text x="0" y="18" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="900" fill={theme.foreground} opacity="0.85">{['$1.2B+', '250+', '0.8M'][i]}</text>
          <rect x="0" y="26" width={80} height="3" rx="1" fill={theme.muted} opacity="0.35" />
        </g>
      ))}
      {/* Bottom accent blocks */}
      <rect x="20" y="250" width="360" height="1" fill={theme.muted} opacity="0.15" />
      <rect x="20" y="258" width="360" height="16" rx="0" fill={theme.foreground} opacity="0.05" />
      <rect x="25" y="261" width="60" height="10" rx="0" fill={theme.accent} opacity="0.6" />
      <text x="30" y="269" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="800" fill="white" opacity="0.9" letterSpacing="0.5">GET A QUOTE</text>
    </g>
  );
}

function MotionPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#0A0A0A" rx="8" />
      {/* Nav */}
      <text x="20" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="900" fill="#FAFAFA" letterSpacing="1.5">MOTION</text>
      <text x="260" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="600" fill="#737373" letterSpacing="0.5">PROGRAMS</text>
      <text x="300" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="600" fill="#737373" letterSpacing="0.5">COACHES</text>
      <text x="345" y="16" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="600" fill="#737373" letterSpacing="0.5">MEMBERSHIP</text>
      {/* Red accent line */}
      <rect x="20" y="24" width="360" height="2" fill="#EF4444" />
      {/* Hero headline */}
      <text x="20" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill="#FAFAFA" letterSpacing="1">YOUR STRONGEST</text>
      <text x="20" y="72" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill="#FAFAFA" letterSpacing="1">CHAPTER STARTS</text>
      <text x="20" y="94" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="900" fill="#EF4444" letterSpacing="1">HERE.</text>
      {/* Subtitle */}
      <rect x="20" y="106" width="180" height="4" rx="1" fill="#737373" opacity="0.5" />
      {/* CTA */}
      <rect x="20" y="118" width="90" height="20" rx="2" fill="#EF4444" />
      <text x="30" y="132" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="800" fill="white" letterSpacing="0.5">START FREE</text>
      <rect x="120" y="118" width="70" height="20" rx="2" fill="none" stroke="#737373" strokeWidth="1" />
      {/* Program cards */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 124}, 148)`}>
          <rect width="112" height="50" rx="3" fill="#1A1A1A" />
          <rect width="112" height="3" rx="0" fill={theme.accent} opacity="0.6" />
          <rect x="8" y="12" width="60" height="5" rx="1" fill="#FAFAFA" opacity="0.7" />
          <rect x="8" y="21" width="80" height="3" rx="1" fill="#737373" opacity="0.5" />
          <rect x="8" y="28" width="70" height="3" rx="1" fill="#737373" opacity="0.35" />
          <rect x="8" y="38" width="40" height="6" rx="1" fill="#EF4444" opacity="0.2" />
        </g>
      ))}
      {/* Trainer circles */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${80 + i * 100}, 212)`}>
          <circle cx="0" cy="14" r="14" fill="#1A1A1A" stroke="#EF4444" strokeWidth="1.5" opacity="0.8" />
          <circle cx="0" cy="14" r="6" fill="#737373" opacity="0.3" />
          <rect x="-16" y="34" width="32" height="4" rx="1" fill="#FAFAFA" opacity="0.5" />
          <rect x="-20" y="40" width="40" height="3" rx="1" fill="#737373" opacity="0.3" />
        </g>
      ))}
      {/* Bottom bar */}
      <rect x="0" y="268" width="400" height="12" fill="#EF4444" opacity="0.15" />
      <rect x="130" y="270" width="140" height="8" rx="2" fill="#EF4444" opacity="0.5" />
    </g>
  );
}

function MonoPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FFFFFF" rx="8" />
      {/* Ultra minimal nav */}
      <text x="24" y="18" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="900" fill="#000000" letterSpacing="2">MONO</text>
      {/* HUGE headline */}
      <text x="24" y="52" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="900" fill="#000000" letterSpacing="-1">I design digital</text>
      <text x="24" y="76" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="900" fill="#000000" letterSpacing="-1">products that are</text>
      <text x="24" y="100" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="300" fill="#000000" letterSpacing="-1">clear, useful.</text>
      {/* Thin subtitle */}
      <text x="24" y="118" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="400" fill="#888888">Product designer based in Berlin. Previously at Figma.</text>
      {/* Divider */}
      <line x1="24" y1="130" x2="376" y2="130" stroke="#000000" strokeWidth="0.75" opacity="0.2" />
      {/* Project list */}
      {['FigJam Widget System', 'Orbital', 'Mono Type Specimen', 'Meridian Design System', 'Weather Journal'].map((_, i) => (
        <g key={i} transform={`translate(24, ${142 + i * 24})`}>
          <text fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="700" fill="#000000" opacity="0.8">{['FigJam Widget System', 'Orbital', 'Mono Type Specimen', 'Meridian Design System', 'Weather Journal'][i]}</text>
          <text x="0" y="10" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="400" fill="#888888">{['Product Design · 2022', 'Side Project · 2023', 'Typography · 2024', 'Design Systems · 2021', 'App Design · 2024'][i]}</text>
          <line x1="340" y1="-2" x2="352" y2="-2" stroke="#000000" strokeWidth="0.75" opacity="0.25" />
          <text x="354" y="2" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fill="#000000" opacity="0.3">→</text>
        </g>
      ))}
      {/* Bottom line */}
      <line x1="24" y1="266" x2="376" y2="266" stroke="#000000" strokeWidth="0.5" opacity="0.12" />
    </g>
  );
}

function CommercePreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FAFAF9" rx="8" />
      {/* Nav */}
      <rect x="20" y="12" width="55" height="9" rx="2" fill={theme.foreground} opacity="0.8" />
      <text x="350" y="18" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill={theme.foreground} opacity="0.5">◻</text>
      {/* Hero badge */}
      <rect x="140" y="30" width="120" height="10" rx="5" fill={theme.accent} opacity="0.1" />
      {/* Hero headline */}
      <rect x="100" y="48" width="200" height="10" rx="2" fill={theme.foreground} opacity="0.85" />
      <rect x="120" y="64" width="160" height="10" rx="2" fill={theme.foreground} opacity="0.85" />
      {/* Subtitle */}
      <rect x="110" y="84" width="180" height="4" rx="1" fill={theme.muted} opacity="0.45" />
      {/* CTA */}
      <rect x="150" y="96" width="100" height="20" rx="5" fill={theme.accent} />
      <text x="163" y="110" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="700" fill="white">Shop Now</text>
      {/* Product hero image */}
      <rect x="130" y="124" width="140" height="50" rx="6" fill={theme.muted} opacity="0.2" />
      {/* Product grid 2x2 */}
      {[0, 1, 2, 3].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <g key={i} transform={`translate(${20 + col * 192}, ${182 + row * 42})`}>
            <rect width="176" height="36" rx="4" fill="white" opacity="0.7" />
            <rect x="4" y="4" width="30" height="28" rx="3" fill={theme.muted} opacity="0.2" />
            <rect x="40" y="8" width="80" height="5" rx="1" fill={theme.foreground} opacity="0.5" />
            <rect x="40" y="17" width="60" height="3" rx="1" fill={theme.muted} opacity="0.35" />
            <rect x="40" y="25" width="30" height="4" rx="1" fill={theme.accent} opacity="0.4" />
          </g>
        );
      })}
    </g>
  );
}

function HeirloomPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FBFCF7" rx="8" />
      {/* Nav */}
      <rect x="20" y="16" width="80" height="9" rx="2" fill="#22301F" opacity="0.8" />
      <rect x="300" y="18" width="24" height="6" rx="1" fill="#22301F" opacity="0.25" />
      <rect x="334" y="18" width="24" height="6" rx="1" fill="#22301F" opacity="0.25" />
      <rect x="368" y="18" width="10" height="6" rx="1" fill="#22301F" opacity="0.25" />
      {/* Hero badge */}
      <rect x="20" y="40" width="120" height="9" rx="4.5" fill="#5B7B4C" opacity="0.12" />
      {/* Hero headline serif */}
      <text x="20" y="66" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" fill="#22301F">Botanical artistry,</text>
      <text x="20" y="84" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" fill="#22301F">arranged for</text>
      <text x="20" y="102" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" fill="#5B7B4C">your biggest days.</text>
      {/* Subtitle */}
      <rect x="20" y="112" width="170" height="4" rx="1" fill="#94A08C" opacity="0.6" />
      {/* CTA */}
      <rect x="20" y="126" width="80" height="20" rx="4" fill="#5B7B4C" />
      <text x="31" y="140" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="white">Book a Session</text>
      {/* Services label */}
      <text x="20" y="166" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#22301F" opacity="0.45" letterSpacing="1">OUR SERVICES</text>
      <rect x="0" y="170" width="400" height="1" fill="#22301F" opacity="0.08" />
      {/* Service cards */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 95}, 182)`}>
          <rect width="85" height="44" rx="4" fill="#FFFFFF" opacity="0.7" />
          <circle cx="15" cy="14" r="6" fill="#5B7B4C" opacity="0.25" />
          <rect x="26" y="11" width="45" height="4" rx="1" fill="#22301F" opacity="0.45" />
          <rect x="10" y="26" width="60" height="3" rx="1" fill="#94A08C" opacity="0.4" />
        </g>
      ))}
      {/* Story + image */}
      <rect x="20" y="238" width="120" height="32" rx="4" fill="#94A08C" opacity="0.3" />
      <rect x="150" y="238" width="80" height="5" rx="1" fill="#22301F" opacity="0.5" />
      <rect x="150" y="248" width="130" height="3" rx="1" fill="#94A08C" opacity="0.4" />
      <rect x="150" y="255" width="110" height="3" rx="1" fill="#94A08C" opacity="0.3" />
      <rect x="320" y="236" width="60" height="20" rx="4" fill="#22301F" opacity="0.8" />
    </g>
  );
}

function VertexPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <defs>
        <linearGradient id="vertexGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C6CFF" />
          <stop offset="100%" stopColor="#4DD4F5" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="#07090F" rx="8" />
      {/* Nav */}
      <rect x="20" y="14" width="60" height="8" rx="2" fill="#F1F5F9" opacity="0.85" />
      <rect x="20" y="26" width="40" height="3" rx="1" fill="url(#vertexGrad)" />
      <rect x="300" y="16" width="24" height="5" rx="1" fill="#64748B" opacity="0.5" />
      <rect x="332" y="16" width="24" height="5" rx="1" fill="#64748B" opacity="0.5" />
      <rect x="368" y="13" width="16" height="12" rx="3" fill="url(#vertexGrad)" />
      {/* Hero badge */}
      <rect x="155" y="40" width="90" height="10" rx="5" fill="#7C6CFF" opacity="0.18" />
      {/* Hero headline */}
      <text x="120" y="64" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="800" fill="#F1F5F9">Give every product</text>
      <text x="120" y="82" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="800" fill="#F1F5F9">a superpower.</text>
      {/* Subtitle */}
      <rect x="120" y="92" width="160" height="4" rx="1" fill="#64748B" opacity="0.6" />
      {/* CTAs */}
      <rect x="155" y="104" width="90" height="18" rx="6" fill="url(#vertexGrad)" />
      <rect x="252" y="104" width="70" height="18" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
      {/* Dashboard mockup */}
      <rect x="40" y="132" width="320" height="60" rx="6" fill="#111623" />
      <rect x="52" y="142" width="60" height="38" rx="4" fill="url(#vertexGrad)" opacity="0.25" />
      <rect x="120" y="142" width="120" height="16" rx="3" fill="#1E293B" opacity="0.8" />
      <rect x="120" y="164" width="150" height="8" rx="3" fill="#1E293B" opacity="0.6" />
      {/* Metrics row */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 97}, 208)`}>
          <text x="0" y="16" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="800" fill="#F1F5F9" opacity="0.9">{['2.4B', '99.99%', '38ms', '4,800+'][i]}</text>
          <rect x="0" y="24" width="70" height="3" rx="1" fill="#64748B" opacity="0.4" />
        </g>
      ))}
      {/* Feature grid */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 124}, 248)`}>
          <rect width="112" height="24" rx="4" fill="#111623" />
          <rect x="8" y="6" width="8" height="8" rx="2" fill="url(#vertexGrad)" opacity="0.7" />
          <rect x="22" y="7" width="55" height="4" rx="1" fill="#F1F5F9" opacity="0.5" />
          <rect x="22" y="15" width="70" height="3" rx="1" fill="#64748B" opacity="0.35" />
        </g>
      ))}
    </g>
  );
}

function ShorelinePreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FFFFFF" rx="8" />
      {/* Nav */}
      <rect x="20" y="14" width="70" height="9" rx="2" fill="#14213D" opacity="0.8" />
      <rect x="295" y="16" width="26" height="6" rx="1" fill="#14213D" opacity="0.25" />
      <rect x="329" y="16" width="26" height="6" rx="1" fill="#14213D" opacity="0.25" />
      <rect x="360" y="13" width="22" height="11" rx="3" fill="#1D3557" />
      {/* Hero left text */}
      <rect x="20" y="44" width="130" height="9" rx="4.5" fill="#1D3557" opacity="0.1" />
      <text x="20" y="72" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="800" fill="#14213D">Homes with a view,</text>
      <text x="20" y="92" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="800" fill="#14213D">agents with a plan.</text>
      <rect x="20" y="104" width="190" height="4" rx="1" fill="#6B7280" opacity="0.5" />
      <rect x="20" y="120" width="90" height="20" rx="4" fill="#1D3557" />
      {/* Hero image */}
      <rect x="230" y="44" width="150" height="100" rx="6" fill="#14213D" opacity="0.15" />
      {/* Stat badge on image */}
      <rect x="210" y="118" width="56" height="22" rx="5" fill="#1D3557" />
      <text x="219" y="133" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="800" fill="white">320+</text>
      {/* Listings */}
      <text x="20" y="168" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#1D3557" letterSpacing="1">FEATURED LISTINGS</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 95}, 178)`}>
          <rect width="85" height="52" rx="4" fill="white" />
          <rect width="85" height="28" rx="4" fill="#14213D" opacity="0.12" />
          <rect x="6" y="54" width="40" height="5" rx="1" fill="#14213D" opacity="0.6" />
          <rect x="6" y="62" width="55" height="3" rx="1" fill="#6B7280" opacity="0.4" />
          <rect x="52" y="56" width="25" height="4" rx="1" fill="#1D3557" opacity="0.5" />
        </g>
      ))}
      {/* Services */}
      <rect x="20" y="242" width="360" height="1" fill="#14213D" opacity="0.08" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 95}, 248)`}>
          <circle cx="10" cy="10" r="10" fill="#1D3557" opacity="0.1" />
          <rect x="26" y="7" width="50" height="4" rx="1" fill="#14213D" opacity="0.4" />
          <rect x="26" y="15" width="58" height="3" rx="1" fill="#6B7280" opacity="0.3" />
        </g>
      ))}
    </g>
  );
}

function QuillPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#F5F3EE" rx="8" />
      {/* Nav */}
      <rect x="20" y="16" width="85" height="9" rx="2" fill="#18231D" opacity="0.8" />
      <rect x="290" y="17" width="26" height="6" rx="1" fill="#18231D" opacity="0.25" />
      <rect x="324" y="17" width="26" height="6" rx="1" fill="#18231D" opacity="0.25" />
      <rect x="356" y="14" width="26" height="12" rx="3" fill="#2D5A47" />
      {/* Hero */}
      <text x="20" y="56" fontFamily="Georgia, serif" fontSize="12" fontWeight="600" fill="#2D5A47" letterSpacing="2">EST. 1992</text>
      <text x="20" y="78" fontFamily="Georgia, serif" fontSize="15" fontWeight="600" fill="#18231D">Clear counsel for</text>
      <text x="20" y="96" fontFamily="Georgia, serif" fontSize="15" fontWeight="600" fill="#18231D">complex matters.</text>
      <rect x="20" y="106" width="150" height="4" rx="1" fill="#7C857E" opacity="0.5" />
      <rect x="20" y="120" width="90" height="20" rx="4" fill="#2D5A47" />
      {/* Library image */}
      <rect x="230" y="40" width="150" height="100" rx="6" fill="#2D5A47" opacity="0.12" />
      <rect x="250" y="58" width="110" height="60" rx="3" fill="#18231D" opacity="0.06" />
      {/* Practice areas */}
      <rect x="20" y="156" width="180" height="5" rx="1" fill="#18231D" opacity="0.6" />
      <rect x="20" y="166" width="120" height="3" rx="1" fill="#7C857E" opacity="0.4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + (i % 2) * 185}, ${182 + (i > 1 ? 1 : 0) * 40})`}>
          <rect width="175" height="34" rx="4" fill="white" />
          <circle cx="14" cy="12" r="7" fill="#2D5A47" opacity="0.12" />
          <rect x="26" y="9" width="70" height="5" rx="1" fill="#18231D" opacity="0.5" />
          <rect x="10" y="22" width="110" height="3" rx="1" fill="#7C857E" opacity="0.35" />
        </g>
      ))}
      {/* Stats band */}
      <rect x="20" y="242" width="360" height="30" rx="4" fill="#2D5A47" />
      {[0, 1, 2].map((i) => (
        <text key={i} x={60 + i * 105} y="263" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill="white" opacity="0.9">{['30+ Years', '2,400+ Cases', '98% Happy'][i]}</text>
      ))}
    </g>
  );
}

function CrownPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#141312" rx="8" />
      {/* Nav */}
      <text x="20" y="18" fontFamily="Bebas Neue, Oswald, sans-serif" fontSize="10" fontWeight="700" fill="#F7F2E9" letterSpacing="2">CROWN & BLADE</text>
      <rect x="300" y="13" width="34" height="7" rx="1" fill="#C9A45C" />
      <text x="307" y="19" fontFamily="Inter, sans-serif" fontSize="5" fontWeight="800" fill="#141312" letterSpacing="1">BOOK</text>
      {/* Hero headline */}
      <text x="20" y="50" fontFamily="Bebas Neue, Oswald, sans-serif" fontSize="22" fontWeight="700" fill="#F7F2E9" letterSpacing="1">SHARP BY TRADITION.</text>
      <text x="20" y="74" fontFamily="Bebas Neue, Oswald, sans-serif" fontSize="22" fontWeight="700" fill="#F7F2E9" letterSpacing="1">SHARP BY <tspan fill="#C9A45C">CRAFT.</tspan></text>
      {/* Divider */}
      <rect x="20" y="84" width="46" height="3" fill="#C9A45C" />
      <rect x="20" y="94" width="170" height="4" rx="1" fill="#94897A" opacity="0.5" />
      {/* Hero portrait */}
      <rect x="270" y="36" width="110" height="120" rx="4" fill="#94897A" opacity="0.15" />
      <circle cx="325" cy="70" r="18" fill="#F7F2E9" opacity="0.12" />
      <rect x="290" y="110" width="70" height="30" rx="3" fill="#94897A" opacity="0.12" />
      {/* Services */}
      <text x="20" y="176" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="800" fill="#C9A45C" letterSpacing="1.5">THE MENU</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + (i % 2) * 185}, ${184 + (i > 1 ? 1 : 0) * 36})`}>
          <rect width="175" height="30" rx="2" fill="none" stroke="#C9A45C" strokeOpacity="0.25" />
          <rect x="10" y="9" width="70" height="5" rx="1" fill="#F7F2E9" opacity="0.65" />
          <rect x="10" y="19" width="50" height="3" rx="1" fill="#94897A" opacity="0.45" />
          <rect x="145" y="9" width="20" height="5" rx="1" fill="#C9A45C" opacity="0.8" />
        </g>
      ))}
      {/* Hours strip */}
      <rect x="0" y="266" width="400" height="14" fill="#C9A45C" opacity="0.15" />
      <rect x="130" y="269" width="140" height="8" rx="2" fill="#C9A45C" opacity="0.5" />
    </g>
  );
}

function PetalsPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#FDF9F6" rx="8" />
      {/* Nav */}
      <rect x="20" y="16" width="80" height="9" rx="2" fill="#4A3A3A" opacity="0.75" />
      <rect x="295" y="17" width="26" height="6" rx="1" fill="#4A3A3A" opacity="0.25" />
      <rect x="329" y="17" width="26" height="6" rx="1" fill="#4A3A3A" opacity="0.25" />
      <rect x="360" y="13" width="22" height="12" rx="6" fill="#D98BA6" />
      {/* Hero */}
      <text x="150" y="42" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="600" fill="#D98BA6" letterSpacing="2">200+ WEDDINGS SINCE 2014</text>
      <text x="60" y="66" fontFamily="Playfair Display, Georgia, serif" fontSize="16" fontWeight="600" fill="#4A3A3A">Your love story,</text>
      <text x="60" y="86" fontFamily="Playfair Display, Georgia, serif" fontSize="16" fontWeight="600" fill="#4A3A3A" fontStyle="italic">beautifully planned.</text>
      <rect x="100" y="96" width="200" height="4" rx="1" fill="#A48B8B" opacity="0.45" />
      <rect x="160" y="108" width="80" height="18" rx="9" fill="#D98BA6" />
      {/* Hero image */}
      <rect x="50" y="136" width="300" height="60" rx="10" fill="#D98BA6" opacity="0.15" />
      <circle cx="120" cy="166" r="12" fill="#D98BA6" opacity="0.4" />
      <circle cx="205" cy="166" r="12" fill="#D98BA6" opacity="0.25" />
      <circle cx="290" cy="166" r="12" fill="#D98BA6" opacity="0.4" />
      {/* Services */}
      <text x="40" y="218" fontFamily="Playfair Display, Georgia, serif" fontSize="8" fontWeight="600" fill="#4A3A3A">WHAT WE PLAN</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 95}, 224)`}>
          <rect width="85" height="42" rx="8" fill="white" />
          <circle cx="15" cy="13" r="7" fill="#D98BA6" opacity="0.2" />
          <rect x="26" y="10" width="45" height="4" rx="1" fill="#4A3A3A" opacity="0.45" />
          <rect x="10" y="26" width="65" height="3" rx="1" fill="#A48B8B" opacity="0.35" />
        </g>
      ))}
    </g>
  );
}

function BoostPreview({ theme }: { theme: Props['theme'] }) {
  return (
    <g>
      <rect width="400" height="280" fill="#0E1832" rx="8" />
      {/* Nav */}
      <text x="20" y="18" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="900" fill="#F8FAFC">BOOST<tspan fill="#D8FF3E">&</tspan></text>
      <rect x="300" y="13" width="34" height="12" rx="6" fill="#D8FF3E" />
      <text x="306" y="22" fontFamily="Inter, sans-serif" fontSize="5" fontWeight="900" fill="#0E1832">AUDIT</text>
      {/* Hero */}
      <text x="60" y="50" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="900" fill="#F8FAFC" letterSpacing="-1">STOP GUESSING.</text>
      <text x="60" y="72" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="900" fill="#D8FF3E" letterSpacing="-1">START GROWING.</text>
      <rect x="120" y="84" width="160" height="4" rx="1" fill="#8FA0BF" opacity="0.5" />
      {/* Hero button */}
      <rect x="130" y="96" width="140" height="20" rx="10" fill="#D8FF3E" />
      <text x="152" y="110" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="800" fill="#0E1832">GET A FREE AUDIT</text>
      {/* Results band */}
      <rect x="20" y="126" width="360" height="40" rx="10" fill="#D8FF3E" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 120}, 130)`}>
          <text x="0" y="20" fontFamily="Space Grotesk, sans-serif" fontSize="19" fontWeight="900" fill="#0E1832">{['340%', '2.1M', '+61%'][i]}</text>
          <rect x="0" y="26" width="90" height="3" rx="1" fill="#0E1832" opacity="0.6" />
        </g>
      ))}
      {/* Service cards */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + (i % 2) * 185}, ${176 + (i > 1 ? 1 : 0) * 40})`}>
          <rect width="175" height="34" rx="8" fill="#15234A" />
          <circle cx="14" cy="12" r="7" fill="#D8FF3E" opacity="0.15" />
          <rect x="26" y="9" width="70" height="5" rx="1" fill="#F8FAFC" opacity="0.65" />
          <rect x="10" y="22" width="100" height="3" rx="1" fill="#8FA0BF" opacity="0.4" />
        </g>
      ))}
      {/* CTA footer */}
      <rect x="20" y="252" width="360" height="14" rx="7" fill="#D8FF3E" opacity="0.15" />
      <rect x="120" y="255" width="160" height="8" rx="4" fill="#D8FF3E" opacity="0.5" />
    </g>
  );
}

export default function TemplatePreview({ templateId, theme, width = 400, height = 280 }: Props) {
  const renderers: Record<string, React.FC<{ theme: Props['theme'] }>> = {
    atelier: AtelierPreview,
    northline: NorthlinePreview,
    forma: FormaPreview,
    'local-table': LocalTablePreview,
    forge: ForgePreview,
    motion: MotionPreview,
    mono: MonoPreview,
    commerce: CommercePreview,
    heirloom: HeirloomPreview,
    vertex: VertexPreview,
    shoreline: ShorelinePreview,
    quill: QuillPreview,
    crown: CrownPreview,
    petals: PetalsPreview,
    boost: BoostPreview,
  };

  const Renderer = renderers[templateId] || AtelierPreview;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 280"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: 8, overflow: 'hidden' }}
    >
      <clipPath id={`clip-${templateId}`}>
        <rect width="400" height="280" rx="8" />
      </clipPath>
      <g clipPath={`url(#clip-${templateId})`}>
        <Renderer theme={theme} />
      </g>
    </svg>
  );
}
