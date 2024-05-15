import { isNotFoundError } from '@faststore/api'
import storeConfig from 'faststore.config'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { gql } from '@generated'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'

import { Locator } from '@vtex/client-cms'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import LandingPage, {
  getLandingPageBySlug,
  LandingPageProps,
} from 'src/components/templates/LandingPage'
import ProductListingPage, {
  ProductListingPageProps,
} from 'src/components/templates/ProductListingPage'
import { PageContentType } from 'src/server/cms'
import { getPLP, PLPContentType } from 'src/server/cms/plp'
import { getDynamicContent } from 'src/utils/dynamicContent'

type BaseProps = {
  globalSections: GlobalSectionsData
}

type Props = BaseProps &
  (
    | {
        type: 'plp'
        page: PLPContentType
        data: ServerCollectionPageQueryQuery
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
    <GlobalSections {...globalSections}>
      {type === 'plp' && (
        <ProductListingPage {...(otherProps as ProductListingPageProps)} />
      )}
      {type === 'page' && <LandingPage {...(otherProps as LandingPageProps)} />}
    </GlobalSections>
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
  Locator
> = async ({ params, previewData }) => {
  const slug = params?.slug.join('/') ?? ''
  const rewrites = await storeConfig.rewrites?.()

  const [landingPagePromise, globalSectionsPromise] = [
    getLandingPageBySlug(slug, previewData),
    getGlobalSectionsData(previewData),
  ]

  if (await landingPagePromise) {
    const serverData = await getDynamicContent({ pageType: slug })

    return {
      props: {
        page: await landingPagePromise,
        globalSections: await globalSectionsPromise,
        type: 'page',
        slug,
        serverData,
      },
    }
  }

  const [{ data, errors = [] }, cmsPage] = await Promise.all([
    execute<
      ServerCollectionPageQueryQueryVariables,
      ServerCollectionPageQueryQuery
    >({
      variables: { slug },
      operation: query,
    }),
    getPLP(slug, previewData, rewrites),
  ])

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    console.error(...errors)
    throw errors[0]
  }

  return {
    props: {
      data,
      page: cmsPage,
      globalSections: await globalSectionsPromise,
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

Page.displayName = 'Page'
export default mark(Page)
