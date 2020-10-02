import { lazy, LazyExoticComponent } from 'react'

export const components: Record<string, LazyExoticComponent<any>> = {
  Carousel: lazy(() => import('../Carousel')),
  Shelf: lazy(() => import('../Shelf')),
  RichText: lazy(() => import('../RichText')),
  Header: lazy(() => import('../Header')),
  Footer: lazy(() => import('../Footer')),
}
