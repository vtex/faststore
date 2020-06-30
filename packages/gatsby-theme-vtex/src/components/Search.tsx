/** @jsx jsx */
import { FC } from 'react'
import { Input, jsx } from 'theme-ui'

const Search: FC = () => (
  <Input
    id="searchbar"
    placeholder="Search"
    sx={{ maxWidth: 250, marginTop: [3, 0, 0] }}
    aria-label="Search"
  />
)

export default Search
