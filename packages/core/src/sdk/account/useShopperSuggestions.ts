import { useMemo, useState, useCallback, useEffect } from 'react'

// This will be replaced with an imported type from a GraphQL schema in the future
export type Shopper = {
  purchase_agent_id: string
  name: string
  email: string
}

// Mock data for now, will be fetched from API in the future
const MOCK_SHOPPERS: Shopper[] = [
  {
    purchase_agent_id: '1',
    name: 'Robert Fox',
    email: 'robert.fox@example.com',
  },
  {
    purchase_agent_id: '2',
    name: 'Ronald Wilson',
    email: 'ronald.wilson@example.com',
  },
  {
    purchase_agent_id: '3',
    name: 'Cameron Williamson',
    email: 'cameron.williamson@example.com',
  },
  {
    purchase_agent_id: '4',
    name: 'Brooklyn Simmons',
    email: 'brooklyn.simmons@example.com',
  },
]

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
  const [data, setData] = useState<ShopperSuggestionsData | null>({
    shoppers: MOCK_SHOPPERS,
  })
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Function to search for shoppers
  const searchShoppers = useCallback(
    async (term: string) => {
      // Don't search if term is empty or null
      if (!term?.trim()) {
        setData({ shoppers: MOCK_SHOPPERS })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call with timeout
        const results = await new Promise<Shopper[]>((resolve) => {
          setTimeout(() => {
            // Filter logic to simulate server-side filtering
            const q = term.trim().toLowerCase()
            const filtered = MOCK_SHOPPERS.filter(
              (shopper) =>
                shopper.name.toLowerCase().includes(q) ||
                shopper.email.toLowerCase().includes(q)
            )
            resolve(filtered)
          }, 300) // Simulate network delay
        })

        setData({ shoppers: results })
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to search for shoppers')
        )
        setData({ shoppers: [] })
      } finally {
        setIsLoading(false)
      }
    },
    [] // No dependencies needed for this mock implementation
  )

  // Setup debouncing for the search term
  useEffect(() => {
    // Don't run search if term is empty and we already have null data
    if (!searchTerm && data === null) return

    const handler = setTimeout(() => {
      searchShoppers(searchTerm)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  // Helper function to find a shopper by ID
  // We use useMemo instead of useCallback to ensure this function has a stable reference
  // and doesn't cause infinite loops in dependencies of other hooks
  const findShopperById = useMemo(() => {
    // Return a stable function that won't change between renders
    return (id: string): Shopper | undefined => {
      return data?.shoppers.find((s) => s.purchase_agent_id === id)
    }
  }, [])

  return {
    data,
    error,
    isLoading,
    findShopperById,
  }
}

export default useShopperSuggestions
