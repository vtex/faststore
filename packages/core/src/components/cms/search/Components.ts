import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import { OverriddenDefaultBreadcrumb as Breadcrumb } from '../../sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultHero as Hero } from '../../sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultProductGallery as ProductGallery } from '../../sections/ProductGallery/OverriddenDefaultProductGallery'
import CUSTOM_COMPONENTS from '../../../customizations/src/components'
import PLUGINS_COMPONENTS from '../../../plugins'
import { default as GLOBAL_COMPONENTS } from '../global/Components'
import { getComponentKey } from '../../../utils/cms'

const BannerText = dynamic(
  () =>
    import(
      /* webpackChunkName: "BannerText" */
      '../../sections/BannerText/OverriddenDefaultBannerText'
    ).then((mod) => mod.OverriddenDefaultBannerText),
  { ssr: false }
)
const BannerNewsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "BannerNewsletter" */
      '../../sections/BannerNewsletter/BannerNewsletter'
    ),
  { ssr: false }
)
const Newsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "Newsletter" */
      '../../sections/Newsletter/OverriddenDefaultNewsletter'
    ).then((mod) => mod.OverriddenDefaultNewsletter),
  { ssr: false }
)
const ProductShelf = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductShelf" */
      '../../sections/ProductShelf/OverriddenDefaultProductShelf'
    ).then((mod) => mod.OverriddenDefaultProductShelf),
  { ssr: false }
)
const ProductTiles = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductTiles" */
      '../../sections/ProductTiles'
    ),
  { ssr: false }
)

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  [getComponentKey(Hero, 'Hero')]: Hero,
  [getComponentKey(Breadcrumb, 'Breadcrumb')]: Breadcrumb,
  [getComponentKey(ProductGallery, 'ProductGallery')]: ProductGallery,
  [getComponentKey(BannerText, 'BannerText')]: BannerText,
  [getComponentKey(BannerNewsletter, 'BannerNewsletter')]: BannerNewsletter,
  [getComponentKey(Newsletter, 'Newsletter')]: Newsletter,
  [getComponentKey(ProductShelf, 'ProductShelf')]: ProductShelf,
  [getComponentKey(ProductTiles, 'ProductTiles')]: ProductTiles,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
