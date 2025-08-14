import { useMemo } from 'react'
import { useSearchShopperQuery } from '../product/useSearchShopperQuery'

export type Shopper = {
  userId: string
  firstName: string
  lastName: string
}

interface ShopperSuggestionsData {
  /**
   * Array of shoppers that match the search term
   */
  shoppers: Shopper[]
}

interface ShopperSuggestionsResult {
  /**
   * The data containing matched shoppers
   */
  data: ShopperSuggestionsData | null
  /**
   * Error message if any
   */
  error: Error | null
  /**
   * Whether the data is currently being loaded
   */
  isLoading: boolean
  /**
   * Function to find a shopper by ID
   */
  findShopperById: (id: string) => Shopper | undefined
}

/**
 * Hook to search for shoppers by name or email
 *
 * @param searchTerm - The term to search for
 * @param options - Additional options for the hook
 * @returns Result object with data, loading state, and error
 */
export function useShopperSuggestions(
  searchTerm = ''
): ShopperSuggestionsResult {
  const {
    data: queryData,
    error,
    isLoading,
  } = useSearchShopperQuery({ name: searchTerm })
  console.log('🚀 ~ queryData:', queryData)

  const data = useMemo(() => {
    if (!queryData?.searchShopper?.shoppers) return { shoppers: [] }

    return {
      shoppers: queryData.searchShopper?.shoppers?.map((shopper) => ({
        userId: shopper.userId,
        firstName: shopper.firstName,
        lastName: shopper.lastName,
      })),
    }
  }, [queryData])

  const findShopperById = useMemo(() => {
    return (id: string): Shopper | undefined => {
      return data?.shoppers.find((s: Shopper) => s.userId === id)
    }
  }, [data])

  return {
    data,
    error: error ?? null,
    isLoading,
    findShopperById,
  }
}

export default useShopperSuggestions
