import { Drawer } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import DesktopSearchFilters from './Desktop'
import type { Props as DesktopProps } from './Desktop'

interface Props extends DesktopProps {
  toggle: () => void
  isOpen: boolean
}

const SearchFilters: FC<Props> = ({ toggle, isOpen, ...props }) => (
  <Drawer
    isOpen={isOpen}
    onClose={toggle}
    variant="searchFilter.mobile"
    width={300}
    placement="right"
  >
    <DesktopSearchFilters {...props} variant="mobile" isActive={false} />
  </Drawer>
)

export default SearchFilters
