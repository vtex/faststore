import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'
import { Icon, RegionBar as UIRegionBar } from '@faststore/ui'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

export interface RegionBarProps {
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: {
    icon: string
    alt: string
  }
  /**
   * Specifies a label for the location text.
   */
  label: UIRegionBarProps['label']
  /**
   * Specifies a label for the edit text.
   */
  editLabel?: UIRegionBarProps['editLabel']
  /**
   * A React component that will be rendered as an icon.
   */
  buttonIcon?: {
    icon: string
    alt: string
  }
}

function RegionBar({
  icon: { icon: locationIcon, alt: locationIconAlt },
  buttonIcon: { icon: buttonIcon, alt: buttonIconAlt },
  ...otherProps
}: RegionBarProps) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <UIRegionBar
      onButtonClick={openModal}
      postalCode={postalCode}
      icon={<Icon name={locationIcon} aria-label={locationIconAlt} />}
      buttonIcon={<Icon name={buttonIcon} aria-label={buttonIconAlt} />}
      {...otherProps}
    />
  )
}

export default RegionBar
