import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AddressSuggestionData,
  CompleteAddressSuggestion,
} from 'src/sdk/checkout/operations/cartOperations'

import styles from './cart-page.module.scss'

interface AddressAutocompleteProps {
  onSearchAddress: (query: string) => Promise<AddressSuggestionData>
  onSelectComplete: (suggestion: CompleteAddressSuggestion) => Promise<unknown>
  onSelectIncomplete: (
    placeId: string,
    addressQuery: string
  ) => Promise<unknown>
}

type Suggestion =
  | { type: 'complete'; data: CompleteAddressSuggestion }
  | { type: 'incomplete'; placeId: string; addressQuery: string }

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}

function AddressAutocomplete({
  onSearchAddress,
  onSelectComplete,
  onSelectIncomplete,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebouncedValue(query, 300)

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    onSearchAddress(debouncedQuery.trim())
      .then((data) => {
        if (cancelled) return

        const union = data.addressSuggestion
        const mapped: Suggestion[] = []

        if (union.__typename === 'CompleteAddressSuggestionList') {
          for (const s of union.suggestions) {
            mapped.push({ type: 'complete', data: s })
          }
        } else if (union.__typename === 'AddressSuggestionList') {
          for (const s of union.suggestions) {
            mapped.push({
              type: 'incomplete',
              placeId: s.placeId,
              addressQuery: s.addressQuery,
            })
          }
        }

        setSuggestions(mapped)
        setIsOpen(mapped.length > 0)
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
          setIsOpen(false)
        }
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, onSearchAddress])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setIsOpen(false)
      setIsSelecting(true)
      setErrorMessage('')

      try {
        if (suggestion.type === 'complete') {
          setQuery(suggestion.data.addressQuery)
          await onSelectComplete(suggestion.data)
        } else {
          setQuery(suggestion.addressQuery)
          await onSelectIncomplete(suggestion.placeId, suggestion.addressQuery)
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to set address'
        )
      } finally {
        setIsSelecting(false)
      }
    },
    [onSelectComplete, onSelectIncomplete]
  )

  const getSuggestionLabel = (suggestion: Suggestion): string => {
    if (suggestion.type === 'complete') {
      const { street, city, state, zipCode } = suggestion.data
      return [street, city, state, zipCode].filter(Boolean).join(', ')
    }
    return suggestion.addressQuery
  }

  return (
    <div ref={containerRef} className={styles.addressAutocomplete}>
      <div className={styles.addressInputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setErrorMessage('')
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder="Search address or postal code"
          disabled={isSelecting}
          className={styles.addressInput}
        />
        {isSearching && (
          <span className={styles.addressSpinner} aria-hidden="true" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className={styles.suggestionList}>
          {suggestions.map((suggestion, index) => (
            <div key={index}>
              <button
                className={styles.suggestionItem}
                onClick={() => handleSelect(suggestion)}
                type="button"
              >
                {getSuggestionLabel(suggestion)}
              </button>
            </div>
          ))}
        </div>
      )}

      {isSelecting && (
        <p className={styles.addressStatus}>Calculating shipping...</p>
      )}

      {errorMessage && <p className={styles.addressError}>{errorMessage}</p>}
    </div>
  )
}

export default AddressAutocomplete
