import Drawer from '@vtex-components/drawer'
import React, { FC } from 'react'
import { Box } from 'theme-ui'

import Button from '../material-ui-components/Button'
import Typography from '../material-ui-components/Typography'
import { useOrderForm } from '../../providers/OrderForm'
import { useCurrency } from '../../providers/Currency'
import ProductImage from '../ProductImage'
import Grid from '../material-ui-components/Grid'

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

// TODO: Style
const Header: FC<HeaderProps> = ({ onClose, count }) => (
  <Box sx={{ p: 3 }}>
    <Button onClick={onClose}>Close</Button>
    <Typography component="h1">{`Cart (${count})`}</Typography>
  </Box>
)

// TODO: Style everything
const Footer: FC<FooterProps> = ({ currency, total = 0, subtotal = 0 }) => (
  <Grid
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
      <Typography sx={{ fontSize: 4 }}>Total</Typography>
      <Typography sx={{ fontSize: 4 }}>{`${currency} ${total}`}</Typography>
    </Grid>
    <Typography>Shipping and taxes calculated at checkout.</Typography>
    <Button>GO TO CHECKOUT</Button>
  </Grid>
)

// TODO: Style everything
const MinicartDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const orderForm = useOrderForm()
  const [currency] = useCurrency()
  const count = orderForm?.value?.items.length ?? 0

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} width={400}>
      <Grid
        direction="column"
        container
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <Header onClose={onClose} count={count} />
        <Grid direction="column" xs style={{ overflow: 'auto' }}>
          {orderForm.value?.items.map((item) => (
            <Grid
              key={item.uniqueId}
              container
              style={{
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'muted',
              }}
            >
              <Box sx={{ height: 96, width: 96 }}>
                <ProductImage
                  width={96}
                  height={96}
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                />
              </Box>
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
