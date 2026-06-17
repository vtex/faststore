import type { PropsWithChildren, ReactNode } from 'react'
import { useAuth } from 'src/sdk/auth'

export type ProfileChallengeProps = {
  fallback?: ReactNode
}

const ProfileChallenge = ({
  fallback = null,
  children,
}: PropsWithChildren<ProfileChallengeProps>) => {
  const { isAuthenticated } = useAuth()

  return <>{isAuthenticated ? children : fallback}</>
}

export default ProfileChallenge
