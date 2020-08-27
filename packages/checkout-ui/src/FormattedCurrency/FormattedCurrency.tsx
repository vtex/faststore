import React, { Fragment, FC } from 'react'

import { formatCurrency } from './formatCurrency'

export const FormattedCurrency: FC<{ value: number }> = ({ value }) => {
  const formattedValue = formatCurrency(value)

  return <Fragment>{formattedValue}</Fragment>
}
