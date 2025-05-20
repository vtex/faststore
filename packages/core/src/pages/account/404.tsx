import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import { MyAccountLayout } from 'src/components/account'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { type PageContentType, getPage } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { gql } from '@generated/gql'
import { execute } from 'src/server'
import type {
  ServerAccountErrorQueryQuery,
  ServerAccountErrorQueryQueryVariables,
} from '@generated/graphql'

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
  accountName: ServerAccountErrorQueryQuery['accountName']
}

function Page({ page: { sections }, globalSections, accountName }: Props) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout accountName={accountName}>
        {sections && sections.length > 0 && (
          <RenderSectionsBase sections={sections} components={COMPONENTS} />
        )}
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerAccountErrorQuery {
    accountName
  }
`)

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  // TODO validate permissions here

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
    execute<
      ServerAccountErrorQueryQueryVariables,
      ServerAccountErrorQueryQuery
    >(
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
      page,
      globalSections: globalSectionsResult,
      accountName: account.data.accountName,
    },
  }
}

export default Page
