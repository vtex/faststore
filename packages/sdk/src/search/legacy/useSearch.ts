import { Context } from './Provider'
import { useContext } from '../../utils/useContext'

/**
 * @deprecated use the new useSearch hook available from sdk/src/search/useSearch
 */
export const useSearch = () => useContext(Context)
