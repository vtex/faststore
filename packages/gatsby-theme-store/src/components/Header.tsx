import React from 'react'
import type { FC } from 'react'

const Header: FC = () => (
  <div
    style={{
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    This is the Header of your store. This is where you usually put the Logo,
    SearchBar, Minicart...
  </div>
)

export default Header
