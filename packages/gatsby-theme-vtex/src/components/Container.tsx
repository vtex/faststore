import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { Box, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    marginTop: theme.spacing(3),
  },
}))

const Container: FC = ({ children }) => {
  const classes = useStyles()

  return (
    <Box
      margin="0 auto"
      width="100%"
      maxWidth={['100%', '100%', '96rem']}
      px={4}
    >
      <main className={classes.main}>{children}</main>
    </Box>
  )
}

export default Container
