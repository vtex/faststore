import type { ReactNode } from 'react'

import { List } from '../../'

export default function CartSidebarList({ children }: { children: ReactNode }) {
  return <List data-fs-cart-sidebar-list>{children}</List>
}
