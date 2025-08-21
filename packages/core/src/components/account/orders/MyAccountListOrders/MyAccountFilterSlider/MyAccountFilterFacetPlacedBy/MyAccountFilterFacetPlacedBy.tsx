import { Icon, IconButton, Input, Loader } from '@faststore/ui'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import type { Shopper } from 'src/sdk/account/useShopperSuggestions'
import useShopperSuggestions from 'src/sdk/account/useShopperSuggestions'
import type { SelectedFacet } from 'src/sdk/search/useMyAccountFilter'

export interface MyAccountFilterFacetPlacedByProps {
  /**
   * Current selected facets from filter context
   */
  selected: SelectedFacet[]
  /**
   * Dispatch from filter context
   */
  dispatch: (action: { type: 'toggleFacet' | 'setFacet'; payload: any }) => void
}

function MyAccountFilterFacetPlacedBy({
  selected,
  dispatch,
}: MyAccountFilterFacetPlacedByProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedShoppers, setSelectedShoppers] = useState<Shopper[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchQueryDeferred = useDeferredValue(query)

  const { data, isLoading, findShopperById } =
    useShopperSuggestions(searchQueryDeferred)

  const filteredShoppers = data?.shoppers || []

  const selectedId = useMemo(
    () => selected.find((f) => f.key === 'purchaseAgentIds')?.value,
    [selected]
  )

  const clearAll = () => {
    setQuery('')
    setSelectedShoppers([])
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    if (selectedId && selectedShoppers.length === 0) {
      const found = findShopperById(selectedId)
      if (found) setSelectedShoppers((prev) => [...prev, found])
    } else if (!selectedId) {
      clearAll()
    }
  }, [selectedId, selectedShoppers])

  function handleSearchOnChange(value: string) {
    setQuery(value)
    setIsOpen(true)
  }

  const isSearchEmpty = useMemo(
    () => !isLoading && query && filteredShoppers.length === 0,
    [isLoading, query, filteredShoppers]
  )

  const allSelected = useMemo(
    () => selectedShoppers.length === filteredShoppers.length,
    [selectedShoppers, filteredShoppers]
  )

  function handleSelect(shopper: Shopper) {
    if (selectedShoppers.some((s) => s.userId === shopper.userId)) {
      return
    }

    // At the moment, only 1 shopper can be selected
    setSelectedShoppers([shopper])
    setIsOpen(false)

    dispatch({
      type: 'setFacet',
      payload: {
        facet: { key: 'purchaseAgentIds', value: shopper.userId },
        unique: true,
      },
    })
  }

  function handleClearTag(userId: string) {
    if (selectedShoppers.length > 0) {
      setSelectedShoppers((prev) => prev.filter((s) => s.userId !== userId))

      // Using toggleFacet here removes the purchaseAgentIds from selected facets
      // because toggleFacet will remove the facet if it already exists in the selected facets
      dispatch({
        type: 'toggleFacet',
        payload: {
          key: 'purchaseAgentIds',
          value: userId,
        },
      })
    }
  }

  const hasSelectedShoppers = useMemo(
    () => selectedShoppers.length > 0,
    [selectedShoppers]
  )

  return (
    <div data-fs-list-orders-filters-placed-by>
      <div data-fs-list-orders-filters-placed-by-input>
        <Input
          id="placed-by-input"
          placeholder="Enter the shopper's name..."
          ref={inputRef}
          value={
            hasSelectedShoppers
              ? selectedShoppers
                  .map((s) => `${s.firstName} ${s.lastName}`)
                  .join(', ')
              : query
          }
          readOnly={hasSelectedShoppers}
          onFocus={() => {
            if (!allSelected) {
              setIsOpen(true)
            }
          }}
          onChange={(e) => {
            if (allSelected) return
            handleSearchOnChange(e.target.value)
          }}
          onBlur={() => {
            // delay close to allow click selection
            setTimeout(() => {
              setIsOpen(false)
              if (!hasSelectedShoppers) {
                setQuery('')
                if (inputRef.current) inputRef.current.value = ''
              }
            }, 100)
          }}
          type="text"
          inputMode="text"
        />
        {isLoading && (
          <div data-fs-list-orders-filters-placed-by-loader>
            <Loader />
          </div>
        )}
        {hasSelectedShoppers && (
          <IconButton
            size="small"
            aria-label="Clear shopper"
            data-fs-list-orders-filters-placed-by-clear
            icon={<Icon name="X" />}
            onClick={clearAll}
          />
        )}
      </div>

      {hasSelectedShoppers && (
        <ul data-fs-list-orders-filters-placed-by-tag>
          {selectedShoppers.map((s) => {
            const maxLength = 20
            const fullName = `${s.firstName} ${s.lastName}`

            return (
              <li key={s.userId} data-fs-list-orders-filters-placed-by-tag-item>
                <p
                  title={fullName}
                  aria-label={`Selected shopper: ${fullName}`}
                  data-fs-list-orders-filters-placed-by-tag-name
                >
                  {fullName.length < maxLength
                    ? fullName
                    : `${fullName.slice(0, maxLength)}...`}
                </p>

                <IconButton
                  size="small"
                  aria-label="Clear shopper"
                  title="Clear shopper"
                  data-fs-list-orders-filters-placed-by-tag-clear
                  icon={<Icon name="X" width={16} height={16} color="#000" />}
                  onClick={() => handleClearTag(s.userId)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {isOpen && isSearchEmpty && (
        <div
          data-fs-list-orders-filters-placed-by-dropdown
          data-fs-list-orders-filters-placed-by-empty
          aria-label="No shoppers found with query"
        >
          <p>No shoppers found with "{query}"</p>
        </div>
      )}

      {isOpen && filteredShoppers.length > 0 && (
        <div
          data-fs-list-orders-filters-placed-by-dropdown
          aria-label="Shopper selection dropdown"
        >
          <ul>
            {filteredShoppers
              .filter(
                (s) => !selectedShoppers.some((ss) => ss.userId === s.userId)
              )
              .map((s) => (
                <li key={s.userId}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(s)}
                    data-fs-list-orders-filters-placed-by-option
                  >
                    <span data-fs-list-orders-filters-placed-by-option-name>
                      {s.firstName} {s.lastName}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MyAccountFilterFacetPlacedBy
