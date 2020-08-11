/** @jsx jsx */
import { FC } from 'react'
import { Spinner, jsx } from '@vtex/store-ui'

const OverlaySpinner: FC = () => (
  <div
    sx={{
      position: 'fixed' /* Sit on top of the page content */,
      width: '100%' /* Full width (cover the whole page) */,
      height: '100%' /* Full height (cover the whole page) */,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.12)' /* Black background with opacity */,
      zIndex: 9999 /* Specify a stack order in case you're using a different order for other elements */,
      cursor: 'pointer' /* Add a pointer on hover */,
      justifyContent: 'center',
      alignItems: 'center',
      display: ['-webkit-box', '-ms-flexbox', '-webkit-flex', 'flex'],
    }}
  >
    <Spinner />
  </div>
)

export default OverlaySpinner
