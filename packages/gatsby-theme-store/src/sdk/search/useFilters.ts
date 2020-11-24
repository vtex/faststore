import { useContext } from 'react'

import { SearchContext } from './Provider'

export const useFilters = () => useContext(SearchContext).filters
