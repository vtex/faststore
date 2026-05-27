import type { Locator, Section } from '@vtex/client-cms'
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
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { useRefreshToken } from 'src/sdk/account/useRefreshToken'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { getRequestHostname } from 'src/utils/getRequestHostname'
import { isLocalHost } from 'src/utils/isLocalHost'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  globalSections?: GlobalSectionsData
  pageSections: Section[]
  needsRefreshToken?: boolean
  fromPage?: string
}

function Page({
  globalSections: globalSectionsProp,
  pageSections,
  needsRefreshToken,
  fromPage,
}: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? { sections: [], settings: {} }

  const { shouldShow403 } = useRefreshToken(needsRefreshToken, fromPage)

  if (needsRefreshToken && !shouldShow403) {
    console.info('Refreshing authentication...')
    return <></>
  }

  return (
    <PageProvider context={{ globalSettings, accountPageData: {} }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <RenderSectionsBase
          sections={pageSections}
          components={ACCOUNT_COMPONENTS}
        />
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
    account,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myaccountunauthorized',
      contentContext,
      '/pvt/account/403'
    ),
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

  const fromPage =
    typeof context.query.from === 'string' ? context.query.from : ''

  if (account.errors) {
    console.error(...account.errors)

    const statusCode: number = (account.errors[0] as any)?.extensions?.status

    const isLocal = isLocalHost(getRequestHostname(context.req.headers.host))

    return {
      props: {
        globalSections: globalSectionsResult,
        pageSections: pageContent.sections,
        needsRefreshToken:
          !isLocal &&
          (statusCode === 401 || statusCode === 403) &&
          storeConfig.experimental?.refreshToken,
        fromPage,
      },
    }
  }

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    props: {
      globalSections: globalSectionsResult,
      pageSections: pageContent.sections,
      fromPage,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)

export default Page
