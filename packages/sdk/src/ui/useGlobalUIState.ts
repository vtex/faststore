import { useContext } from '../utils/useContext'
import { Context } from './Provider'

export const useGlobalUIState = () => useContext(Context)
