import React, { FunctionComponent } from 'react'
import { Box } from 'theme-ui'

interface Props<T> {
  variant?: string
  list: T[]
  ItemComponent: FunctionComponent<T>
}

const GiftListList = <T extends JSX.IntrinsicAttributes>({
  list,
  ItemComponent,
  variant = 'default',
}: Props<T>) => (
  <Box variant={`giftList.${variant}.list`} as="ul">
    {list.map((item, index) => (
      <Box key={`giftlist.${index}`} as="li">
        <ItemComponent {...item} />
      </Box>
    ))}
  </Box>
)

export default GiftListList
