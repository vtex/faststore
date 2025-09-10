import { useEffect, useMemo, useRef, useState } from 'react'
import { Input, IconButton, Icon, Loader } from '@faststore/ui'
import type { SelectedFacet } from '../../../../../../sdk/search/useMyAccountFilter'
import useShopperSuggestions from '../../../../../../sdk/account/useShopperSuggestions'
import type { Shopper } from '../../../../../../sdk/account/useShopperSuggestions'

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
  const [selectedShopper, setSelectedShopper] = useState<Shopper | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Use the new hook for shoppers suggestions
  const { data, isLoading, findShopperById } = useShopperSuggestions(query)

  // Get the filtered shoppers from hook data
  const filteredShoppers = data?.shoppers || []

  const selectedId = useMemo(
    () => selected.find((f) => f.key === 'purchaseAgentId')?.value,
    [selected]
  )

  const clearAll = () => {
    setQuery('')
    setSelectedShopper(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    if (selectedId && !selectedShopper) {
      const found = findShopperById(selectedId)
      if (found) setSelectedShopper(found)
    } else if (!selectedId) {
      clearAll()
    }
  }, [selectedId, selectedShopper])

  function handleSearchOnChange(value: string) {
    setQuery(value)
    setIsOpen(true)
  }

  const isSearchEmpty = useMemo(
    () => !isLoading && query && filteredShoppers.length === 0,
    [isLoading, query, filteredShoppers]
  )

  function handleSelect(shopper: Shopper) {
    setSelectedShopper(shopper)
    setIsOpen(false)
    dispatch({
      type: 'setFacet',
      payload: {
        facet: { key: 'purchaseAgentId', value: shopper.purchase_agent_id },
        unique: true,
      },
    })
  }

  function handleClearTag() {
    if (selectedShopper) {
      // Using toggleFacet here removes the purchaseAgentId from selected facets
      // because toggleFacet will remove the facet if it already exists in the selected facets
      dispatch({
        type: 'toggleFacet',
        payload: {
          key: 'purchaseAgentId',
          value: selectedShopper.purchase_agent_id,
        },
      })
    }
    clearAll()
  }

  return (
    <div data-fs-list-orders-filters-placed-by>
      <div data-fs-list-orders-filters-placed-by-input>
        <Input
          id="placed-by-input"
          placeholder="Enter the shopper's name..."
          ref={inputRef}
          value={selectedShopper ? selectedShopper.name : query}
          readOnly={Boolean(selectedShopper)}
          onFocus={() => {
            if (!selectedShopper) setIsOpen(true)
          }}
          onChange={(e) => {
            if (selectedShopper) return
            handleSearchOnChange(e.target.value)
          }}
          onBlur={() => {
            // delay close to allow click selection
            setTimeout(() => {
              setIsOpen(false)
              if (!selectedShopper) {
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
        {selectedShopper && (
          <IconButton
            size="small"
            aria-label="Clear shopper"
            data-fs-list-orders-filters-placed-by-clear
            icon={<Icon name="X" />}
            onClick={handleClearTag}
          />
        )}
      </div>

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
            {filteredShoppers.map((s) => (
              <li key={s.purchase_agent_id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s)}
                  data-fs-list-orders-filters-placed-by-option
                >
                  <span data-fs-list-orders-filters-placed-by-option-name>
                    {s.name}
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
