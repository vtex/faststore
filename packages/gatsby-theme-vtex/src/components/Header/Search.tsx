/** @jsx jsx */
import { FC } from 'react'
import { Input, jsx } from '@vtex/store-ui'

const StoreHeaderSearch: FC<{ variant?: string }> = ({ variant }) => (
  <Input variant={variant} placeholder="Search" aria-label="Search" />
)

export default StoreHeaderSearch
