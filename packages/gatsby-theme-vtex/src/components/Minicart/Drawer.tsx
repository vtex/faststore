import Drawer from '@vtex-components/drawer'
import React, { FC } from 'react'
import { Box, Button, Flex, Heading, Text } from 'theme-ui'

import { useOrderForm } from '../../hooks/useOrderForm'
import { useCurrency } from '../../providers/Currency'
import ProductImage from '../ProductImage'

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

const Header: FC<HeaderProps> = ({ onClose, count }) => (
  <Box sx={{ p: 3 }}>
    <Button onClick={onClose}>Close</Button>
    <Heading as="h1" pt={3}>
      {`Cart (${count})`}
    </Heading>
  </Box>
)

const Footer: FC<FooterProps> = ({ currency, total = 0, subtotal = 0 }) => (
  <Flex
    sx={{
      p: 3,
      flexDirection: 'column',
      boxShadow: '0 0 12px rgba(0,0,0,.15)',
    }}
  >
    <Flex sx={{ justifyContent: 'space-between' }}>
      <Text>Subtotal</Text>
      <Text>{`${currency} ${subtotal}`}</Text>
    </Flex>
    <Flex sx={{ justifyContent: 'space-between' }}>
      <Text sx={{ fontSize: 4 }}>Total</Text>
      <Text sx={{ fontSize: 4 }}>{`${currency} ${total}`}</Text>
    </Flex>
    <Text my={3}>Shipping and taxes calculated at checkout.</Text>
    <Button>GO TO CHECKOUT</Button>
  </Flex>
)

const MinicartDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const orderForm = useOrderForm()
  const [currency] = useCurrency()
  const count = orderForm?.value?.items.length ?? 0

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} width={400}>
      <Flex
        sx={{ height: '100%', flexDirection: 'column', overflow: 'hidden' }}
      >
        <Header onClose={onClose} count={count} />
        <Flex
          sx={{ flexDirection: 'column', flex: 1, overflow: 'auto' }}
          px={3}
        >
          {orderForm.value?.items.map((item) => (
            <Flex
              key={item.uniqueId}
              sx={{
                py: 3,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'muted',
                '&:last-child': {
                  borderWidth: 0,
                },
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
              <Flex sx={{ flexDirection: 'column' }} ml={3}>
                <Text>{item.name}</Text>
                <Text mt={3}>{`${currency} ${item.price}`}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Footer
          currency={currency}
          total={orderForm.value?.value}
          subtotal={orderForm.value?.value}
        />
      </Flex>
    </Drawer>
  )
}

export default MinicartDrawer
