import {
  Icon as UIIcon,
  LinkButton as UILinkButton,
  EmptyState as UIEmptyState,
} from '@faststore/ui'

function EmptyGallery() {
  return (
    <UIEmptyState
      variant="rounded"
      title="Nothing matches with your search"
      titleIcon={
        <UIIcon name="CircleWavyWarning" width={56} height={56} weight="thin" />
      }
    >
      <UILinkButton
        href="/office"
        variant="secondary"
        icon={
          <UIIcon
            name="CircleWavyWarning"
            width={18}
            height={18}
            weight="bold"
          />
        }
        iconPosition="left"
      >
        Browse Offers
      </UILinkButton>
      <UILinkButton
        href="/technology"
        variant="secondary"
        icon={
          <UIIcon name="RocketLaunch" width={18} height={18} weight="bold" />
        }
        iconPosition="left"
      >
        Just Arrived
      </UILinkButton>
    </UIEmptyState>
  )
}

export default EmptyGallery
