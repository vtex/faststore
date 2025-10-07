import type { GetServerSideProps, NextPage } from 'next'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
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
