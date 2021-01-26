import React from 'react'
import type { FC } from 'react'
import { Authenticated, Anonymous } from '@vtex/store-ui'

import { useProfile } from '../sdk/session/useProfile'
import SuspenseSSR from './Suspense/SSR'

const Login: FC = () => {
  const profile = useProfile()
  const name = profile?.firstName?.value ?? profile?.email?.value
  const isAuthenticated = profile?.isAuthenticated?.value === 'true'

  return isAuthenticated ? <Authenticated name={name!} /> : <Anonymous />
}

const LoginContainer: FC = () => (
  <SuspenseSSR fallback={<Anonymous />}>
    <Login />
  </SuspenseSSR>
)

export default LoginContainer
