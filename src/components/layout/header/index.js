import React, { useState } from "react"
import { Link } from "gatsby"

import { IconLogo } from "ui"

import { Outer, Nav, Logo, NavList, NavListItem } from "./styles"
import BurgerButton from "./burger-button"

const Header = ({ headerItems }) => {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <Outer>
      <Link to="/">
        <Logo>
          <IconLogo />
        </Logo>
      </Link>
      <Nav open={navOpen}>
        <NavList>
          {headerItems?.map(headerItem => (
            <NavListItem key={headerItem.path}>
              <Link to={headerItem.path}>{headerItem.name}</Link>
            </NavListItem>
          ))}
        </NavList>
      </Nav>
      <BurgerButton active={navOpen} onClick={() => setNavOpen(!navOpen)} />
    </Outer>
  )
}

export default Header
