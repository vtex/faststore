import React, { FC } from 'react'

import Button from '../material-ui-components/Button'

interface Props {
  disabled?: boolean
}

const BuyButtonPreview: FC<Props> = ({ disabled = true }) => (
  <Button
    key="BuyButtonPreview"
    fullWidth
    variant="contained"
    color="primary"
    disabled={disabled}
  >
    ADD TO CART
  </Button>
)

export default BuyButtonPreview
