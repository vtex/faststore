import { validateUser } from 'src/sdk/account/validateUser'
import type { GetServerSideProps, NextPage } from 'next'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const isValid = await validateUser({ query, req } as any)

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
      destination: '/account/profile',
      permanent: false,
    },
  }
}

export default MyAccountRedirectPage
