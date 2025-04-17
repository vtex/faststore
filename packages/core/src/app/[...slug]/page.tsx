import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import CatchClient from './catch-client'
import { getLandingPageBySlug } from 'src/components/templates/LandingPage'
import { getDynamicContent } from 'src/utils/dynamicContent'
import { injectGlobalSections } from 'src/server/cms/global'
import { gql } from '@generated'
import { execute } from 'src/server'
import { getPLP } from 'src/server/cms/plp'
import { fetchServerManyProducts } from 'src/utils/fetchProductGallerySSR'
import type { SearchState } from '@faststore/sdk'
import { isNotFoundError } from '@faststore/api'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import type { ComponentProps } from 'react'

interface Props {
  params: Promise<{ slug: string[] }>
}

export default async function Fallback(props: Props) {
  const { params } = props
  const { slug } = await params

  const pageProps = (await getPageProps({
    slug,
  })) as ComponentProps<typeof CatchClient>

  return <CatchClient {...pageProps} />
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

interface GetPagePropsParams {
  slug: string[]
  previewData?: any
}

async function getPageProps(params: GetPagePropsParams) {
  const { slug: slugArray, previewData } = params

  const slug = slugArray.join('/') ?? ''
  const rewrites: any[] = []

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
      page: landingPage,
      globalSections: globalSectionsResult,
      type: 'page',
      slug,
      serverData,
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
    getPLP(slug, previewData, rewrites),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  const serverMany = await fetchServerManyProducts({
    itemsPerPage: cmsPage?.settings?.productGallery?.itemsPerPage,
    sort: cmsPage?.settings?.productGallery
      ?.sortBySelection as SearchState['sort'],
    term: '',
    selectedFacets: data?.collection?.meta.selectedFacets,
  })

  const [serverManyProductsData, serverManyProductsVariables] = serverMany!

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    // if (storeConfig.experimental.enableRedirects) {
    //   const redirect = await getRedirect({ pathname: `/${slug}` })
    //   if (redirect) {
    //     return {
    //       redirect,
    //       revalidate: 60 * 5, // 5 minutes
    //     }
    //   }
    // }

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
    data: {
      ...data,
      ...serverManyProductsData,
    },
    serverManyProductsVariables,
    page: cmsPage,
    globalSections: globalSectionsResult,
    type: 'plp',
    key: slug,
  }
}

export async function generateStaticParams() {
  return []
}
