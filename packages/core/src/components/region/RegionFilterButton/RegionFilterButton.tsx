import { useRef } from 'react'

import {
  Button as UIButton,
  Icon as UIIcon,
  useUI,
  regionSliderTypes,
} from '@faststore/ui'

type RegionFilterButtonProps = {
  filterByPickupPoint?: {
    enabled?: boolean
    label?: string
    icon?: {
      icon?: string
      alt?: string
    }
  }
}

function RegionFilterButton({
  filterByPickupPoint: {
    label: filterByPickupPointLabel,
    icon: { icon: filterByPickupPointIcon, alt: filterByPickupPointAlt } = {},
  } = {},
}: RegionFilterButtonProps) {
  const { openRegionSlider } = useUI()
  const regionFilterButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={
        <UIIcon
          name={filterByPickupPointIcon}
          width={18}
          height={18}
          weight="bold"
          aria-label={filterByPickupPointAlt}
        />
      }
      iconPosition="left"
      onClick={() =>
        openRegionSlider(regionSliderTypes.globalChangePickupPoint)
      }
      ref={regionFilterButtonRef}
    >
      {filterByPickupPointLabel}
    </UIButton>
  )
}

export default RegionFilterButton
