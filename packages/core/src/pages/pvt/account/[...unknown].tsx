import type { Locator } from '@vtex/client-cms'
import type { GetStaticPaths, GetStaticProps } from 'next'

import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

export default function Page() {
  return <></>
}

export const getStaticProps: GetStaticProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async () => {
  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: {},
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    redirect: {
      destination: '/pvt/account/404',
      permanent: false,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
