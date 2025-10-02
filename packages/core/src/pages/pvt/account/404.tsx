import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../../../components/cms/GlobalSections'

import { gql } from '../../../../@generated/gql'
import type { ServerAccountPageQueryQuery } from '../../../../@generated/graphql'
import { MyAccountLayout } from '../../../components/account'
import { default as GLOBAL_COMPONENTS } from '../../../components/cms/global/Components'
import RenderSections, {
  RenderSectionsBase,
} from '../../../components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from '../../../components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from '../../../customizations/src/components'
import PLUGINS_COMPONENTS from '../../../plugins'
import PageProvider from '../../../sdk/overrides/PageProvider'
import { getPage, type PageContentType } from '../../../server/cms'
import { injectGlobalSections } from '../../../server/cms/global'
import {
  serverAccountRequest,
  serverValidateUser,
} from '../../../server/envelop-requests'
import { getMyAccountRedirect } from '../../../utils/myAccountRedirect'

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
  accountName: ServerAccountPageQueryQuery['accountName']
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
    accountName
  }
`)

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const isValid = await serverValidateUser(context)

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
      ...(context.previewData?.contentType === '404' && context.previewData),
      contentType: '404',
    }),
    serverAccountRequest(context),
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
