/** @jsx jsx */
import { FC, Fragment, lazy, useState } from 'react'
import { Box, Button, jsx } from 'theme-ui'

import SuspenseDelay from '../SuspenseDelay'
import MinicartSvg from './Svg'

const ItemCount = lazy(() => import('./ItemCount'))
const MinicartDrawer = lazy(() => import('./Drawer'))

const Minicart: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const toggle = () => setOpen(!isOpen)

  return (
    <Fragment>
      <Button variant="header-minicart" aria-label="Open Cart" onClick={toggle}>
        <MinicartSvg />
        <SuspenseDelay fallback={<Box variant="header-minicart-badge">0</Box>}>
          <ItemCount />
        </SuspenseDelay>
      </Button>
      <SuspenseDelay fallback={null}>
        <MinicartDrawer isOpen={isOpen} onClose={toggle} />
      </SuspenseDelay>
    </Fragment>
  )
}

export default Minicart
