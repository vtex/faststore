import { isNotFoundError } from '@faststore/api'
import storeConfig from 'faststore-config'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { gql } from '../../@generated'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '../../@generated/graphql'
import { execute } from '../server'

import type { SearchState } from '@faststore/sdk'
import dynamic from 'next/dynamic'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../components/cms/GlobalSections'
import {
  getLandingPageBySlug,
  type LandingPageProps,
} from '../components/templates/LandingPage'
import ProductListingPage, {
  type ProductListingPageProps,
} from '../components/templates/ProductListingPage'
import { getRedirect } from '../sdk/redirects'
import type { PageContentType } from '../server/cms'
import { injectGlobalSections } from '../server/cms/global'
import type { PLPContentType } from '../server/cms/plp'
import { contentService } from '../server/content/service'
import type { PreviewData } from '../server/content/types'
import { getDynamicContent } from '../utils/dynamicContent'
import { fetchServerManyProducts } from '../utils/fetchProductGallerySSR'

const LandingPage = dynamic(() => import('../components/templates/LandingPage'))

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

function Page({
  globalSections: globalSectionsProp,
  type,
  ...otherProps
}: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <>
      {type === 'plp' && (
        <ProductListingPage
          globalSections={globalSections}
          globalSettings={globalSettings}
          {...(otherProps as ProductListingPageProps)}
        />
      )}
      {type === 'page' && (
        <LandingPage
          globalSections={globalSections}
          globalSettings={globalSettings}
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

  if (landingPage && Object.keys(landingPage).length > 0) {
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
