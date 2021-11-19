import { Context } from './Provider'
import { useContext } from '../utils/useContext'

export const useSearch = () => useContext(Context)
