import React, { FC } from 'react'

import { useProfile } from '../../sdk/session/useProfile'
// import SuspenseSSR from '../Suspense/SSR'
import Anonymous from './Anonymous'
import Authenticated from './Authenticated'

const Login: FC = () => {
  const profile = useProfile()
  const name = profile?.firstName?.value ?? profile?.email?.value
  const isAuthenticated = profile?.isAuthenticated?.value === 'true'

  return isAuthenticated ? <Authenticated name={name!} /> : <Anonymous />
}

// const LoginContainer: FC = () => (
//   <SuspenseSSR fallback={<Anonymous />}>
//     <Login />
//   </SuspenseSSR>
// )

export default Login
