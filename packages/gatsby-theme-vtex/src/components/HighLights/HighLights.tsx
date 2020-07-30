import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

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
    <div className={classes.root}>
      <section className={classes.cardContainersSection}>
        <div className={classes.cardContainersBlock}>
          <HighLight
            message="Free Shipping!!"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/box.png?width=24&height=24&aspect=true"
          />
          <HighLight
            message="One day delivery"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/delivery-fast.png?width=24&height=24&aspect=true"
          />
          <HighLight
            message="Pick up in store"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/store.png?width=24&height=24&aspect=true"
          />
          <HighLight
            message="Exclusive deals"
            imageUrl="https://storecomponents.vtexassets.com/arquivos/coupon.png?width=24&height=24&aspect=true"
          />
        </div>
      </section>
    </div>
  )
}

export default HighLigths
