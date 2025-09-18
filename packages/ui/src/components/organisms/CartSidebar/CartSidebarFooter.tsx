import React, { type ReactNode } from 'react'

export default function CartSidebarFooter({
  children,
}: { children: ReactNode }) {
  return <footer data-fs-cart-sidebar-footer>{children}</footer>
}
