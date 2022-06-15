import { ButtonLink } from 'src/components/ui/Button'
import EmptyState from 'src/components/ui/EmptyState'
import Icon from 'src/components/ui/Icon'

function EmptyGallery() {
  return (
    <EmptyState variant="rounded">
      <header data-fs-empty-state-title>
        <Icon name="CircleWavyWarning" width={56} height={56} weight="thin" />

        <p>Nothing matches with your search</p>
      </header>

      <ButtonLink
        data-fs-empty-state-link
        href="/office"
        variant="secondary"
        icon={
          <Icon name="CircleWavyWarning" width={18} height={18} weight="bold" />
        }
        iconPosition="left"
      >
        Browse Offers
      </ButtonLink>
      <ButtonLink
        data-fs-empty-state-link
        href="/technology"
        variant="secondary"
        icon={<Icon name="RocketLaunch" width={18} height={18} weight="bold" />}
        iconPosition="left"
      >
        Just Arrived
      </ButtonLink>
    </EmptyState>
  )
}

export default EmptyGallery
