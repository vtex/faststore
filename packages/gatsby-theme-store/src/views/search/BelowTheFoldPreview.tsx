import { Center, Spinner } from '@vtex/store-ui'
import React from 'react'
import type { FC, CSSProperties } from 'react'

import type { SearchViewProps } from '.'

const BelowTheFoldPreview: FC<SearchViewProps> = () => (
  <div
    style={
      ({
        contentVisibility: 'auto',
        containIntrinsicSize: '500px',
      } as unknown) as CSSProperties
    }
  >
    <Center height="500px">
      <Spinner />
    </Center>
  </div>
)

export default BelowTheFoldPreview
