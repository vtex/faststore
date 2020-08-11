import Drawer from '@vtex-components/drawer'
import React, { FC } from 'react'
import { Box, Button, Flex, Heading, Text } from '@vtex/store-ui'

import { useOrderForm } from '../../../hooks/useOrderForm'
import { useCurrency } from '../../../providers/Currency'
import ProductImage from '../../ProductImage'

interface HeaderProps {
  variant?: string
  onClose: () => void
  count?: number
}

interface FooterProps {
  variant?: string
  currency: string
  subtotal?: number
  total?: number
}

interface Props extends HeaderProps {
  isOpen: boolean
}

const Header: FC<HeaderProps> = ({ onClose, count, variant }) => {
  const headerVariant = `${variant}.header`

  return (
    <Box variant={headerVariant}>
      <Button onClick={onClose} variant={`${headerVariant}.close`}>
        Close
      </Button>
      <Heading as="h1" variant={`${headerVariant}.title`}>
        {`Cart (${count})`}
      </Heading>
    </Box>
  )
}

const Footer: FC<FooterProps> = ({
  currency,
  total = 0,
  subtotal = 0,
  variant,
}) => {
  const footerVariant = `${variant}.footer`

  return (
    <Flex variant={footerVariant}>
      <Flex variant={`${footerVariant}.subtotal`}>
        <Text variant={`${footerVariant}.subtotal.text`}>Subtotal</Text>
        <Text variant={`${footerVariant}.subtotal.value`}>
          {`${currency} ${subtotal}`}
        </Text>
      </Flex>
      <Flex variant={`${footerVariant}.total`}>
        <Text variant={`${footerVariant}.total.text`}>Total</Text>
        <Text variant={`${footerVariant}.total.value`}>
          {`${currency} ${total}`}
        </Text>
      </Flex>
      <Text variant={`${footerVariant}.message`}>
        Shipping and taxes calculated at checkout.
      </Text>
      <Button variant={`${footerVariant}.checkout`}>GO TO CHECKOUT</Button>
    </Flex>
  )
}

const MinicartDrawer: FC<Props> = ({ isOpen, onClose, variant }) => {
  const orderForm = useOrderForm()
  const [currency] = useCurrency()
  const count = orderForm?.value?.items.length ?? 0

  const drawerVariant = `${variant}.drawer`

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} width={400}>
      <Flex variant={drawerVariant}>
        <Header onClose={onClose} count={count} variant={drawerVariant} />
        <Flex variant={`${drawerVariant}.content`}>
          {orderForm.value?.items.map((item) => (
            <Flex key={item.uniqueId} variant={`${drawerVariant}.product`}>
              <Box variant={`${drawerVariant}.product.image`}>
                <ProductImage
                  width={96}
                  height={96}
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                />
              </Box>
              <Flex variant={`${drawerVariant}.product.name`}>
                <Text variant={`${drawerVariant}.product.name.text`}>
                  {item.name}
                </Text>
                <Text variant={`${drawerVariant}.product.name.value`}>
                  {`${currency} ${item.price}`}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Footer
          variant={drawerVariant}
          currency={currency}
          total={orderForm.value?.value}
          subtotal={orderForm.value?.value}
        />
      </Flex>
    </Drawer>
  )
}

export default MinicartDrawer
