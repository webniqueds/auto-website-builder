import { lazy } from 'react';
import type { SiteConfig } from '../types';

export const rendererMap: Record<
  string,
  React.LazyExoticComponent<React.FC<{ config: SiteConfig }>>
> = {
  atelier: lazy(() => import('../templates/atelier/Renderer')),
  northline: lazy(() => import('../templates/northline/Renderer')),
  forma: lazy(() => import('../templates/forma/Renderer')),
  'local-table': lazy(() => import('../templates/local-table/Renderer')),
  forge: lazy(() => import('../templates/forge/Renderer')),
  motion: lazy(() => import('../templates/motion/Renderer')),
  mono: lazy(() => import('../templates/mono/Renderer')),
  commerce: lazy(() => import('../templates/commerce/Renderer')),
  heirloom: lazy(() => import('../templates/heirloom/Renderer')),
  vertex: lazy(() => import('../templates/vertex/Renderer')),
  shoreline: lazy(() => import('../templates/shoreline/Renderer')),
  quill: lazy(() => import('../templates/quill/Renderer')),
  crown: lazy(() => import('../templates/crown/Renderer')),
  petals: lazy(() => import('../templates/petals/Renderer')),
  boost: lazy(() => import('../templates/boost/Renderer')),
};