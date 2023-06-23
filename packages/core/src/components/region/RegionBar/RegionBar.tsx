import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import { Components, Props } from 'src/components/sections/RegionBar/Overrides'

const { RegionBar: RegionBarWrapper, LocationIcon, ButtonIcon } = Components

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
  icon: {
    icon: locationIcon = Props['LocationIcon'].name,
    alt: locationIconAlt = Props['LocationIcon']['aria-label'],
  },
  buttonIcon: {
    icon: buttonIcon = Props['ButtonIcon'].name,
    alt: buttonIconAlt = Props['ButtonIcon']['aria-label'],
  },
  label = Props['RegionBar'].label,
  editLabel = Props['RegionBar'].editLabel,
  ...otherProps
}: RegionBarProps) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <RegionBarWrapper
      icon={<LocationIcon name={locationIcon} aria-label={locationIconAlt} />}
      buttonIcon={<ButtonIcon name={buttonIcon} aria-label={buttonIconAlt} />}
      {...Props['RegionBar']}
      label={label}
      editLabel={editLabel}
      // Dynamic props shouldn't be overridable
      // This decision can be reviewed later if needed
      onButtonClick={openModal}
      postalCode={postalCode}
      {...otherProps}
    />
  )
}

export default RegionBar
