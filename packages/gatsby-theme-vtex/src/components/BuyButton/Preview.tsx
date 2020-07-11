/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

interface Props {
  disabled?: boolean
}

const BuyButtonPreview: FC<Props> = ({ disabled = true }) => (
  <Button sx={{ width: '100%' }} disabled={disabled} variant="primary">
    ADD TO CART
  </Button>
)

export default BuyButtonPreview
