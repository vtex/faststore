/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Box, jsx } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'
import { TextAlignProp } from './utils/textAlign'
import { FormattedCurrency } from '../FormattedCurrency/FormattedCurrency'

interface UnitPriceProps extends TextAlignProp {
  unitPriceDisplay?: UnitPriceDisplayType
  displayUnitListPrice?: DisplayUnitListPriceType
}

type UnitPriceDisplayType = 'always' | 'default'

type DisplayUnitListPriceType = 'showWhenDifferent' | 'notShow'

export const ProductItemUnitPrice: FC<UnitPriceProps> = ({
  textAlign = 'left',
  unitPriceDisplay = 'default',
  displayUnitListPrice = 'notShow',
}) => {
  const { item, loading } = useItemContext()

  if (loading) {
    return null
  }

  return (item.quantity > 1 || unitPriceDisplay === 'always') &&
    item.price &&
    item.price > 0 ? (
    <Box
      id={`unit-price-${item.id}`}
      sx={{
        ...opaque(item.availability),
        textAlign,
        color: '#727273',
        fontSize: 1,
        fontWeight: 400,
        lineHeight: 'title',
      }}
    >
      {item.listPrice &&
        item.price !== item.listPrice &&
        displayUnitListPrice === 'showWhenDifferent' && (
          <div sx={{ textDecoration: 'line-through' }}>
            <FormattedCurrency value={item.listPrice / 100} />
          </div>
        )}
      <Fragment>
        <div sx={{ display: 'inline-block' }}>
          <FormattedCurrency value={item.price / 100} />
        </div>
        <div sx={{ display: 'inline-block' }}>per {item.measurementUnit}</div>
      </Fragment>
    </Box>
  ) : null
}
