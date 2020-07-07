/** @jsx jsx */
import { FC, lazy } from 'react'
import { Button, jsx } from 'theme-ui'

import { SuspenseSSR } from '../SuspenseSSR'
import { Props } from './lazy'

const BuyButtonLogic = lazy(() => import('./lazy'))

const BuyButtonPlaceholder: FC = () => (
  <Button sx={{ width: '100%' }}>ADD TO CART</Button>
)

export const BuyButton: FC<Props> = (props) => (
  <SuspenseSSR fallback={<BuyButtonPlaceholder />}>
    <BuyButtonLogic {...props} />
  </SuspenseSSR>
)
