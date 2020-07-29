import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'

interface HighLight {
  message: string
  imageUrl: string
}

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: '25%',
    },
    message: {
      color: '#fff',
    },
  }),
  { name: 'HighLight' }
)

const HighLight: FC<HighLight> = (props) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <img
        alt=""
        loading="lazy"
        src={props.imageUrl}
        width="24px"
        height="24px"
      />
      <Typography className={classes.message}>{props.message}</Typography>
    </Box>
  )
}

export default HighLight
