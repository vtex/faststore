import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
  ServerListQuotesQueryQuery,
  ServerListQuotesQueryQueryVariables,
} from '@generated/graphql'
import { ServerAccountPageQueryDocument } from '@generated/graphql'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/quotes/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/quotes/before'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'
import { MyAccountListQuotes } from 'src/components/account/quotes/MyAccountListQuotes'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { extractStatusFromError } from 'src/utils/utilities'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListQuotesPageProps = {
  listQuotes: ServerListQuotesQueryQuery['listUserQuotes']
  total: number
  perPage: number
  filters: {
    page: number
    status: string[]
    createdAtFrom: string
    createdAtTo: string
    expiresAtFrom: string
    expiresAtTo: string
  }
} & MyAccountProps

export default function ListQuotesPage({
  globalSections: globalSectionsProp,
  accountName,
  listQuotes,
  total,
  perPage,
  filters,
  isRepresentative,
}: ListQuotesPageProps) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout
          isRepresentative={isRepresentative}
          accountName={accountName}
        >
          <BeforeSection />
          <MyAccountListQuotes
            listQuotes={listQuotes}
            filters={filters}
            perPage={perPage}
            total={total}
          />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerListQuotesQuery ($page: Int, $perPage: Int, $status: [String], $createdAtFrom: String, $createdAtTo: String, $expiresAtFrom: String, $expiresAtTo: String) {
    listUserQuotes (page: $page, perPage: $perPage, status: $status, createdAtFrom: $createdAtFrom, createdAtTo: $createdAtTo, expiresAtFrom: $expiresAtFrom, expiresAtTo: $expiresAtTo) {
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

const getServerSidePropsBase: GetServerSideProps<
  MyAccountProps,
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

  const [
    listQuotesResult,
    accountProfileResult,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
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
        },
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    execute<ServerAccountPageQueryQueryVariables, ServerAccountPageQueryQuery>(
      { variables: {}, operation: ServerAccountPageQueryDocument },
      { headers: { ...context.req.headers } }
    ).catch(() => null),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

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

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: accountProfileResult?.data?.accountProfile?.name ?? '',
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
      },
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
