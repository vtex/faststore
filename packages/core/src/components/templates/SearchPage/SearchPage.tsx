import type { ComponentType } from 'react'

import type { ClientProductGalleryQueryQuery as ClientProductGalleryQuery } from '@generated/graphql'
import RenderSections from 'app/components/cms/RenderSections'
import { OverriddenDefaultBannerText as BannerText } from 'app/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'app/components/sections/Hero/OverriddenDefaultHero'
import PageProvider, { SearchPageContext } from 'app/sdk/overrides/PageProvider'
import { SearchContentType } from 'app/server/cms'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBreadcrumb as Breadcrumb } from 'src/components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultNewsletter as Newsletter } from 'app/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductGallery as ProductGallery } from 'src/components/sections/ProductGallery/OverriddenDefaultProductGallery'
import { OverriddenDefaultProductShelf as ProductShelf } from 'app/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { SearchPageContextType } from 'src/pages/s'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'

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
