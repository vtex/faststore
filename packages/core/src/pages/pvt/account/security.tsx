import type { Locator, Section } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { Layout } from 'src/components/account'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerSecurityQuery,
  ServerSecurityQueryVariables,
} from '@generated/graphql'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/security/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/security/before'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountSecurityPageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'

import PageProvider from 'src/sdk/overrides/PageProvider'

import storeConfig from 'discovery.config'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type SecurityPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountSecurityPageData
} & MyAccountProps

export default function Page({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
}: SecurityPageProps) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider
      context={{
        globalSettings,
        accountPageData,
        navigationLabels,
      }}
    >
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <Layout
          isRepresentative={isRepresentative}
          accountName={accountName}
          navigationLabels={navigationLabels}
        >
          <BeforeSection />
          <RenderSectionsBase
            sections={pageSections}
            components={ACCOUNT_COMPONENTS}
          />
          <AfterSection />
        </Layout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerSecurity {
    accountProfile {
      name
    }
    userDetails {
      email
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  SecurityPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const contentContext = {
    previewData: context.previewData,
    locale: context.locale,
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)

  const [
    pageContent,
    security,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myaccountsecurity',
      contentContext,
      '/pvt/account/security'
    ),
    execute<ServerSecurityQueryVariables, ServerSecurityQuery>(
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

  if (security.errors) {
    console.error(...security.errors)
    const statusCode: number = (security.errors[0] as any)?.extensions?.status

    const destination: string =
      statusCode === 401 || statusCode === 403
        ? `/pvt/account/403?from=${encodeURIComponent('/pvt/account/security')}`
        : '/pvt/account/404'

    return {
      redirect: {
        destination,
        permanent: false,
      },
    }
  }

  const { pageSections, navigationData } = extractAccountNavigationData(
    pageContent.sections
  )

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      accountName: security.data.accountProfile.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        userEmail: security.data?.userDetails.email || '',
      },
      globalSections: globalSectionsResult,
      pageSections,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
