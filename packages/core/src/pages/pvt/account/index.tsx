import type { GetServerSideProps, NextPage } from 'next'
import { localizeRedirectDestination } from 'src/utils/localization/localizeRedirectDestination'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

const getServerSidePropsBase: GetServerSideProps = async (context) => {
  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    redirect: {
      destination: localizeRedirectDestination('/pvt/account/profile', context),
      permanent: false,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)

export default MyAccountRedirectPage
