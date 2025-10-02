import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import type {} from '../../@generated/graphql'

import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../components/cms/GlobalSections'
import { getIsRepresentative } from '../sdk/account/getIsRepresentative'

import storeConfig from '../../discovery.config'
import { injectGlobalSections } from '../server/cms/global'
import {
  serverAccountRequest,
  serverValidateUser,
} from '../server/envelop-requests'
import { getMyAccountRedirect } from '../utils/myAccountRedirect'

export type MyAccountProps = {
  globalSections: GlobalSectionsData
  accountName: string
  isRepresentative?: boolean
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

  const [account, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
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
      globalSections: globalSectionsResult,
      accountName: account.data.accountName,
      isRepresentative,
    },
  }
}
