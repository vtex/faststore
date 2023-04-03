import { RegionBar as UIRegionBar } from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import { useUI } from '@faststore/ui'

function RegionBar({ ...otherProps }) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <UIRegionBar
      onButtonClick={openModal}
      postalCode={postalCode}
      {...otherProps}
    />
  )
}

export default RegionBar
