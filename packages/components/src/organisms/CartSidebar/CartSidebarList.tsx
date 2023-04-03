import React, { ReactNode } from 'react'

import { List } from '../../'

function CartSidebarList({ children }: { children: ReactNode }) {
  return <List data-fs-cart-sidebar-list>{children}</List>
}

export default CartSidebarList
