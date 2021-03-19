/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import { Fragment } from 'react'

import { useRegion } from '../../sdk/region/useRegion'

type Props = {
  variant?: string
}

const Region: FC<Props> = () => {
  const { regionId } = useRegion()

  return (
    <Fragment>
      <div>Region: {regionId}</div>
    </Fragment>
  )
}

export default Region
