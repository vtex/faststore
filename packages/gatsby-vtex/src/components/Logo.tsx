import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Styled } from 'theme-ui'

const Logo: FC = () => (
  <Link to="/">
    <Styled.img
      height="12px"
      src="https://storecomponents.vtexassets.com/arquivos/store-theme-logo.png"
    />
  </Link>
)

export default Logo
