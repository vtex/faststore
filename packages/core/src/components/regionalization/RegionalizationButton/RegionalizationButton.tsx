import type { HTMLAttributes } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useModal } from 'src/sdk/ui/modal/Provider'

interface RegionalizationButtonProps extends HTMLAttributes<HTMLDivElement> {
  content?: string
  classes: string
}

export default function RegionalizationButton({
  content,
  classes,
  ...otherProps
}: RegionalizationButtonProps) {
  const { setIsRegionalizationModalOpen } = useModal()

  return (
    <div data-fs-regionalization-button className={classes} {...otherProps}>
      <Button
        variant="tertiary"
        size="small"
        icon={<Icon name="MapPin" width={24} height={24} />}
        iconPosition="left"
        onClick={() => setIsRegionalizationModalOpen(true)}
      >
        {content ? (
          <>
            <span>{content}</span>
          </>
        ) : (
          <span>Set your location</span>
        )}
      </Button>
    </div>
  )
}
