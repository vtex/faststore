/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/security/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/security/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { execute } from 'src/server'
import { gql } from '@generated/gql'
import type {
  ServerSecurityQueryQuery,
  ServerSecurityQueryQueryVariables,
  ServerUserEmailQuery,
  ServerUserEmailQueryVariables,
} from '@generated/graphql'
import { validateUser } from 'src/sdk/account/validateUser'
import storeConfig from '../../../discovery.config'
import { SecuritySection } from 'src/components/account/security'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type SecurityPageProps = {
  accountName: string
  userEmail: string
} & MyAccountProps

export default function Page({
  globalSections,
  accountName,
  isRepresentative,
  userEmail,
}: SecurityPageProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout
        isRepresentative={isRepresentative}
        accountName={accountName}
      >
        <BeforeSection />
        <SecuritySection userEmail={userEmail} />
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

const securityQuery = gql(`
  query ServerSecurityQuery {
    accountName
  }
`)

const userDetailsQuery = gql(`
  query ServerUserEmail {
    userDetails {
      email
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
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

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(context.previewData)

  const [
    security,
    userDetails,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerSecurityQueryQueryVariables, ServerSecurityQueryQuery>(
      {
        variables: {},
        operation: securityQuery,
      },
      { headers: { ...context.req.headers } }
    ),
    execute<ServerUserEmailQueryVariables, ServerUserEmailQuery>(
      {
        variables: {},
        operation: userDetailsQuery,
      },
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (security.errors) {
    const statusCode: number = (security.errors[0] as any)?.extensions?.status
    const destination: string =
      statusCode === 403 ? '/account/403' : '/account/404'

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
      userEmail: userDetails.data.userDetails.email || '',
      globalSections: globalSectionsResult,
      accountName: security.data.accountName,
      isRepresentative,
    },
  }
}
