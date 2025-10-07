import storeConfig from 'discovery.config'

export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshTokenUrl = `${storeConfig.storeUrl}/api/vtexid/refreshtoken/webstore`
    const response = await fetch(refreshTokenUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    return response.ok
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}

export const handleRefreshTokenAndReload = async () => {
  const success = await refreshToken()

  if (success) {
    // Refresh token successful, go back to the page that called 403
    // Forces complete navigation through getServerSideProps
    const previousPage = document.referrer || '/pvt/account'
    window.location.href = previousPage
  } else {
    // Refresh token failed, redirect to login
    window.location.href = '/login'
  }
}
