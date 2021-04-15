/** @jsx jsx */
import { jsx, useIdleEffect } from '@vtex/store-ui'
import { Fragment, lazy, Suspense } from 'react'
import type { FC } from 'react'

import { useMinicart } from '../../sdk/minicart/useMinicart'
import CustomMinicartButton from './Button'

const preloadDrawer = () => import('./Drawer')

const MinicartDrawer = lazy(preloadDrawer)

type Props = {
  variant?: string
}

const Minicart: FC<Props> = ({ variant = 'minicart' }) => {
  const { isOpen, toggle } = useMinicart()

  useIdleEffect(() => {
    preloadDrawer()
  }, [])

  return (
    <Fragment>
      <CustomMinicartButton variant={variant} onClick={toggle} />
      {isOpen && (
        <Suspense fallback={null}>
          <MinicartDrawer variant={variant} isOpen onClose={toggle} />
        </Suspense>
      )}
    </Fragment>
  )
}

export default Minicart
