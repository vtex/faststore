/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from '../../../components/account'
import RenderSections from '../../../components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from '../../../components/cms/global/Components'
import CUSTOM_COMPONENTS from '../../../customizations/src/components'

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'

import type {} from '../../../../@generated/graphql'
import { getGlobalSectionsData } from '../../../components/cms/GlobalSections'
import { default as AfterSection } from '../../../customizations/src/myAccount/extensions/security/after'
import { default as BeforeSection } from '../../../customizations/src/myAccount/extensions/security/before'
import type { MyAccountProps } from '../../../experimental/myAccountSeverSideProps'
import { getIsRepresentative } from '../../../sdk/account/getIsRepresentative'
import { injectGlobalSections } from '../../../server/cms/global'
import { getMyAccountRedirect } from '../../../utils/myAccountRedirect'

import PageProvider from '../../../sdk/overrides/PageProvider'
import {
  serverSecurityRequest,
  serverValidateUser,
} from '../../../server/envelop-requests'

import storeConfig from '../../../../discovery.config'
import { SecuritySection } from '../../../components/account/security'

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
  globalSections: globalSectionsProp,
  accountName,
  isRepresentative,
  userEmail,
}: SecurityPageProps) {
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
          <SecuritySection userEmail={userEmail} />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
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

  const [security, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      serverSecurityRequest(context),
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  if (security.errors) {
    console.error(...security.errors)
    const statusCode: number = (security.errors[0] as any)?.extensions?.status
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
      accountName: security.data.accountName,
      userEmail: security.data?.userDetails.email || '',
      globalSections: globalSectionsResult,
      isRepresentative,
    },
  }
}
