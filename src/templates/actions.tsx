import React from 'react';
import type { SiteConfig } from '../types';

/**
 * Shared behavior for the generated sites' interactive elements.
 * Buttons resolve to real actions — booking URLs, phone/email links, or
 * smooth-scrolling to a section — instead of being inert <button>s.
 */

export const CONTACTISH_SECTIONS = ['contact', 'reservation', 'cta', 'location'];

export function findContactSection(config: SiteConfig): string {
  const keys = Object.keys(config.sections ?? {});
  for (const k of CONTACTISH_SECTIONS) {
    if (keys.includes(k)) return k;
  }
  return keys[0] ?? 'hero';
}

export interface ContactInfo {
  email: string;
  phone: string;
  bookingUrl: string;
}

export function getContactInfo(config: SiteConfig): ContactInfo {
  let email = '';
  let phone = '';
  let bookingUrl = '';
  for (const k of CONTACTISH_SECTIONS) {
    const s = config.sections?.[k] as Record<string, unknown> | undefined;
    if (!s || typeof s !== 'object') continue;
    if (!email && typeof s.email === 'string') email = s.email;
    if (!phone && typeof s.phone === 'string') phone = s.phone;
    if (!bookingUrl && typeof s.bookingUrl === 'string') bookingUrl = s.bookingUrl;
  }
  return { email, phone, bookingUrl };
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()\-./]/g, '')}`;
}

export function scrollToId(id: string): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
  }
}

export interface CtaAction {
  kind: 'link' | 'scroll';
  href?: string;
  section?: string;
}

export function ctaTarget(config: SiteConfig, label: string): CtaAction {
  const { email, phone, bookingUrl } = getContactInfo(config);
  const n = (label || '').toLowerCase();
  const isBookish =
    /\b(book|reserv|call|consult|talk|quote|audit|contact|start a project|get in touch|enquir|request|order)\b/.test(n);
  const isMailish = /\b(mail|email|message)\b/.test(n);

  if (bookingUrl && (isBookish || n === '')) return { kind: 'link', href: bookingUrl };
  if (phone && isBookish) return { kind: 'link', href: telHref(phone) };
  if (email && (isMailish || (n === '' && bookingUrl === ''))) {
    return { kind: 'link', href: `mailto:${email}?subject=${encodeURIComponent(`Hello ${config.brandName ?? ''}`.trim())}` };
  }
  return { kind: 'scroll', section: findContactSection(config) };
}

export interface SiteCtaButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  config: SiteConfig;
  /** Button text. Falls back to the first child node. */
  label?: string;
  /** Explicit section id to scroll to (overrides auto-detection). */
  target?: string;
  /** Force the button to render as a plain <button> (no action). */
  plain?: boolean;
}

/**
 * A CTA that does something real:
 * - booking URL present → opens it (new tab)
 * - phone present + book-ish label → tel: link
 * - email present → mailto: link
 * - otherwise → smooth-scrolls to the contact/cta section
 */
export function SiteCtaButton({ config, label, target, plain, children, ...rest }: SiteCtaButtonProps) {
  const text = label ?? '';
  const action: CtaAction = plain || target
    ? target
      ? { kind: 'scroll', section: target }
      : { kind: 'scroll', section: findContactSection(config) }
    : ctaTarget(config, text);

  const href = action.kind === 'link' ? action.href : `#${action.section ?? 'top'}`;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (action.kind === 'scroll') {
      e.preventDefault();
      scrollToId(action.section ?? '');
    }
    rest.onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);
  };

  const mergedStyle: React.CSSProperties = {
    textDecoration: 'none',
    display: 'inline-block',
    ...rest.style,
  };

  return (
    <a
      href={href}
      {...rest}
      style={mergedStyle}
      onClick={handleClick}
      {...(action.kind === 'link' ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children ?? text}
    </a>
  );
}

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  children: React.ReactNode;
  href: string;
}

/** Phone number that opens the dialer when tapped. */
export function PhoneLink({ phone, children, ...rest }: { phone: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  if (!phone) return null;
  const style: React.CSSProperties = { textDecoration: 'none', ...rest.style };
  return (
    <a href={telHref(phone)} {...rest} style={style}>
      {children ?? phone}
    </a>
  );
}

/** Email address that opens a compose window. */
export function EmailLink({ email, subject, children, ...rest }: { email: string; subject?: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  if (!email) return null;
  const href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  const style: React.CSSProperties = { textDecoration: 'none', ...rest.style };
  return (
    <a href={href} {...rest} style={style}>
      {children ?? email}
    </a>
  );
}

/** Web URL link that opens in a new tab. */
export function SiteLink({ url, children, ...rest }: { url: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={url} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  );
}