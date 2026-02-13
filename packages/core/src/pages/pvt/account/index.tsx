import type { GetServerSideProps, NextPage } from 'next'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { withLocaleValidationSSR } from 'src/utils/withLocaleValidation'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

const getServerSidePropsBase: GetServerSideProps = async ({ query, req }) => {
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

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)

export default MyAccountRedirectPage
