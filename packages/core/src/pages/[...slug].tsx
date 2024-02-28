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
import fetchFunctions from 'src/customizations/src/dynamicContent'
import {
  getPage,
  getPageByVersionId,
  PageContentType,
  PLPContentType,
} from 'src/server/cms'

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

  const [landingPagePromise, globalSectionsPromise] = [
    getLandingPageBySlug(slug, previewData),
    getGlobalSectionsData(previewData),
  ]

  if (await landingPagePromise) {
    // Checking if the fetch function corresponding to the slug exists
    const fetchFunction = fetchFunctions[slug]
    let serverData

    if (!fetchFunction) {
      console.warn(`Warning: Fetch function not found for slug: ${slug}`)
    } else {
      // Calling the fetch function corresponding to the slug
      serverData = await fetchFunction()
      console.log('🚀 ~ serverData:', serverData)
    }

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

  const [{ data, errors = [] }] = await Promise.all([
    execute<
      ServerCollectionPageQueryQueryVariables,
      ServerCollectionPageQueryQuery
    >({
      variables: { slug },
      operation: query,
    }),
  ])

  let pageData

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['plp'][0]

    if (page) {
      pageData = await getPageByVersionId<PLPContentType>({
        contentType: 'plp',
        documentId: page.documentId,
        versionId: page.versionId,
      })
    }
  } else {
    pageData = await getPage<PLPContentType>({
      ...(previewData?.contentType === 'plp' ? previewData : null),
      contentType: 'plp',
    })
  }

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
      page: pageData,
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
