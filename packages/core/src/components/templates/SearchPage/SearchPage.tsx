import type { ClientProductGalleryQueryQuery as ClientProductGalleryQuery } from '@generated/graphql'
import RenderSections from 'src/components/cms/RenderSections'
import COMPONENTS from 'src/components/cms/search/Components'
import type { SearchPageContextType } from 'src/pages/s'
import PageProvider, {
  type SearchPageContext,
} from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import type { SearchContentType } from 'src/server/cms'

export type SearchPageProps = {
  data: SearchPageContextType & ClientProductGalleryQuery
  page: SearchContentType
  globalSections?: Array<{ name: string; data: any }>
  globalSettings?: Record<string, unknown>
}

function SearchPage({
  page: { sections },
  data: serverData,
  globalSections,
  globalSettings,
}: SearchPageProps) {
  const { pages, useGalleryPage } = useCreateUseGalleryPage()

  const context = {
    data: {
      ...serverData,
      pages,
    },
    globalSettings,
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
          <RenderSections
            sections={sections}
            globalSections={globalSections}
            components={COMPONENTS}
          />
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}

export default SearchPage
