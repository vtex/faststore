/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { ProfileSection } from 'src/components/account/profile'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/profile/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/profile/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { gql } from '@generated/gql'
import { execute } from 'src/server'
import type {
  ServerProfileQueryQuery,
  ServerProfileQueryQueryVariables,
} from '@generated/graphql'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default function Profile({
  globalSections,
  accountName,
}: MyAccountProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout accountName={accountName}>
        <BeforeSection />
        <ProfileSection />
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerProfileQuery {
    accountName
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
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
    const statusCode: number = (profile.errors[0] as any)?.extensions?.status
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
      globalSections: globalSectionsResult,
      accountName: profile.data.accountName,
    },
  }
}
