import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import type { GetStaticPaths, GetStaticProps } from 'next'

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
import { getPage, PageContentType, PLPContentType } from 'src/server/cms'
import { ProductListingPageProps } from 'src/components/templates/ProductListingPage'
import {
  getLandingPageBySlug,
  LandingPageProps,
} from 'src/components/templates/LandingPage'
import { lazy, Suspense } from 'react'

const LandingPage = lazy(() => import('src/components/templates/LandingPage'))

const ProductListingPage = lazy(
  () => import('src/components/templates/ProductListingPage')
)

type BaseProps = {
  globalSections: GlobalSectionsData
}

type Props = BaseProps &
  (
    | ({
        type: 'plp'
        page: PLPContentType
      } & ServerCollectionPageQueryQuery)
    | {
        type: 'page'
        page: PageContentType
      }
  )

function Page({ globalSections, type, ...otherProps }: Props) {
  return (
    <GlobalSections {...globalSections}>
      {type === 'plp' && (
        <Suspense fallback={null}>
          <ProductListingPage {...(otherProps as ProductListingPageProps)} />
        </Suspense>
      )}
      {type === 'page' && (
        <Suspense fallback={null}>
          <LandingPage {...(otherProps as LandingPageProps)} />
        </Suspense>
      )}
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
  const [landingPagePromise, globalSectionsPromise] = [
    getLandingPageBySlug(params?.slug[0], previewData),
    getGlobalSectionsData(previewData),
  ]

  if (await landingPagePromise) {
    return {
      props: {
        page: await landingPagePromise,
        globalSections: await globalSectionsPromise,
        type: 'page',
      },
    }
  }

  const [{ data, errors = [] }, page] = await Promise.all([
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
      ...data,
      page,
      globalSections: await globalSectionsPromise,
      type: 'plp',
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
