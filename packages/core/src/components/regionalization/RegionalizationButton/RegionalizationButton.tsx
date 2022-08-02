import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useSession } from 'src/sdk/session'
import { useUI } from 'src/sdk/ui/Provider'

function RegionButton() {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <Button
      data-fs-regionalization-button
      variant="tertiary"
      size="small"
      icon={<Icon name="MapPin" width={24} height={24} />}
      iconPosition="left"
      onClick={openModal}
    >
      <span>{postalCode ?? 'Set your location'}</span>
    </Button>
  )
}

export default RegionButton
