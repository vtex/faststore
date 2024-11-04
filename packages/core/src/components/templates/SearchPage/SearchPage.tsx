import type { ComponentType } from 'react'

import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultBreadcrumb as Breadcrumb } from 'src/components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultNewsletter as Newsletter } from 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductGallery as ProductGallery } from 'src/components/sections/ProductGallery/OverriddenDefaultProductGallery'
import { OverriddenDefaultProductShelf as ProductShelf } from 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { SearchPageContextType } from 'src/pages/s'
import PageProvider, { SearchPageContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { SearchContentType } from 'src/server/cms'
import type { ClientProductGalleryQueryQuery as ClientProductGalleryQuery } from '@generated/graphql'

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Breadcrumb,
  BannerText,
  BannerNewsletter,
  Newsletter,
  Hero,
  ProductGallery,
  ProductShelf,
  ProductTiles,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export type SearchPageProps = {
  data: SearchPageContextType & ClientProductGalleryQuery
  page: SearchContentType
}

function SearchPage({ page: { sections }, data: serverData }: SearchPageProps) {
  const { pages, useGalleryPage } = useCreateUseGalleryPage()

  const context = {
    data: {
      ...serverData,
      pages,
    },
  } as SearchPageContext

  return (
    <>
      {/*
          WARNING: Do not import or render components from any
          other folder than '../components/sections' in here.

          This is necessary to keep the integration with the CMS
          easy and consistent, enabling the change and reorder
          of elements on this page.

          If needed, wrap your component in a <Section /> component
          (not the HTML tag) before rendering it here.
        */}
      <PageProvider context={context}>
        <UseGalleryPageContext.Provider value={useGalleryPage}>
          <RenderSections sections={sections} components={COMPONENTS} />
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}

export default SearchPage
