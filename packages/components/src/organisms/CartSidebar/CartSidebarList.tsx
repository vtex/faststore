import React, { ReactNode } from 'react'

import { List } from '../../'

function CartSidebarList({ children }: { children: ReactNode }) {
  return (
    <List data-fs-cart-sidebar-list>
      {children}
      {/* {items.map((item) => (
        <li key={item.id}>
          <CartItem item={item} />
        </li>
      ))}
      {gifts.length > 0 && (
        <>
          {gifts.map((item) => (
            <li key={item.id}>
              <Gift item={item} />
            </li>
          ))}
        </>
      )} */}
    </List>
  )
}

export default CartSidebarList
