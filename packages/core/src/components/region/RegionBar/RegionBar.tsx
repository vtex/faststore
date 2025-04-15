import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import { textToTitleCase } from 'src/utils/utilities'
import { session as initialSession } from 'discovery.config'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

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
  label,
  editLabel,
  ...otherProps
}: RegionBarProps) {
  const {
    RegionBar: RegionBarWrapper,
    LocationIcon,
    ButtonIcon,
  } = useOverrideComponents<'RegionBar'>()

  const { openModal } = useUI()
  const { city, postalCode } = useSession()
  const shouldDisplayPostalCode = postalCode !== initialSession.postalCode

  return (
    <RegionBarWrapper.Component
      icon={
        <LocationIcon.Component
          {...LocationIcon.props}
          name={locationIcon ?? LocationIcon.props.name}
          aria-label={locationIconAlt ?? LocationIcon.props['aria-label']}
        />
      }
      buttonIcon={
        <ButtonIcon.Component
          {...ButtonIcon.props}
          name={buttonIcon ?? ButtonIcon.props.name}
          aria-label={buttonIconAlt ?? ButtonIcon.props['aria-label']}
        />
      }
      {...RegionBarWrapper.props}
      label={label ?? RegionBarWrapper.props.label}
      editLabel={editLabel ?? RegionBarWrapper.props.editLabel}
      // Dynamic props shouldn't be overridable
      // This decision can be reviewed later if needed
      onButtonClick={openModal}
      postalCode={postalCode}
      city={textToTitleCase(city ?? '')}
      shouldDisplayPostalCode={shouldDisplayPostalCode}
      {...otherProps}
    />
  )
}

export default RegionBar
