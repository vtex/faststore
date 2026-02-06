import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '@generated/graphql'
import { MyAccountLayout } from 'src/components/account'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { type PageContentType, getPage } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { withLocaleValidationSSR } from 'src/utils/withLocaleValidation'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  EmptyState,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
  accountName: ServerAccountPageQueryQuery['accountProfile']['name']
}

function Page({
  page: { sections },
  globalSections: globalSectionsProp,
  accountName,
}: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout accountName={accountName}>
          {sections && sections.length > 0 && (
            <RenderSectionsBase sections={sections} components={COMPONENTS} />
          )}
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerAccountPageQuery {
    accountProfile {
      name
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(context.previewData)

  const [
    page,
    account,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    getPage<PageContentType>({
      ...(context.previewData?.contentType === '404' && context.previewData),
      contentType: '404',
    }),
    execute<ServerAccountPageQueryQueryVariables, ServerAccountPageQueryQuery>(
      {
        variables: {},
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (account.errors) {
    console.error(...account.errors)

    const statusCode: number = (account.errors[0] as any)?.extensions?.status

    // Redirect to 403 for authentication errors (401/403) to handle token refresh
    if (statusCode === 401 || statusCode === 403) {
      return {
        redirect: {
          destination: `/pvt/account/403?from=${encodeURIComponent('/pvt/account/404')}`,
          permanent: false,
        },
      }
    }
  }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      page,
      globalSections: globalSectionsResult,
      accountName: account.data.accountProfile.name,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)

export default Page
