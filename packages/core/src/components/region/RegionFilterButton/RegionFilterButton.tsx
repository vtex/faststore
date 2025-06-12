import { useRef } from 'react'

import {
  Button as UIButton,
  Icon as UIIcon,
  useUI,
  regionSliderTypes,
} from '@faststore/ui'

type RegionFilterButtonProps = {
  label: string
  icon: {
    alt: string
    icon: string
  }
}

function RegionFilterButton({
  label,
  icon: { icon, alt },
}: RegionFilterButtonProps) {
  const { openRegionSlider } = useUI()
  const regionFilterButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={
        <UIIcon
          name={icon}
          width={18}
          height={18}
          weight="bold"
          aria-label={alt}
        />
      }
      iconPosition="left"
      onClick={() =>
        openRegionSlider(regionSliderTypes.globalChangePickupPoint)
      }
      ref={regionFilterButtonRef}
    >
      {label}
    </UIButton>
  )
}

export default RegionFilterButton
