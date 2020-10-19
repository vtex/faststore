import { Options, useSession } from './useSession'

export const useProfile = (options?: Options) => {
  const [session] = useSession(options)

  return session?.namespaces.profile
}
