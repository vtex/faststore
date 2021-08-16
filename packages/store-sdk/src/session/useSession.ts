import type { ContextValue } from './Provider'
import { Context } from './Provider'
import { useContext } from '../utils/useContext'

export const useSession = <T extends ContextValue>() => useContext(Context) as T
