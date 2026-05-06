import { useSearch } from '@faststore/sdk'
import { SelectField } from '@faststore/ui'

const DEFAULT_OPTIONS = {
  price_desc: 'Price, descending',
  price_asc: 'Price, ascending',
  orders_desc: 'Top sales',
  name_asc: 'Name, A-Z',
  name_desc: 'Name, Z-A',
  release_desc: 'Release date',
  discount_desc: 'Discount',
  score_desc: 'Relevance',
} as const

const SORT_OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS) as Array<
  keyof typeof DEFAULT_OPTIONS
>

type SortOptionKeys = (typeof SORT_OPTIONS_KEYS)[number]

export interface SortProps {
  label?: string
  options?: Partial<Record<SortOptionKeys, string>>
}

function Sort({ label = 'Sort by', options = DEFAULT_OPTIONS }: SortProps) {
  const { state, setState } = useSearch()

  const optionsMap = SORT_OPTIONS_KEYS.reduce(
    (acc, key) => {
      if (Object.hasOwn(options, key)) {
        acc[key] = options[key] ?? DEFAULT_OPTIONS[key]
      }
      return acc
    },
    {} as Record<SortOptionKeys, string>
  )

  const keys = Object.keys(optionsMap) as Array<SortOptionKeys>

  return (
    <SelectField
      id="sort-select"
      className="sort / text__title-mini-alt"
      label={label}
      options={optionsMap}
      onChange={(e) => {
        const sort = keys[e.target.selectedIndex]

        setState({
          ...state,
          sort,
          page: 0,
        })
      }}
      value={state.sort}
      testId="search-sort"
    />
  )
}

export default Sort
