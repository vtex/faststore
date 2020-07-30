import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import Input from './material-ui-components/Input'

const useStyles = makeStyles((theme: Theme) => ({
  searchInput: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.grey[300],
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: theme.shape.borderRadius,
    '&:hover:not(:focus-within)': {
      borderColor: theme.palette.grey[500],
    },
    '&:focus-within': {
      borderColor: theme.palette.grey[600],
    },
  },
}))

const Search: FC = () => {
  const classes = useStyles()

  return (
    <>
      <label
        id="search-input-label"
        htmlFor="search-input"
        style={{ display: 'none' }}
      >
        Search
      </label>
      <Input
        id="search-input"
        inputProps={{
          'aria-label': 'Search',
          'aria-labelledby': 'search-input-label',
          name: 'search-input',
        }}
        startAdornment={null}
        classes={{
          input: classes.searchInput,
        }}
        placeholder="Search"
      />
    </>
  )
}

export default Search
