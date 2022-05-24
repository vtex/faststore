import { useSearch } from '@faststore/sdk'

import Select from 'src/components/ui/Select'

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

function Sort() {
  const {
    setSort,
    state: { sort },
  } = useSearch()

  return (
    <Select
      id="sort-select"
      className="sort / text__title-mini-alt"
      label="Sort by"
      options={OptionsMap}
      onChange={(e) => setSort(keys[e.target.selectedIndex])}
      value={sort}
      testId="search-sort"
    />
  )
}

export default Sort
