/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import { ProfileSection } from 'src/components/account/profile'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerProfileQueryQuery,
  ServerProfileQueryQueryVariables,
} from '@generated/graphql'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/profile/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/profile/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { validateUser } from 'src/sdk/account/validateUser'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ProfilePagePros = {
  accountProfile: {
    name: string | null
    email: string | null
    id: string | null
  }
} & MyAccountProps

export default function Profile({
  globalSections: globalSectionsProp,
  accountProfile,
  isRepresentative,
}: ProfilePagePros) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout
          isRepresentative={isRepresentative}
          accountName={accountProfile.name}
        >
          <BeforeSection />
          <ProfileSection profile={accountProfile} />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerProfileQuery {
    accountProfile {
      name
      email
      id
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

  const [profile, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      execute<ServerProfileQueryQueryVariables, ServerProfileQueryQuery>(
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

  if (profile.errors) {
    console.error(...profile.errors)

    const statusCode: number = (profile.errors[0] as any)?.extensions?.status
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
      accountProfile: profile.data.accountProfile,
      isRepresentative,
    },
  }
}
