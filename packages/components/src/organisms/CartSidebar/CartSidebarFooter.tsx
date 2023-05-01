import React, { ReactNode } from 'react'

function CartSidebarFooter({ children }: { children: ReactNode }) {
  return <footer data-fs-cart-sidebar-footer>{children}</footer>
}

export default CartSidebarFooter
