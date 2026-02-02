import { type ComponentType, lazy, type PropsWithChildren } from 'react'
import type { DropdownProps } from '../Dropdown/Dropdown'
import type { DropdownButtonProps } from '../Dropdown/DropdownButton'
import type { DropdownItemProps } from '../Dropdown/DropdownItem'
import type { DropdownMenuProps } from '../Dropdown/DropdownMenu'

export type { DropdownProps } from '../Dropdown/Dropdown'
export type { DropdownButtonProps } from '../Dropdown/DropdownButton'
export type { DropdownItemProps } from '../Dropdown/DropdownItem'
export type { DropdownMenuProps } from '../Dropdown/DropdownMenu'

export default lazy<ComponentType<PropsWithChildren<DropdownProps>>>(
  () => import(/* webpackChunkName: "Dropdown" */ '../Dropdown/Dropdown')
)

export const DropdownButton = lazy<ComponentType<DropdownButtonProps>>(
  () =>
    import(
      /* webpackChunkName: "DropdownButton" */ '../Dropdown/DropdownButton'
    )
)

export const DropdownMenu = lazy<ComponentType<DropdownMenuProps>>(
  () =>
    import(/* webpackChunkName: "DropdownMenu" */ '../Dropdown/DropdownMenu')
)

export const DropdownItem = lazy<ComponentType<DropdownItemProps>>(
  () =>
    import(/* webpackChunkName: "DropdownItem" */ '../Dropdown/DropdownItem')
)
