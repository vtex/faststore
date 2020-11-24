import {
  MinicartBadge,
  MinicartButton,
  MinicartButtonProps,
} from '@vtex/store-ui'
import React, { FC, lazy } from 'react'

import SuspenseSSR from '../Suspense/SSR'
import CustomMinicartButtonSvg from './ButtonSvg'

const CustomMinicartBadge = lazy(() => import('./Badge'))

const CustomMinicartButton: FC<MinicartButtonProps> = ({
  variant,
  onClick,
}) => (
  <MinicartButton variant={variant} onClick={onClick} aria-label="Open Cart">
    <CustomMinicartButtonSvg />
    <SuspenseSSR fallback={<MinicartBadge variant={variant} value={0} />}>
      <CustomMinicartBadge variant={variant} />
    </SuspenseSSR>
  </MinicartButton>
)

export default CustomMinicartButton
