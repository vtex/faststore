import { useSearch } from '@faststore/sdk'
import { SelectField } from '@faststore/ui'

const SORT_OPTIONS_KEYS = [
  'price_desc',
  'price_asc',
  'orders_desc',
  'name_asc',
  'name_desc',
  'release_desc',
  'discount_desc',
  'score_desc',
] as const

type SortOptionKeys = (typeof SORT_OPTIONS_KEYS)[number]

export interface SortProps {
  label: string
  options: Record<SortOptionKeys, string>
}

const validSortKeys = [...SORT_OPTIONS_KEYS] as Array<SortOptionKeys>

function Sort({ label, options }: SortProps) {
  const { state, setState } = useSearch()

  const optionsMap = validSortKeys.reduce(
    (acc, key) => {
      if (Object.hasOwn(options, key)) {
        acc[key] = options[key]
      }
      return acc
    },
    {} as SortProps['options']
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
