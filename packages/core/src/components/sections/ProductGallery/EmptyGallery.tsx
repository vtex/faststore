import {
  Icon as UIIcon,
  LinkButton as UILinkButton,
  EmptyState as UIEmptyState,
} from '@faststore/ui'
import { ProductGalleryProps } from 'src/components/ui/ProductGallery/ProductGallery'

function EmptyGallery({ emptyGallery }: ProductGalleryProps) {
  const { title, topButton, lowerButton } = emptyGallery
  return (
    <UIEmptyState
      variant="rounded"
      title={title}
      titleIcon={
        <UIIcon name="CircleWavyWarning" width={56} height={56} weight="thin" />
      }
    >
      <UILinkButton
        href={topButton.href}
        variant="secondary"
        icon={
          <UIIcon
            name={topButton.iconName}
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        {topButton.text}
      </UILinkButton>
      <UILinkButton
        href={lowerButton.href}
        variant="secondary"
        icon={
          <UIIcon name={lowerButton.iconName} width={18} height={18} weight="bold" />
        }
        iconPosition="left"
      >
        {lowerButton.text}
      </UILinkButton>
    </UIEmptyState>
  )
}

export default EmptyGallery
