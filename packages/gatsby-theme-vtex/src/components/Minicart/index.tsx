/** @jsx jsx */
import { FC, Fragment, lazy, useState } from 'react'
import { Box, Button, jsx } from 'theme-ui'

import SuspenseDelay from '../SuspenseDelay'
import MinicartSvg from './Svg'
import MinicartDrawer from './Drawer'

const ItemCount = lazy(() => import('./ItemCount'))

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
      <MinicartDrawer isOpen={isOpen} onClose={toggle} />
    </Fragment>
  )
}

export default Minicart
