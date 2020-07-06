import { lazy, LazyExoticComponent } from 'react'

export const components: Record<string, LazyExoticComponent<any>> = {
  Header: lazy(() => import('../../components/Header')),
}
