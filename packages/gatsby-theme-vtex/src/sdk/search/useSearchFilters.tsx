import { useContext } from 'react'

import { SearchFilterContext } from './FiltersProvider'

export const useSearchFilters = () => useContext(SearchFilterContext)
