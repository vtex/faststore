import React, { FC, Fragment } from 'react'
import { makeStyles } from '@material-ui/core'
import type { Theme } from '@material-ui/core'

import Typography from '../../material-ui-components/Typography'

interface CategoryTreeFacet {
  Name: string
  Link: string
  Children: CategoryTreeFacet[]
}

interface Props {
  tree: CategoryTreeFacet
}

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    listStyleType: 'none',
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
}))

const TreeSelector: FC<Props> = ({ tree }) => {
  const classes = useStyles()

  return (
    <Fragment>
      <Typography style={{ fontSize: 12 }}>Departments</Typography>
      <Typography>{tree.Name}</Typography>
      <ul className={classes.list}>
        {tree.Children.map(({ Name }, index) => (
          <li key={`tree-selector-${index}`}>
            <Typography>{Name}</Typography>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default TreeSelector
