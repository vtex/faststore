import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import Hero from 'src/components/sections/Hero'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductShelf from 'src/components/sections/ProductShelf'
import ScrollToTopButton from 'src/components/sections/ScrollToTopButton'
import { ITEMS_PER_PAGE, ITEMS_PER_SECTION } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'

import { Locator } from '@vtex/client-cms'
import type { ComponentType } from 'react'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { getPage, PLPContentType } from 'src/server/cms'
import storeConfig from '../../faststore.config'

type Props = ServerCollectionPageQueryQuery &
  PLPContentType & {
    globalSections: GlobalSectionsData
  }

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Breadcrumb,
  ...CUSTOM_COMPONENTS,
}

const useSearchParams = ({
  collection,
}: ServerCollectionPageQueryQuery): SearchState => {
  const selectedFacets = collection?.meta.selectedFacets
  const { asPath } = useRouter()

  const hrefState = useMemo(() => {
    const newState = parseSearchState(new URL(asPath, 'http://localhost'))

    // In case we are in an incomplete url
    if (newState.selectedFacets.length === 0) {
      newState.selectedFacets = selectedFacets
    }

    return formatSearchState(newState).href
  }, [asPath, selectedFacets])

  return useMemo(() => parseSearchState(new URL(hrefState)), [hrefState])
}

function Page({ sections, globalSections, ...otherProps }: Props) {
  const { collection } = otherProps
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams(otherProps)

  const { page } = searchParams
  const title = collection?.seo.title ?? storeConfig.seo.title
  const description = collection?.seo.description ?? storeConfig.seo.title
  const pageQuery = page !== 0 ? `?page=${page}` : ''
  const [pathname] = router.asPath.split('?')
  const canonical = `${storeConfig.storeUrl}${pathname}${pageQuery}`

  return (
    <GlobalSections {...globalSections}>
      <SearchProvider
        onChange={applySearchState}
        itemsPerPage={ITEMS_PER_PAGE}
        {...searchParams}
      >
        {/* SEO */}
        <NextSeo
          title={title}
          description={description}
          titleTemplate={storeConfig.seo.titleTemplate}
          canonical={canonical}
          openGraph={{
            type: 'website',
            title,
            description,
          }}
        />
        <BreadcrumbJsonLd
          itemListElements={collection?.breadcrumbList.itemListElement ?? []}
        />

        {/*
          WARNING: Do not import or render components from any
          other folder than '../components/sections' in here.

          This is necessary to keep the integration with the CMS
          easy and consistent, enabling the change and reorder
          of elements on this page.

          If needed, wrap your component in a <Section /> component
          (not the HTML tag) before rendering it here.
        */}
        <RenderSections
          context={collection}
          sections={sections}
          components={COMPONENTS}
        />

        <ProductGallery title={title} />

        <ProductShelf
          first={ITEMS_PER_SECTION}
          sort="score_desc"
          title="You might also like"
          withDivisor
        />

        <ScrollToTopButton />
      </SearchProvider>
    </GlobalSections>
  )
}

const query = gql`
  query ServerCollectionPageQuery($slug: String!) {
    collection(slug: $slug) {
      seo {
        title
        description
      }
      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }
      meta {
        selectedFacets {
          key
          value
        }
      }
    }
  }
`

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string[] },
  Locator
> = async ({ params, previewData }) => {
  const [{ data, errors = [] }, cmsPage, globalSections] = await Promise.all([
    execute<
      ServerCollectionPageQueryQueryVariables,
      ServerCollectionPageQueryQuery
    >({
      variables: { slug: params?.slug.join('/') ?? '' },
      operationName: query,
    }),
    getPage<PLPContentType>({
      ...(previewData?.contentType === 'plp' ? previewData : null),
      contentType: 'plp',
    }),
    getGlobalSectionsData(previewData),
  ])

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  return {
    props: {
      ...data,
      ...cmsPage,
      globalSections,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'
export default mark(Page)
