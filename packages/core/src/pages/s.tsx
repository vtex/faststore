import { parseSearchState, SearchProvider } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SearchState } from '@faststore/sdk'
import { SROnly as UISROnly } from '@faststore/ui'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'

import storeConfig from '../../faststore.config'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'

type Props = {
  globalSections: GlobalSectionsData
}

const useSearchParams = () => {
  const [params, setParams] = useState<SearchState | null>(null)
  const { asPath } = useRouter()

  useEffect(() => {
    const url = new URL(asPath, 'http://localhost')

    setParams(parseSearchState(url))
  }, [asPath])

  return params
}

function Page({ globalSections }: Props) {
  const searchParams = useSearchParams()
  const applySearchState = useApplySearchState()
  const title = 'Search Results'
  const { description, titleTemplate } = storeConfig.seo

  if (!searchParams) {
    return null
  }

  return (
    <GlobalSections {...globalSections}>
      <SearchProvider
        onChange={applySearchState}
        itemsPerPage={ITEMS_PER_PAGE}
        {...searchParams}
      >
        {/* SEO */}
        <NextSeo
          noindex
          title={title}
          description={description}
          titleTemplate={titleTemplate}
          openGraph={{
            type: 'website',
            title,
            description,
          }}
        />

        <UISROnly as="h1" text={title} />

        {/*
          WARNING: Do not import or render components from any
          other folder than '../components/sections' in here.

          This is necessary to keep the integration with the CMS
          easy and consistent, enabling the change and reorder
          of elements on this page.

          If needed, wrap your component in a <Section /> component
          (not the HTML tag) before rendering it here.
        */}
        <Breadcrumb name="All Products" />

        <ProductGallery
          title="Search Results"
          searchTerm={searchParams.term ?? undefined}
        />
      </SearchProvider>
    </GlobalSections>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const globalSections = await getGlobalSectionsData(previewData)

  return {
    props: { globalSections },
  }
}

Page.displayName = 'Page'

export default mark(Page)
