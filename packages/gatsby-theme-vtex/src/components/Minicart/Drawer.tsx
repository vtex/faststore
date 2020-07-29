import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

import Button from '../material-ui-components/Button'
import Typography from '../material-ui-components/Typography'
import { useOrderForm } from '../../providers/OrderForm'
import { useCurrency } from '../../providers/Currency'
import ProductImage from '../ProductImage'
import Grid from '../material-ui-components/Grid'
import Drawer from '../material-ui-components/Drawer'

interface HeaderProps {
  onClose: () => void
  count?: number
}

interface FooterProps {
  currency: string
  subtotal?: number
  total?: number
}

interface Props extends HeaderProps {
  isOpen: boolean
}

const useHeaderStyles = makeStyles((theme: Theme) => ({
  root: {
    fontWeight: theme.typography.fontWeightBold,
  },
}))

const Header: FC<HeaderProps> = ({ onClose, count }) => {
  const classes = useHeaderStyles()

  return (
    <Box p={2}>
      <Button onClick={onClose}>Close</Button>
      <Box pt={2}>
        <Typography
          classes={classes}
          component="h1"
          variant="h4"
        >{`Cart (${count})`}</Typography>
      </Box>
    </Box>
  )
}

const useGridStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))

const Footer: FC<FooterProps> = ({ currency, total = 0, subtotal = 0 }) => {
  const classes = useGridStyles()

  return (
    <Grid
      classes={classes}
      direction="column"
      container
      style={{
        boxShadow: '0 0 12px rgba(0,0,0,.15)',
      }}
    >
      <Grid justify="space-between" container>
        <Typography>Subtotal</Typography>
        <Typography>{`${currency} ${subtotal}`}</Typography>
      </Grid>
      <Grid justify="space-between" container>
        <Typography variant="h5">Total</Typography>
        <Typography variant="h5">{`${currency} ${total}`}</Typography>
      </Grid>
      <Box py={2}>
        <Typography>Shipping and taxes calculated at checkout.</Typography>
      </Box>
      <Button>GO TO CHECKOUT</Button>
    </Grid>
  )
}

const useMinicartStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  item: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey['200'],
  },
}))

const MinicartDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const orderForm = useOrderForm()
  const [currency] = useCurrency()
  const count = orderForm?.value?.items.length ?? 0

  const minicartClasses = useMinicartStyles()

  return (
    <Drawer open={isOpen} anchor="right" onClose={onClose}>
      <Grid
        direction="column"
        container
        style={{ width: 400, height: '100%', overflow: 'hidden' }}
      >
        <Header onClose={onClose} count={count} />
        <Grid
          classes={minicartClasses}
          direction="column"
          container
          xs
          style={{ overflow: 'auto' }}
        >
          {orderForm.value?.items.map((item) => (
            <Grid
              key={item.uniqueId}
              classes={{
                root: minicartClasses.item,
              }}
              item
              container
              xs
            >
              <ProductImage
                width={96}
                height={96}
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
              />
              <Grid direction="column" container xs>
                <Typography>{item.name}</Typography>
                <Typography>{`${currency} ${item.price}`}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Footer
          currency={currency}
          total={orderForm.value?.value}
          subtotal={orderForm.value?.value}
        />
      </Grid>
    </Drawer>
  )
}

export default MinicartDrawer
