import Drawer from '@vtex-components/drawer'
import React, { FC } from 'react'
import { Box, Button, Flex, Heading, Text } from '@vtex/store-ui'
import { FormattedMessage } from 'react-intl/react-intl-no-parser.umd'

import { useOrderForm, useCurrency, useNumberFormat } from '../../sdk'
// import { useCurrency } from '../../providers/Currency'
import ProductImage from '../ProductImage'
// import { useNumberFormat } from '../../providers/NumberFormat'

interface HeaderProps {
  onClose: () => void
  count?: number
}

interface FooterProps {
  subtotal?: number
  total?: number
}

interface Props extends HeaderProps {
  isOpen: boolean
}

const Header: FC<HeaderProps> = ({ onClose, count }) => (
  <Box sx={{ p: 3 }}>
    <Button onClick={onClose}>
      <FormattedMessage id="minicart.drawer.close" />
    </Button>
    <Heading as="h1" pt={3}>
      <FormattedMessage id="minicart.drawer.count" values={{ count }} />
    </Heading>
  </Box>
)

const Footer: FC<FooterProps> = ({ total = 0, subtotal = 0 }) => {
  const numberFormat = useNumberFormat()
  return (
    <Flex
      sx={{
        p: 3,
        flexDirection: 'column',
        boxShadow: '0 0 12px rgba(0,0,0,.15)',
      }}
    >
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text><FormattedMessage id="minicart.drawer.subtotal" /></Text>
        {numberFormat.format(subtotal)}
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text><FormattedMessage id="minicart.drawer.total" /></Text>
        {numberFormat.format(total)}
      </Flex>
      <Text my={3}><FormattedMessage id="minicart.drawer.shipping-disclaimer" /></Text>
      <Button><FormattedMessage id="minicart.drawer.go-checkout" /></Button>
    </Flex>
  )
}

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
          total={orderForm.value?.value}
          subtotal={orderForm.value?.value}
        />
      </Flex>
    </Drawer>
  )
}

export default MinicartDrawer
