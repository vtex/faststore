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

import storeConfig from '../../faststore.config'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { Locator } from '@vtex/client-cms'

type Props = ServerCollectionPageQueryQuery & {
  globalSections: GlobalSectionsData
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

function Page({ globalSections, ...props }: Props) {
  const { collection } = props
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams(props)

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
        <Breadcrumb
          breadcrumbList={collection?.breadcrumbList.itemListElement}
          name={title}
        />

        <Hero
          variant="secondary"
          title={title}
          subtitle={`All the amazing ${title} from the brands we partner with.`}
          image={{
            src: 'https://storeframework.vtexassets.com/arquivos/ids/190897/Photo.jpg',
            alt: 'Quest 2 Controller on a table',
          }}
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
> = async (context) => {
  const { params } = context

  const { data, errors = [] } = await execute<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug: params?.slug.join('/') ?? '' },
    operationName: query,
  })

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const globalSections = await getGlobalSectionsData(context.previewData)

  return {
    props: {
      ...data,
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
