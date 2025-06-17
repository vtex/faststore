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

import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/user-details/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/user-details/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { gql } from '@generated/gql'
import { execute } from 'src/server'
import type {
  ServerUserDetailsQueryQuery,
  ServerUserDetailsQueryQueryVariables,
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '@generated/graphql'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default function UserDetails({
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
        <div>
          <h1>User Details</h1>
        </div>
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerUserDetailsQuery {
    accountName
  }
`)

const validateUserQuery = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const validateUserResult = await execute<
    ValidateUserQueryVariables,
    ValidateUserQuery
  >(
    {
      variables: {},
      operation: validateUserQuery,
    },
    {
      headers: { ...context.req.headers },
    }
  )

  const isValid = validateUserResult?.data?.validateUser?.isValid

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
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (userDetails.errors) {
    const statusCode: number = (userDetails.errors[0] as any)?.extensions
      ?.status
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
      accountName: userDetails.data.accountName,
    },
  }
}
