import { Center, Text } from '@vtex/store-ui'
import React from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

type Props = PageProps<unknown>

const Fold: FC<Props> = () => (
  <Center height="800px">
    <Text sx={{ width: '50%' }}>
      This is the Above the fold part of your home page. All sync items should
      be rendered in here. Thus, make sure all data rendered in this part is
      fetched during Server Side Rendering and revalidated on the client if
      necessary
    </Text>
  </Center>
)

export default Fold
