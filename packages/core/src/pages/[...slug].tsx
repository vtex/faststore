import { isNotFoundError } from '@faststore/api'
import storeConfig from 'discovery.config'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { gql } from '@generated'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '@generated/graphql'
import { execute } from 'src/server'

import type { SearchState } from '@faststore/sdk'
import dynamic from 'next/dynamic'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import {
  getLandingPageBySlug,
  type LandingPageProps,
} from 'src/components/templates/LandingPage'
import ProductListingPage, {
  type ProductListingPageProps,
} from 'src/components/templates/ProductListingPage'
import { getRedirect } from 'src/sdk/redirects'
import type { PageContentType } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import type { PLPContentType } from 'src/server/cms/plp'
import { getDynamicContent } from 'src/utils/dynamicContent'
import { fetchServerManyProducts } from 'src/utils/fetchProductGallerySSR'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'

const LandingPage = dynamic(
  () => import('src/components/templates/LandingPage')
)

type BaseProps = {
  globalSections: GlobalSectionsData
}

type Props = BaseProps &
  (
    | {
        type: 'plp'
        page: PLPContentType
        data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
        serverManyProductsVariables: ServerManyProductsQueryQueryVariables
      }
    | {
        type: 'page'
        slug: string
        page: PageContentType
        serverData?: unknown
      }
  )

function Page({ globalSections, type, ...otherProps }: Props) {
  return (
    <>
      {type === 'plp' && (
        <ProductListingPage
          globalSections={globalSections.sections}
          {...(otherProps as ProductListingPageProps)}
        />
      )}
      {type === 'page' && (
        <LandingPage
          globalSections={globalSections.sections}
          {...(otherProps as LandingPageProps)}
        />
      )}
    </>
  )
}

const query = gql(`
  query ServerCollectionPageQuery($slug: String!) {
    ...ServerCollectionPage
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
`)

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string[] },
  PreviewData
> = async ({ params, previewData }) => {
  const slug = params?.slug.join('/') ?? ''
  const rewrites = (await storeConfig.rewrites?.()) ?? []

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const landingPagePromise = getLandingPageBySlug(slug, previewData)

  const landingPage = await landingPagePromise

  if (landingPage) {
    const [
      serverData,
      globalSections,
      globalSectionsHeader,
      globalSectionsFooter,
    ] = await Promise.all([
      getDynamicContent({ pageType: slug }),
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

    const globalSectionsResult = injectGlobalSections({
      globalSections,
      globalSectionsHeader,
      globalSectionsFooter,
    })

    return {
      props: {
        page: landingPage,
        globalSections: globalSectionsResult,
        type: 'page',
        slug,
        serverData,
      },
    }
  }

  const [
    { data, errors = [] },
    cmsPage,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<
      ServerCollectionPageQueryQueryVariables,
      ServerCollectionPageQueryQuery
    >({
      variables: { slug },
      operation: query,
    }),
    contentService.getPlpContent(
      {
        previewData,
        slug,
      },
      rewrites
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  const [serverManyProductsData, serverManyProductsVariables] =
    await fetchServerManyProducts({
      itemsPerPage: cmsPage?.settings?.productGallery?.itemsPerPage,
      sort: cmsPage?.settings?.productGallery
        ?.sortBySelection as SearchState['sort'],
      term: '',
      selectedFacets: data?.collection?.meta.selectedFacets,
    })

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    if (storeConfig.experimental.enableRedirects) {
      const redirect = await getRedirect({ pathname: `/${slug}` })
      if (redirect) {
        return {
          redirect,
          revalidate: 60 * 5, // 5 minutes
        }
      }
    }

    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    console.error(...errors)
    throw errors[0]
  }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      data: {
        ...data,
        ...serverManyProductsData,
      },
      serverManyProductsVariables,
      page: cmsPage,
      globalSections: globalSectionsResult,
      type: 'plp',
      key: slug,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page
