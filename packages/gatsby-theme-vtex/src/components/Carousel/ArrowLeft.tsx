/** @jsx jsx */
import { Button, jsx } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  onClick: () => void
}

const ArrowLeft: FC<Props> = ({ children, onClick }) => (
  <Button
    onClick={onClick}
    sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 1 }}
  >
    {children}
  </Button>
)

export default ArrowLeft
