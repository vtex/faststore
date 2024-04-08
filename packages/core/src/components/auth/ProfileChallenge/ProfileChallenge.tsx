import { PropsWithChildren, ReactNode } from 'react'
import { useAuth } from 'src/sdk/auth'

export type ProfileChallengeProps = {
  fallback: ReactNode
}

const ProfileChallenge = ({
  fallback,
  children,
}: PropsWithChildren<ProfileChallengeProps>) => {
  const { isAutenticated } = useAuth()

  return isAutenticated ? children : fallback
}

export default ProfileChallenge
