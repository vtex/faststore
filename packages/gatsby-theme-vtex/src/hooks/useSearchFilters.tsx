import { useContext } from 'react'

import { SearchFilterContext } from '../providers/Search'

export const useSearchFilters = () => useContext(SearchFilterContext)
