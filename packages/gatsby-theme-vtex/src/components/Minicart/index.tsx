/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy, Suspense } from 'react'

import { useMinicart } from '../../sdk/minicart/useMinicart'
import { useIdleEffect } from '../../sdk/useIdleEffect'
import CustomMinicartButton from './Button'

const preloadDrawer = () => import('./Drawer')

const MinicartDrawer = lazy(preloadDrawer)

const Minicart: FC = () => {
  const { isOpen, toggle } = useMinicart()

  useIdleEffect(() => {
    preloadDrawer()
  }, [])

  const customVariant = 'minicart'

  return (
    <Fragment>
      <CustomMinicartButton variant={customVariant} onClick={toggle} />
      {isOpen && (
        <Suspense fallback={null}>
          <MinicartDrawer variant={customVariant} isOpen onClose={toggle} />
        </Suspense>
      )}
    </Fragment>
  )
}

export default Minicart
