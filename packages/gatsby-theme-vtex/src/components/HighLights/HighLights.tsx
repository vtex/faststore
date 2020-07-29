import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

import HighLight from './HighLight'

const useStyles = makeStyles(
  (theme: Theme) => ({
    // Example using the theme definition jss
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    root: theme.HighlightsRoot,
    cardContainersSection: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '96rem',
      paddingLeft: '.25rem',
      paddingRight: '.25rem',
    },
    cardContainersBlock: {
      display: 'flex',
      alignItems: 'strech',
      justifyContent: 'flex-start',
    },
  }),
  {
    name: 'HighLights',
  }
)

const HighLigths: FC = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <section className={classes.cardContainersSection}>
        <div className={classes.cardContainersBlock}>
          <HighLight
            message="Free Shipping!!"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/box.png"
          />
          <HighLight
            message="One day delivery"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/delivery-fast.png"
          />
          <HighLight
            message="Pick up in store"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/store.png"
          />
          <HighLight
            message="Exclusive deals"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/coupon.png"
          />
        </div>
      </section>
    </Box>
  )
}

export default HighLigths
