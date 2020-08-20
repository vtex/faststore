import { useContext } from 'react'

import { SearchContext } from './Provider'

export const useSearchData = () => useContext(SearchContext).data
