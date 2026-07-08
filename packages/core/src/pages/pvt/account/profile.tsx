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
  ServerProfileQueryQuery,
  ServerProfileQueryQueryVariables,
} from '@generated/graphql'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/profile/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/profile/before'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountProfilePageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { localizeRedirectDestination } from 'src/utils/localization/localizeRedirectDestination'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'

import storeConfig from 'discovery.config'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ProfilePageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountProfilePageData
} & MyAccountProps

export default function Profile({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
}: ProfilePageProps) {
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
  query ServerProfileQuery {
    accountProfile {
      name
      email
      id
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  ProfilePageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })
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
    profile,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myAccountProfile',
      contentContext,
      '/pvt/account/profile'
    ),
    execute<ServerProfileQueryQueryVariables, ServerProfileQueryQuery>(
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

  if (profile.errors) {
    console.error(...profile.errors)

    const statusCode: number = (profile.errors[0] as any)?.extensions?.status

    const destination: string =
      statusCode === 401 || statusCode === 403
        ? `/pvt/account/403?from=${encodeURIComponent('/pvt/account/profile')}`
        : '/pvt/account/404'

    return {
      redirect: {
        destination: localizeRedirectDestination(destination, context),
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
      globalSections: globalSectionsResult,
      accountName: profile.data.accountProfile.name ?? '',
      accountPageData: {
        profile: profile.data.accountProfile,
      },
      pageSections,
      navigationLabels: navigationData as AccountNavigationLabels,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
