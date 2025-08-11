import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Input, IconButton, Icon } from '@faststore/ui'
import type { SelectedFacet } from 'src/sdk/search/useMyAccountFilter'

type Shopper = {
  purchase_agent_id: string
  name: string
  email: string
}

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

// TODO: Integration: Replace `mockShoppers` with an API call to the entity "shopper"
// filtering by firstName OR lastName, restricted to the current user's unit. Also
// debounced as the user types to reduce requests.
const mockShoppers: Shopper[] = [
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

const MyAccountFilterFacetPlacedBy = forwardRef<
  {
    clear: () => void
  },
  MyAccountFilterFacetPlacedByProps
>(function MyAccountFilterFacetPlacedBy({ selected, dispatch }, ref) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedShopper, setSelectedShopper] = useState<Shopper | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedId = useMemo(
    () => selected.find((f) => f.key === 'purchaseAgentId')?.value,
    [selected]
  )

  useEffect(() => {
    if (selectedId) {
      if (!selectedShopper) {
        const found = mockShoppers.find(
          (s) => s.purchase_agent_id === selectedId
        )
        if (found) setSelectedShopper(found)
      }
    } else {
      // Clear local when global selected cleared (e.g., Clear All)
      setSelectedShopper(null)
      setQuery('')
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [selectedId, selectedShopper])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockShoppers
    return mockShoppers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
  }, [query])

  useImperativeHandle(ref, () => ({
    clear: () => {
      setQuery('')
      setSelectedShopper(null)
      if (inputRef.current) inputRef.current.value = ''
      if (selectedId) {
        dispatch({
          type: 'toggleFacet',
          payload: { key: 'purchaseAgentId', value: selectedId },
        })
      }
    },
  }))

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
      dispatch({
        type: 'toggleFacet',
        payload: {
          key: 'purchaseAgentId',
          value: selectedShopper.purchase_agent_id,
        },
      })
    }
    setSelectedShopper(null)
    setQuery('')
    if (inputRef.current) inputRef.current.value = ''
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
            setQuery(e.target.value)
            setIsOpen(true)
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

      {isOpen && filtered.length > 0 && (
        <div
          data-fs-list-orders-filters-placed-by-dropdown
          role="listbox"
          tabIndex={0}
        >
          <ul>
            {filtered.map((s) => (
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
})

export default MyAccountFilterFacetPlacedBy
