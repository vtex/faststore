import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import {
  RegionBar as RegionBarWrapper,
  LocationIcon,
  ButtonIcon,
} from 'src/components/sections/RegionBar/Overrides'

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
    icon: locationIcon = LocationIcon.props.name,
    alt: locationIconAlt = LocationIcon.props['aria-label'],
  },
  buttonIcon: {
    icon: buttonIcon = ButtonIcon.props.name,
    alt: buttonIconAlt = ButtonIcon.props['aria-label'],
  },
  label = RegionBarWrapper.props.label,
  editLabel = RegionBarWrapper.props.editLabel,
  ...otherProps
}: RegionBarProps) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <RegionBarWrapper.Component
      icon={
        <LocationIcon.Component
          {...LocationIcon.props}
          name={locationIcon}
          aria-label={locationIconAlt}
        />
      }
      buttonIcon={
        <ButtonIcon.Component
          {...ButtonIcon.props}
          name={buttonIcon}
          aria-label={buttonIconAlt}
        />
      }
      {...RegionBarWrapper.props}
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
