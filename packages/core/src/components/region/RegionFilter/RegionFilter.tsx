import { useRef } from 'react'

import {
  Button as UIButton,
  Icon as UIIcon,
  useUI,
  regionSliderTypes,
} from '@faststore/ui'

import { useDelivery } from 'src/sdk/delivery'

type RegionFilterProps = {
  label: string
  icon: {
    alt: string
    icon: string
  }
}

function RegionFilter({ label, icon: { icon, alt } }: RegionFilterProps) {
  const { openRegionSlider } = useUI()
  const { selectedPickupPoint } = useDelivery()
  const regionFilterRef = useRef<HTMLButtonElement>(null)

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
      ref={regionFilterRef}
    >
      {selectedPickupPoint ? selectedPickupPoint.name : label}
    </UIButton>
  )
}

export default RegionFilter
