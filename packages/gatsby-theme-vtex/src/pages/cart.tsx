import React, { FC } from 'react'
import { Link } from 'gatsby'
import {
  Container,
  Heading,
  Text,
  Divider,
  Flex,
  Box,
  Button,
} from '@vtex/store-ui'
import {
  ProductList,
  ProductName,
  ProductItemImage,
  ProductBrand,
  ProductVariations,
  ProductItemQuantitySelector,
  ProductItemUnitPrice,
  RemoveButton,
  ProductItemPrice,
  Summary,
  SummaryTotalizers,
  ShippingCalculatorContainer,
  ShippingCalculator,
} from '@vtex/checkout-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import Layout from '../components/Layout'
import { useOrderForm } from '../sdk/orderForm/useOrderForm'

const EmptyStateIcon: React.FC = () => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M55 42H15C14.7563 41.9999 14.521 41.9109 14.3384 41.7496C14.1557 41.5883 14.0382 41.3658 14.008 41.124L9.234 4H2C1.46957 4 0.960859 3.78929 0.585786 3.41421C0.210714 3.03914 0 2.53043 0 2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H11C11.4874 0.000137551 11.9579 0.178243 12.3233 0.500854C12.6886 0.823464 12.9236 1.26838 12.984 1.752L14.015 10H59C59.1424 10 59.2832 10.0305 59.413 10.0894C59.5427 10.1482 59.6583 10.2341 59.7522 10.3413C59.846 10.4485 59.9158 10.5745 59.957 10.7108C59.9982 10.8472 60.0098 10.9908 59.991 11.132L55.991 41.132C55.959 41.3722 55.8409 41.5926 55.6586 41.7522C55.4764 41.9119 55.2423 41.9999 55 42ZM17 60C20.866 60 24 56.866 24 53C24 49.134 20.866 46 17 46C13.134 46 10 49.134 10 53C10 56.866 13.134 60 17 60ZM53 60C56.866 60 60 56.866 60 53C60 49.134 56.866 46 53 46C49.134 46 46 49.134 46 53C46 56.866 49.134 60 53 60Z"
        fill="#979899"
      />
    </svg>
  )
}

const CartPage: FC = () => {
  const {
    orderForm,
    updateItems,
    updateSelectedDeliveryOption,
    insertAddress,
  } = useOrderForm()

  const intl = useIntl()

  const handleQuantityChange = (uniqueId: string, quantity: number) =>
    updateItems?.([{ uniqueId, quantity }])

  const handleRemove = (uniqueId: string) =>
    updateItems?.([{ uniqueId, quantity: 0 }])

  if (!orderForm) {
    return <>loading...</>
  }

  if (orderForm.items.length === 0) {
    return (
      <Layout>
        <Container>
          <Flex
            pt={6}
            pb={7}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <EmptyStateIcon />
            <Text
              as="span"
              mt={4}
              sx={{ fontWeight: 400, fontSize: 4, color: 'muted2' }}
            >
              {intl.formatMessage({ id: 'cart.empty-state.title' })}
            </Text>
            <Box sx={{ color: 'textMuted' }}>
              <p>{intl.formatMessage({ id: 'cart.empty-state.message' })}</p>
              <Box mt="1.5rem">
                <Button
                  variant="secondary"
                  as={Link}
                  // @ts-ignore
                  to="/"
                >
                  {intl.formatMessage({ id: 'cart.empty-state.button' })}
                </Button>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <Flex
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          <Flex
            sx={{ flexDirection: 'column', flexGrow: 1, marginRight: '3rem' }}
          >
            <Heading variant="cartTitle" as="h3" mt={4} mb={3}>
              <Text sx={{ fontSize: 6, display: 'inline-block' }}>
                {intl.formatMessage({ id: 'cart.title' })}
              </Text>
              <Text
                ml={2}
                sx={{
                  fontWeight: 400,
                  fontSize: 4,
                  color: 'textMuted',
                  display: 'inline-block',
                }}
              >
                {intl.formatMessage(
                  { id: 'cart.items' },
                  { itemsQuantity: orderForm.items.length }
                )}
              </Text>
            </Heading>
            <Box mb={4}>
              <ProductList
                items={orderForm.items}
                loading={false}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              >
                <Flex>
                  <ProductItemImage />
                  <Flex
                    ml="1.5rem"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'stretch',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <ProductBrand />
                      <ProductName />
                      <ProductVariations />
                    </Box>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        '@media screen and (min-width: 40em)': {
                          width: '5.6rem',
                        },
                      }}
                    >
                      <ProductItemQuantitySelector />
                      <Box mt={2}>
                        <ProductItemUnitPrice />
                      </Box>
                    </Flex>
                    <Flex ml="1.5rem">
                      <ProductItemPrice textAlign="right" />
                      <Box ml="1.5rem">
                        <RemoveButton />
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              </ProductList>
            </Box>
            <Flex mb={4}>
              <Button
                variant="secondary"
                ml="auto"
                sx={{ textTransform: 'uppercase' }}
                as={Link}
                // @ts-ignore
                to="/"
              >
                {intl.formatMessage({ id: 'cart.continue-shopping' })}
              </Button>
            </Flex>
          </Flex>
          <Box sx={{ width: 1, backgroundColor: 'muted' }} />
          <Box mt="7rem" ml={5} mb={4} sx={{ width: '24rem' }}>
            <Box mb={5}>
              <ShippingCalculatorContainer
                canEditData={orderForm.canEditData}
                countries={['BRA']}
                deliveryOptions={orderForm.shipping.deliveryOptions as any}
                insertAddress={(address) => insertAddress!(address)}
                loading={false}
                numberOfItems={orderForm.items.length}
                selectDeliveryOption={(deliveryOption) =>
                  updateSelectedDeliveryOption!(deliveryOption)
                }
                selectedAddress={orderForm.shipping.selectedAddress as any}
                title={intl.formatMessage({
                  id: 'shipping-calculator.delivery',
                })}
              >
                <ShippingCalculator />
              </ShippingCalculatorContainer>
            </Box>
            <Summary
              title="Summary"
              total={orderForm.value}
              totalizers={orderForm.totalizers}
            >
              <SummaryTotalizers />
            </Summary>
            <Box mt=".75rem" mb=".75rem" sx={{ width: '100%' }}>
              <Button sx={{ width: '100%', textTransform: 'uppercase' }}>
                {intl.formatMessage({ id: 'cart.checkout' })}
              </Button>
            </Box>
          </Box>
        </Flex>
        <Divider mt={0} />
      </Container>
    </Layout>
  )
}

export default CartPage
