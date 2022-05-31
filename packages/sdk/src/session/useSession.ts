import { Context as SessionContext } from './Session'
import { Context as ValidationContext } from './Revalidate'
import { useContext } from '../utils/useContext'

export const useSession = () => {
  const session = useContext(SessionContext)
  const isValidating = useContext(ValidationContext)

  return {
    ...session,
    isValidating,
  }
}
