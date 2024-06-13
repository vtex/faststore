'use client'

import {
  Icon as UIIcon,
  LinkButton as UILinkButton,
  EmptyState as UIEmptyState,
} from '@faststore/ui'

export interface EmptyGalleryProps {
  title?: string
  firstButton?: {
    label: string
    url: string
    icon: string
  }
  secondButton?: {
    label: string
    url: string
    icon: string
  }
}

function EmptyGallery({ title, firstButton, secondButton }: EmptyGalleryProps) {
  return (
    <UIEmptyState
      variant="rounded"
      title={title ?? 'Nothing matches with your search'}
      titleIcon={
        <UIIcon name="CircleWavyWarning" width={56} height={56} weight="thin" />
      }
    >
      <UILinkButton
        href={firstButton?.url ?? '/office'}
        variant="secondary"
        icon={
          <UIIcon
            name={firstButton?.icon ?? 'CircleWavyWarning'}
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        {firstButton?.label ?? 'Browse Offers'}
      </UILinkButton>
      <UILinkButton
        href={secondButton?.url ?? '/technology'}
        variant="secondary"
        icon={
          <UIIcon
            name={secondButton?.icon ?? 'RocketLaunch'}
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        {secondButton?.label ?? 'Just Arrived'}
      </UILinkButton>
    </UIEmptyState>
  )
}

export default EmptyGallery
