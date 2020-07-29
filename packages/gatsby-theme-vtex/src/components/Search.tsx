import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Input from './material-ui-components/Input'

const useStyles = makeStyles((theme: Theme) => ({
  searchInput: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: theme.palette.background.paper,
  },
  notchedOutline: {
    borderWidth: '2px',
  },
  searchRoot: {
    borderColor: theme.palette.grey[300],
    '&:hover:not(:focus-within) $notchedOutline': {
      borderColor: theme.palette.grey[500],
    },
    '&:focus-within $notchedOutline': {
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
          root: classes.searchRoot,
          input: classes.searchInput,
          notchedOutline: classes.notchedOutline,
        }}
        placeholder="Search"
        label="Search"
      />
    </>
  )
}

export default Search
