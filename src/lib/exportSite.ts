import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import type { SiteConfig } from '../types';

/**
 * Client-side exporter that turns a generated SiteConfig back into a real,
 * deployable single-file HTML site (same renderer used in preview, but
 * static markup with no React runtime).
 */

const renderers: Record<string, () => Promise<{ default: React.FC<{ config: SiteConfig }> }>> = {
  atelier: () => import('../templates/atelier/Renderer'),
  northline: () => import('../templates/northline/Renderer'),
  forma: () => import('../templates/forma/Renderer'),
  'local-table': () => import('../templates/local-table/Renderer'),
  forge: () => import('../templates/forge/Renderer'),
  motion: () => import('../templates/motion/Renderer'),
  mono: () => import('../templates/mono/Renderer'),
  commerce: () => import('../templates/commerce/Renderer'),
  heirloom: () => import('../templates/heirloom/Renderer'),
  vertex: () => import('../templates/vertex/Renderer'),
  shoreline: () => import('../templates/shoreline/Renderer'),
  quill: () => import('../templates/quill/Renderer'),
  crown: () => import('../templates/crown/Renderer'),
  petals: () => import('../templates/petals/Renderer'),
  boost: () => import('../templates/boost/Renderer'),
};

const TEMPLATE_CSS = `
html{scroll-behavior:smooth}
section[id]{scroll-margin-top:72px}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.tpl-section{animation:fadeInUp .6s ease-out both}
.tpl-hero{animation:fadeIn .8s ease-out both}
.tpl-card{transition:transform .3s ease,box-shadow .3s ease}
.tpl-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
.tpl-img{background:linear-gradient(135deg,var(--muted,#ccc) 25%,transparent 25%,transparent 50%,var(--muted,#ccc) 50%,var(--muted,#ccc) 75%,transparent 75%);background-size:20px 20px;animation:fadeIn .6s ease-out both}
.tpl-btn{transition:transform .2s ease,opacity .2s ease;cursor:pointer}
.tpl-btn:hover{transform:scale(1.02)}
.tpl-btn:active{transform:scale(.98)}
@media(max-width:768px){
  section.tpl-section,section.tpl-hero{padding-left:24px!important;padding-right:24px!important}
  nav[style*="padding:24px 48px"],nav[style*="padding:16px 48px"],nav[style*="padding:20px 48px"],nav[style*="padding:28px 48px"]{padding-left:20px!important;padding-right:20px!important}
  [style*="2fr 1fr 1fr"]{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}
  [style*="repeat(4, 1fr)"]{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}
  [style*="repeat(3, 1fr)"]{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}
}
@media(max-width:640px){
  html,body{overflow-x:hidden}
  section.tpl-section,section.tpl-hero{padding-left:24px!important;padding-right:24px!important}
  section.tpl-hero{padding-top:40px!important}
  nav[style*="padding:24px 48px"]{padding:16px 20px!important;flex-wrap:wrap!important;gap:12px!important}
  nav[style*="padding:16px 48px"],nav[style*="padding:20px 48px"],nav[style*="padding:28px 48px"]{padding:14px 20px!important}
  nav[style*="display:flex"]{flex-wrap:wrap!important;gap:12px!important}
  nav > div[style*="display:flex"]{gap:12px!important;flex-wrap:wrap!important}
  section[style*="48px"]{padding-left:24px!important;padding-right:24px!important}
  [style*="padding:100px 48px"]{padding:64px 24px!important}
  [style*="padding:80px 48px"]{padding:56px 24px!important}
  [style*="padding:60px 48px 0"]{padding:40px 24px 0!important}
  [style*="padding:0 48px 100px"]{padding:0 24px 64px!important}
  [style*="padding:100px 0"]{padding:64px 24px!important}
  [style*="padding:64px 48px"]{padding:48px 24px!important}
  [style*="padding:72px 48px"]{padding:48px 24px!important}
  [style*="padding:90px 48px"]{padding:56px 24px!important}
  [style*="padding:70px 48px"]{padding:48px 24px!important}
  [style*="padding:56px 48px"]{padding:40px 24px!important}
  [style*="padding:52px 48px"]{padding:40px 24px!important}
  [style*="padding:80px 48px 120px"]{padding:48px 24px 64px!important}
  [style*="padding:80px 48px 60px"]{padding:48px 24px 40px!important}
  [style*="padding:100px 48px 120px"]{padding:56px 24px 64px!important}
  [style*="padding:100px 48px 80px"]{padding:56px 24px 48px!important}
  [style*="padding:60px 48px 90px"]{padding:40px 24px 56px!important}
  [style*="padding:60px 48px 80px"]{padding:40px 24px 48px!important}
  [style*="padding:64px 48px 0"]{padding:40px 24px 0!important}
  [style*="padding:56px 48px 0"]{padding:36px 24px 0!important}
  [style*="padding:40px 48px 80px"]{padding:32px 24px 48px!important}
  [style*="padding:20px 48px 80px"]{padding:16px 24px 48px!important}
  [style*="padding:70px 48px 60px"]{padding:44px 24px 40px!important}
  [style*="padding:72px 48px 40px"]{padding:44px 24px 32px!important}
  [style*="padding:48px 56px"]{padding:40px 24px!important}
  [style*="padding:0 24px"]{padding:0!important}
  [style*="2fr 1fr 1fr"],[style*="1.1fr 1fr"],[style*="1.2fr 0.8fr"],[style*="1.2fr 1fr"],[style*="1fr 1.6fr"]{grid-template-columns:1fr!important;gap:20px!important}
  [style*="repeat(4, 1fr)"]{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}
  [style*="repeat(3, 1fr)"]{grid-template-columns:1fr!important;gap:20px!important}
  [style*="repeat(2, 1fr)"]{grid-template-columns:1fr!important;gap:20px!important}
  [style*="1fr 1fr"]{grid-template-columns:1fr!important;gap:20px!important}
  [style*="1fr 2fr"]{grid-template-columns:1fr!important;gap:20px!important}
  [style*="140px 1fr auto"]{grid-template-columns:1fr!important;gap:16px!important}
  [style*="160px 1fr"]{grid-template-columns:1fr!important;gap:16px!important}
  [style*="repeat(auto-fit, minmax(340px, 1fr))"]{grid-template-columns:1fr!important;gap:16px!important}
  [style*="repeat(auto-fit, minmax(300px, 1fr))"]{grid-template-columns:1fr!important;gap:16px!important}
  [style*="repeat(auto-fit, minmax(220px, 1fr))"]{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}
  footer[style*="display:flex"]{flex-wrap:wrap!important;gap:8px 16px!important}
  [style*="display:flex"][style*="gap:40px"],[style*="display:flex"][style*="gap:44px"],[style*="display:flex"][style*="gap:48px"],[style*="display:flex"][style*="gap:56px"],[style*="display:flex"][style*="gap:64px"],[style*="display:flex"][style*="gap:72px"],[style*="display:flex"][style*="gap:80px"]{flex-wrap:wrap!important;gap:16px 24px!important}
  [style*="grid-template-columns"] > *{min-width:0}
  section[id] p,section[id] li,section[id] a,section[id] h1,section[id] h2,section[id] h3,.tpl-hero h1,.tpl-hero h2,[style*="font-size:clamp"]{overflow-wrap:break-word}
  [style*="height:500"]{height:320px!important}
  [style*="height:460"]{height:300px!important}
  [style*="height:440"]{height:280px!important}
  [style*="height:420"]{height:300px!important}
  [style*="height:400"]{height:260px!important}
  [style*="height:380"]{height:260px!important}
  [style*="height:360"]{height:250px!important}
  [style*="height:340"]{height:240px!important}
  [style*="height:320"]{height:240px!important}
  [style*="height:300"]{height:230px!important}
  [style*="height:280"]{height:220px!important}
  [style*="height:260"]{height:210px!important}
  [style*="height:240"]{height:200px!important}
  [style*="height:220"]{height:190px!important}
  [style*="height:200"]{height:180px!important}
  [style*="gap:12px"][style*="justify-content:center"]{flex-wrap:wrap!important}
  section.tpl-hero button.tpl-btn,section.tpl-hero a.tpl-btn{flex:1 1 100%;max-width:340px}
  section.tpl-hero [style*="gap:12px"][style*="justify-content:center"]{flex-wrap:wrap!important;justify-content:center!important}
  section.tpl-hero div[style*="gap:12px"][style*="display:flex"],section.tpl-hero div[style*="gap:16px"][style*="display:flex"]{justify-content:center!important;margin:0 auto}
  section.tpl-hero [style*="font-size:clamp(42px, 7vw, 80px)"]{font-size:clamp(32px,9vw,42px)!important;line-height:1.05!important}
  section.tpl-hero [style*="font-size:clamp(36px"]{font-size:clamp(30px,8vw,38px)!important;line-height:1.05!important}
  section.tpl-hero h1{font-size:clamp(30px,9vw,40px)!important;line-height:1.05!important}
}
@media(max-width:480px){
  [style*="clamp(42px, 7vw, 80px)"]{font-size:clamp(32px,9vw,42px)!important;line-height:1.05!important}
  [style*="clamp(36px, 6vw, 72px)"],[style*="clamp(36px, 6vw, 64px)"]{font-size:clamp(30px,9vw,38px)!important;line-height:1.05!important}
  [style*="clamp(36px, 5vw, 60px)"],[style*="clamp(36px, 5vw, 56px)"]{font-size:clamp(30px,8vw,36px)!important}
  [style*="clamp(32px, 5vw, 56px)"],[style*="clamp(32px, 5vw, 52px)"]{font-size:clamp(28px,8vw,34px)!important}
  [style*="clamp(40px, 5vw, 64px)"],[style*="clamp(36px, 4vw, 52px)"]{font-size:clamp(32px,8vw,44px)!important}
  [style*="clamp(28px, 4vw, 46px)"]{font-size:clamp(24px,6vw,30px)!important}
  [style*="font-size:64px"],[style*="font-size:60px"]{font-size:34px!important}
  [style*="font-size:56px"],[style*="font-size:52px"]{font-size:32px!important}
  [style*="font-size:48px"]{font-size:30px!important}
  [style*="font-size:44px"]{font-size:28px!important}
  [style*="font-size:40px"]{font-size:26px!important}
  [style*="font-size:36px"],[style*="font-size:34px"]{font-size:24px!important}
  [style*="padding:18px 52px"],[style*="padding:18px 40px"],[style*="padding:16px 40px"],[style*="padding:14px 36px"]{padding:12px 22px!important}
  .tpl-btn{min-height:44px;white-space:normal}
  section.tpl-hero button.tpl-btn,section.tpl-hero a.tpl-btn{flex:1 1 100%;max-width:340px}
  nav [style*="gap:28"],nav [style*="gap:32"],nav [style*="gap:36"]{flex-wrap:wrap!important;gap:10px 14px!important}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

export async function buildSiteHtml(config: SiteConfig, templateId: string): Promise<string> {
  const lazy = renderers[templateId];
  if (!lazy) throw new Error('Renderer not found for this template');
  const mod = await lazy();
  const Renderer = mod.default;
  const body = renderToStaticMarkup(createElement(Renderer, { config }));

  const title = (config.brandName || 'My Website')
    .replace(/[<>&"]/g, '')
    .trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${(config.description || '').replace(/[<>&"]/g, '').slice(0, 160)}" />
  <style>
    *,*::before,*::after{box-sizing:border-box}
    html,body{margin:0;padding:0}
    img{max-width:100%;display:block}
${TEMPLATE_CSS}
  </style>
</head>
<body>
${body}
</body>
</html>
`;
}

export function fileNameFor(siteName: string): string {
  return (siteName || 'my-website').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.html';
}

export function downloadSiteHtml(html: string, siteName: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileNameFor(siteName);
  a.click();
  URL.revokeObjectURL(url);
}