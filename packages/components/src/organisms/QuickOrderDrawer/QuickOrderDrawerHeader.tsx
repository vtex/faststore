import React from 'react'
import { SlideOverHeader } from '../SlideOver'
import Icon from '../../atoms/Icon'

export type QuickOrderDrawerHeaderProps = {
  title: string
  titleCharLimit?: number
  onCloseDrawer?: () => void
}

const QuickOrderDrawerHeader = ({
  onCloseDrawer,
  title,
  titleCharLimit = 30,
}: QuickOrderDrawerHeaderProps) => {
  const leftOffset = Math.floor(titleCharLimit / 2) - 3 // three dots
  const rightOffset = Math.floor(titleCharLimit / 2)
  const titleFormmated =
    title.length > titleCharLimit
      ? `${title.slice(0, leftOffset)}...${title.slice(-rightOffset)}`
      : title

  return (
    <SlideOverHeader
      data-fs-quick-order-drawer-header
      closeBtnProps={{
        variant: 'tertiary',
        color: 'black',
        'aria-label': 'Close quick order drawer',
      }}
      onClose={() => onCloseDrawer?.()}
    >
      <div data-fs-quick-order-drawer-title-container>
        <div data-fs-quick-order-drawer-icon>
          <Icon name="Table" weight="bold" width={32} height={32} />
        </div>
        <div data-fs-quick-order-drawer-title>{titleFormmated}</div>
      </div>
    </SlideOverHeader>
  )
}

export default QuickOrderDrawerHeader
