import storeConfig from 'discovery.config'

import type { GetServerSideProps, NextPage } from 'next'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // TODO validate permissions here

  if (storeConfig.experimental.enableFaststoreMyAccount) {
    return {
      redirect: {
        destination: '/account/profile',
        permanent: false,
      },
    }
  }

  const searchParams = new URLSearchParams()

  for (const key in query) {
    const value = query[key]
    const values = Array.isArray(value) ? value : [value]
    values.forEach((v) => v && searchParams.append(key, v))
  }

  return {
    redirect: {
      destination: `${storeConfig.accountUrl}?${searchParams.toString()}`,
      permanent: false,
    },
  }
}

export default MyAccountRedirectPage
