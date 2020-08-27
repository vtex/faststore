import React, { FC } from 'react'
import { Flex, Button } from '@vtex/store-ui'
import { Link } from 'gatsby'
import { SummarySmall, SummaryTotalizers } from '@vtex/checkout-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

export interface HeaderMinicartDrawerFooterProps {
  variant?: string
  totalizers?: any[]
  value?: number
}

export const HeaderMinicartDrawerFooter: FC<HeaderMinicartDrawerFooterProps> = ({
  totalizers = [],
  value = 0,
  variant,
}) => {
  const customVariant = `${variant}.footer`
  const { formatMessage } = useIntl()

  return (
    <Flex variant={customVariant}>
      <SummarySmall
        total={value}
        totalizers={totalizers}
        totalizersToShow={['Items', 'Discounts']}
      >
        <SummaryTotalizers />
      </SummarySmall>
      <Button
        as={Link}
        // @ts-ignore
        to="/cart"
      >
        {formatMessage({ id: 'minicart.drawer.go-checkout' })}
      </Button>
    </Flex>
  )
}
