import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import { OverriddenDefaultBreadcrumb as Breadcrumb } from 'src/components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultProductGallery as ProductGallery } from 'src/components/sections/ProductGallery/OverriddenDefaultProductGallery'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { default as GLOBAL_COMPONENTS } from '../global/Components'

const BannerText = dynamic(
  () =>
    import(
      /* webpackChunkName: "BannerText" */
      'src/components/sections/BannerText/OverriddenDefaultBannerText'
    ).then((mod) => ({ default: mod.OverriddenDefaultBannerText })),
  { ssr: false }
)
const Newsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "Newsletter" */
      'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
    ).then((mod) => ({ default: mod.OverriddenDefaultNewsletter })),
  { ssr: false }
)
const ProductShelf = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductShelf" */
      'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
    ).then((mod) => ({ default: mod.OverriddenDefaultProductShelf })),
  { ssr: false }
)
const ProductTiles = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductTiles" */
      'src/components/sections/ProductTiles'
    ),
  { ssr: false }
)
const ScrollToTopButton = dynamic(
  () =>
    import(
      /* webpackChunkName: "ScrollToTopButton" */
      'src/components/sections/ScrollToTopButton'
    ),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  Breadcrumb,
  Hero,
  ProductGallery,
  BannerText,
  Newsletter,
  ProductShelf,
  ProductTiles,
  ScrollToTopButton,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
