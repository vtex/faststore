import type { Locator, Section } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { Layout } from 'src/components/account'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import GLOBAL_COMPONENTS from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
  ServerListQuotesQueryQuery,
  ServerListQuotesQueryQueryVariables,
  ServerQuotesOrganizationMemberQueryQuery,
  ServerQuotesOrganizationMemberQueryQueryVariables,
} from '@generated/graphql'
import { ServerAccountPageQueryDocument } from '@generated/graphql'
import AfterSection from 'src/customizations/src/myAccount/extensions/quotes/after'
import BeforeSection from 'src/customizations/src/myAccount/extensions/quotes/before'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountQuotesPageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'
import { extractStatusFromError } from 'src/utils/utilities'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListQuotesPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountQuotesPageData
} & MyAccountProps

export default function ListQuotesPage({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
}: ListQuotesPageProps) {
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
            skipLazyLoading
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
  query ServerListQuotesQuery ($page: Int, $perPage: Int, $status: [String], $createdAtFrom: String, $createdAtTo: String, $expiresAtFrom: String, $expiresAtTo: String, $label: String) {
    listUserQuotes (page: $page, perPage: $perPage, status: $status, createdAtFrom: $createdAtFrom, createdAtTo: $createdAtTo, expiresAtFrom: $expiresAtFrom, expiresAtTo: $expiresAtTo, label: $label) {
      list {
        id
        status
        label
        createdAt
        expiresAt
        amount
        createdBy
      }
      paging {
        total
        currentPage
        perPage
      }
    }
  }
`)

const organizationMemberQuery = gql(`
  query ServerQuotesOrganizationMemberQuery {
    isOrganizationMember
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  ListQuotesPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

  const contentContext = {
    previewData: context.previewData,
    locale: context.locale,
  }

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
  ] = getGlobalSectionsData(contentContext)

  const page = Number(context.query.page as string | undefined) || 1
  const perPage = 25
  const status = (
    Array.isArray(context.query.status)
      ? context.query.status
      : [context.query.status]
  ).filter(Boolean) as string[]
  const createdAtFrom =
    (context.query.createdAtFrom as string | undefined) || ''
  const createdAtTo = (context.query.createdAtTo as string | undefined) || ''
  const expiresAtFrom =
    (context.query.expiresAtFrom as string | undefined) || ''
  const expiresAtTo = (context.query.expiresAtTo as string | undefined) || ''
  const label = (context.query.label as string | undefined) || ''

  const [
    pageContent,
    listQuotesResult,
    accountProfileResult,
    organizationMemberResult,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myAccountQuotes',
      contentContext,
      '/pvt/account/quotes'
    ),
    execute<ServerListQuotesQueryQueryVariables, ServerListQuotesQueryQuery>(
      {
        variables: {
          page,
          perPage,
          status,
          createdAtFrom: createdAtFrom || undefined,
          createdAtTo: createdAtTo || undefined,
          expiresAtFrom: expiresAtFrom || undefined,
          expiresAtTo: expiresAtTo || undefined,
          label: label || undefined,
        },
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    execute<ServerAccountPageQueryQueryVariables, ServerAccountPageQueryQuery>(
      { variables: {}, operation: ServerAccountPageQueryDocument },
      { headers: { ...context.req.headers } }
    ).catch(() => null),
    execute<
      ServerQuotesOrganizationMemberQueryQueryVariables,
      ServerQuotesOrganizationMemberQueryQuery
    >(
      { variables: {}, operation: organizationMemberQuery },
      { headers: { ...context.req.headers } }
    ).catch(() => null),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (!organizationMemberResult?.data?.isOrganizationMember) {
    return {
      redirect: {
        destination: `/pvt/account/403?from=${encodeURIComponent('/pvt/account/quotes')}`,
        permanent: false,
      },
    }
  }

  if (listQuotesResult.errors) {
    console.error(...listQuotesResult.errors)

    const errorStatus = extractStatusFromError(listQuotesResult.errors[0])

    const destination =
      errorStatus === 403 || errorStatus === 401
        ? `/pvt/account/403?from=${encodeURIComponent('/pvt/account/quotes')}`
        : '/pvt/account/404'

    return {
      redirect: {
        destination,
        permanent: false,
      },
    }
  }

  if (!listQuotesResult.data.listUserQuotes) {
    return {
      redirect: {
        destination: '/pvt/account/404',
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
      accountName: accountProfileResult?.data?.accountProfile?.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        listQuotes: listQuotesResult.data.listUserQuotes,
        total: listQuotesResult.data.listUserQuotes.paging.total,
        perPage: listQuotesResult.data.listUserQuotes.paging.perPage,
        filters: {
          page: listQuotesResult.data.listUserQuotes.paging.currentPage ?? page,
          status,
          createdAtFrom,
          createdAtTo,
          expiresAtFrom,
          expiresAtTo,
          label,
        },
      },
      pageSections,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
