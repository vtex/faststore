import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from '../../components/cms/GlobalSections'

import { LinkButton } from '@vtex/faststore-ui'
import { gql } from '../../../@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '../../../@generated/graphql'
import { MyAccountLayout } from '../../components/account'
import { default as GLOBAL_COMPONENTS } from '../../components/cms/global/Components'
import RenderSections from '../../components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from '../../components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from '../../customizations/src/components'
import PLUGINS_COMPONENTS from '../../plugins'
import { validateUser } from '../../sdk/account/validateUser'
import PageProvider from '../../sdk/overrides/PageProvider'
import { execute } from '../../server'
import { type PageContentType, getPage } from '../../server/cms'
import { injectGlobalSections } from '../../server/cms/global'
import { getMyAccountRedirect } from '../../utils/myAccountRedirect'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  globalSections: GlobalSectionsData
  accountName: ServerAccountPageQueryQuery['accountProfile']['name']
}

function Page({ globalSections: globalSectionsProp, accountName }: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout accountName={accountName}>
          <EmptyState
            title="Unauthorized Access"
            titleIcon={{ icon: 'ShoppingCart', alt: 'Shopping Cart' }}
            subtitle="You don't have permission to access this page."
            showLoader={false}
          >
            <LinkButton variant="secondary" href="/pvt/account">
              Back to Account
            </LinkButton>
          </EmptyState>
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
      accountName: account.data.accountProfile.name,
    },
  }
}

export default Page
