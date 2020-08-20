import { useContext } from 'react'

import { SearchContext } from './Provider'

export const useSearchStaticData = () => useContext(SearchContext).staticData
