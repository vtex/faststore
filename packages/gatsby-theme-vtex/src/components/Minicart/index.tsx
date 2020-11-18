/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy, Suspense } from 'react'

import { useMinicart } from '../../sdk/minicart/useMinicart'
import { useIdleEffect } from '../../sdk/useIdleEffect'
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
