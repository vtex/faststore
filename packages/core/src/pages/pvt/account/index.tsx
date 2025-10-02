import type { GetServerSideProps, NextPage } from 'next'
import { serverValidateUser } from '../../../server/envelop-requests'
import { getMyAccountRedirect } from '../../../utils/myAccountRedirect'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const isValid = await serverValidateUser({ query, req } as any)

  if (!isValid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    redirect: {
      destination: '/pvt/account/profile',
      permanent: false,
    },
  }
}

export default MyAccountRedirectPage
