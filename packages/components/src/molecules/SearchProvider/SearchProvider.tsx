import React from 'react'
import { formatSearchState, initSearchState } from '@faststore/sdk'
import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export const formatSearchPath = (term: string) => {
    const { pathname, search } = formatSearchState(
        initSearchState({
            term,
            base: '/s',
        })
    )

    return `${pathname}${search}`
}

export interface SearchProviderContextValue {
    onSearchSelection?: (term: string, path: string) => void,
    /**
     * Term to be researched.
     */
    term: string
    /**
     * Enables a loading state.
     */
    isLoading: boolean
    /**
     * List of Suggestion terms.
     */
    terms: Array<{ value: string }>
    /**
     * Array with top search terms.
     */
    products: {}[]
}

const SearchContext = createContext<SearchProviderContextValue | null>(null)

function SearchProvider({
    onSearchSelection,
    children,
    term,
    terms,
    products,
    isLoading
}: PropsWithChildren<SearchProviderContextValue>) {
    return (
        <SearchContext.Provider value={{ onSearchSelection, term, terms, products, isLoading }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => {
    const context = useContext(SearchContext)

    if (!context) {
        return { inContext: false as const }
    }

    return { inContext: true as const, values: context }
}

export default SearchProvider
