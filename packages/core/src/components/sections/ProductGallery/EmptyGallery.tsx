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
      title={title}
      titleIcon={
        <UIIcon name="CircleWavyWarning" width={56} height={56} weight="thin" />
      }
    >
      <UILinkButton
        href={firstButton.url}
        variant="secondary"
        icon={
          <UIIcon
            name={firstButton.icon}
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        {firstButton.label}
      </UILinkButton>
      <UILinkButton
        href={secondButton.url}
        variant="secondary"
        icon={
          <UIIcon
            name={secondButton.icon}
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        {secondButton.label}
      </UILinkButton>
    </UIEmptyState>
  )
}

export default EmptyGallery
