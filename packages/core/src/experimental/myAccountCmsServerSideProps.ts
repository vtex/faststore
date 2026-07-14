import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '@generated/graphql'
import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'

import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { validateUser } from 'src/sdk/account/validateUser'
import { execute } from 'src/server'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { localizeRedirectDestination } from 'src/utils/localization/localizeRedirectDestination'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import storeConfig from '../../discovery.config'
import type { MyAccountProps } from './myAccountServerSideProps'

export type MyAccountCmsPageProps = MyAccountProps & {
  pageSections: Array<{
    name: string
    data: Record<string, unknown>
    $componentKey?: string
  }>
  navigationLabels: AccountNavigationLabels
}

const query = gql(`
  query ServerAccountPageQuery {
    accountProfile {
      name
    }
  }
`)

/**
 * Reusable SSR factory for CMS-driven custom My Account pages.
 * Keeps the same auth/redirect guards as `myAccountServerSideProps`.
 */
export function myAccountCmsServerSideProps(
  contentType: string,
  pagePath: string
): GetServerSideProps<MyAccountCmsPageProps, Record<string, string>, Locator> {
  const handler: GetServerSideProps<
    MyAccountCmsPageProps,
    Record<string, string>,
    Locator
  > = async (context) => {
    const contentContext = {
      previewData: context.previewData,
      locale: context.locale,
    }

    const validationResult = await validateUser(context)

    if (!validationResult.isValid && !validationResult.needsRefresh) {
      return {
        redirect: {
          destination: localizeRedirectDestination('/login', context),
          permanent: false,
        },
      }
    }

    if (!validationResult.isValid && validationResult.needsRefresh) {
      const currentPath = context.req.url || '/pvt/account'
      return {
        redirect: {
          destination: localizeRedirectDestination(
            `/pvt/account/403?from=${encodeURIComponent(currentPath)}`,
            context
          ),
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

    const isRepresentative = getIsRepresentative({
      headers: context.req.headers as Record<string, string>,
      account: storeConfig.api.storeId,
    })

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
      fetchMyAccountPageContent(contentType, contentContext, pagePath),
      execute<
        ServerAccountPageQueryQueryVariables,
        ServerAccountPageQueryQuery
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
        globalSections: globalSectionsResult as GlobalSectionsData,
        accountName: account.data?.accountProfile?.name ?? '',
        isRepresentative,
        pageSections,
        navigationLabels: navigationData as AccountNavigationLabels,
      },
    }
  }

  return withLocaleValidationSSR(handler)
}
