import React, { FC } from 'react'
import { Center, Text } from '@vtex/store-ui'

const BelowTheFold: FC = () => (
  <Center height="150px">
    <Text sx={{ width: '50%' }}>
      This is the below the fold part of your search template. All data in this
      part should be fetched lazily. Make sure this part is not on the above the
      fold part, mainly in mobile, since it can damage the greatily the
      performance
    </Text>
  </Center>
)

export default BelowTheFold
