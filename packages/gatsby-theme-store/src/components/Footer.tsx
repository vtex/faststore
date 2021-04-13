import React from 'react'
import type { FC } from 'react'

const Footer: FC = () => (
  <div
    style={{
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    This is the Footer of your store. This is where you usually put relevant
    links and certificates. Also, pay attention for not rendering the logo above
    the screen fold
  </div>
)

export default Footer
