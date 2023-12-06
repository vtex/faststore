import {
  Icon as UIIcon,
  LinkButton as UILinkButton,
  EmptyState as UIEmptyState,
} from '@faststore/ui'
import { ProductGalleryProps } from 'src/components/ui/ProductGallery/ProductGallery'

function EmptyGallery({ emptyGallery }: ProductGalleryProps) {
  const { title, firstButton, secondButton } = emptyGallery
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
          <UIIcon name={secondButton.icon} width={18} height={18} weight="bold" />
        }
        iconPosition="left"
      >
        {secondButton.label}
      </UILinkButton>
    </UIEmptyState>
  )
}

export default EmptyGallery
