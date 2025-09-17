import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerUserDetailsQueryQuery,
  ServerUserDetailsQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'discovery.config'
import MyAccountUserDetails from 'src/components/account/MyAccountUserDetails/MyAccountUserDetails'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/user-details/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/user-details/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { validateUser } from 'src/sdk/account/validateUser'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type UserDetailsPagePros = {
  userDetails: {
    name: string
    email: string
    role: string[]
    orgUnit: string
  }
} & MyAccountProps

export default function Page({
  globalSections: globalSectionsProp,
  accountName,
  isRepresentative,
  userDetails,
}: UserDetailsPagePros) {
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
          <MyAccountUserDetails userDetails={userDetails} />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerUserDetailsQuery {
    accountName
    userDetails {
      name
      email
      role
      orgUnit
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
    userDetails,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerUserDetailsQueryQueryVariables, ServerUserDetailsQueryQuery>(
      {
        variables: {},
        operation: query,
      },
      {
        headers: { ...context.req.headers },
      }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  // If the user is not a representative (b2b), redirect them to the account home page
  if (!isRepresentative) {
    return {
      redirect: {
        destination: '/pvt/account',
        permanent: false,
      },
    }
  }

  if (userDetails?.errors) {
    console.error(...userDetails.errors)

    const statusCode: number = (userDetails.errors[0] as any)?.extensions
      ?.status
    const destination: string =
      statusCode === 403 ? '/pvt/account/403' : '/pvt/account/404'

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
      accountName: userDetails.data.accountName,
      userDetails: userDetails.data?.userDetails ?? {},
      isRepresentative,
    },
  }
}
