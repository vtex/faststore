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
import ProductListingPage, {
  ProductListingPageProps,
} from 'src/components/templates/ProductListingPage'
import LandingPage, {
  getLandingPageBySlug,
  LandingPageProps,
} from 'src/components/templates/LandingPage'

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
        <ProductListingPage {...(otherProps as ProductListingPageProps)} />
      )}
      {type === 'page' && <LandingPage {...(otherProps as LandingPageProps)} />}
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
  const slug = params?.slug.join('/') ?? ''

  const [landingPagePromise, globalSectionsPromise] = [
    getLandingPageBySlug(slug, previewData),
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
      variables: { slug },
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
