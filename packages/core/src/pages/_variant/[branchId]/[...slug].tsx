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
import type { SearchState } from '@faststore/sdk'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { getLandingPageBySlug } from 'src/components/templates/LandingPage'
import { getRedirect } from 'src/sdk/redirects'
import { execute } from 'src/server'
import type { PageContentType } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import type { PLPContentType } from 'src/server/cms/plp'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { getVariantBranchId } from 'src/server/content/utils'
import { getDynamicContent } from 'src/utils/dynamicContent'
import { fetchServerManyProducts } from 'src/utils/fetchProductGallerySSR'

// Reuse the original PLP/landing page component — only the data fetching differs.
import CatchAllPage from '../../[...slug]'

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
  { branchId: string; slug: string[] },
  PreviewData
> = async ({ params, previewData, locale }) => {
  const slug = params?.slug.join('/') ?? ''
  const branchId = getVariantBranchId(params)
  const rewrites = (await storeConfig.rewrites?.()) ?? []
  const contentContext = { previewData, locale, branchId }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)

  const landingPagePromise = getLandingPageBySlug(slug, contentContext)

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
        ...contentContext,
        slug,
        locale,
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
      locale,
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

export default CatchAllPage
