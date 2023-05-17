import { useSearch } from '@faststore/sdk'
import { SelectField } from '@faststore/ui'

const OptionsMap = {
  price_desc: 'Price, descending',
  price_asc: 'Price, ascending',
  orders_desc: 'Top sales',
  name_asc: 'Name, A-Z',
  name_desc: 'Name, Z-A',
  release_desc: 'Release date',
  discount_desc: 'Discount',
  score_desc: 'Relevance',
}

const keys = Object.keys(OptionsMap) as Array<keyof typeof OptionsMap>
export interface SortProps {
  label?: string
  defaultSelection?: string
}

function Sort({ label = '', defaultSelection = 'score_desc' }: SortProps) {
  const { state, setState } = useSearch()

  return (
    <SelectField
      id="sort-select"
      className="sort / text__title-mini-alt"
      label={label}
      options={OptionsMap}
      onChange={(e) => {
        const sort = keys[e.target.selectedIndex]

        setState({
          ...state,
          sort,
          page: 0,
        })
      }}
      value={defaultSelection ?? state.sort}
      testId="search-sort"
    />
  )
}

export default Sort
