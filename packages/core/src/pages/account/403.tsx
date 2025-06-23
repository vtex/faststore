import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import { LinkButton } from '@faststore/ui'
import { MyAccountLayout } from 'src/components/account'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import RenderSections from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { type PageContentType, getPage } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { gql } from '@generated/gql'
import { execute } from 'src/server'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '@generated/graphql'
import { validateUser } from 'src/sdk/account/validateUser'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  globalSections: GlobalSectionsData
  accountName: ServerAccountPageQueryQuery['accountName']
}

function Page({ globalSections, accountName }: Props) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout accountName={accountName}>
        <EmptyState
          title="Unauthorized Access"
          titleIcon={{ icon: 'ShoppingCart', alt: 'Shopping Cart' }}
          subtitle="You don't have permission to access this page."
          showLoader={false}
        >
          <LinkButton variant="secondary" href="/account">
            Back to Account
          </LinkButton>
        </EmptyState>
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerAccountPageQuery {
    accountName
  }
`)

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const isValid = await validateUser(context)

  if (!isValid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
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
  ] = getGlobalSectionsData(context.previewData)

  const [
    page,
    account,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    getPage<PageContentType>({
      ...(context.previewData?.contentType === '403' && context.previewData),
      contentType: '403',
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

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      // The sections from the CMS page are not utilized here for the My Account page.
      // page,
      globalSections: globalSectionsResult,
      accountName: account.data.accountName,
    },
  }
}

export default Page
