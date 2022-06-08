import { Modal as UIModal } from '@faststore/ui'

import RegionalizationInput from 'src/components/regionalization/RegionalizationInput'
import { ButtonIcon } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

function RegionModal() {
  const { closeModal } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <UIModal
      isOpen
      data-regionalization-modal
      data-regionalization-modal-state={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeModal()}
    >
      <header className="regionalization-modal__header">
        <ButtonIcon
          onClick={fadeOut}
          data-fs-regionalization-modal-button
          aria-label="Close Regionalization Modal"
          data-testid="regionalization-modal-button-close"
          icon={<Icon name="X" width={30} height={30} />}
        />
        <p className="text__title-subsection" data-regionalization-modal-title>
          Set your location
        </p>
        <p className="text__body" data-regionalization-modal-description>
          Prices, offers and availability may vary according to your location.
        </p>
      </header>
      <div className="regionalization-modal__body">
        {/* TODO: Remove this div when PostalCodeInput be styled */}
        <div data-regionalization-modal-input>
          <RegionalizationInput closeModal={fadeOut} />
        </div>
        <Link href="/">
          <span data-regionalization-modal-link>
            {"Don't know my Postal Code"}
          </span>
          <Icon name="ArrowSquareOut" width={18} height={18} />
        </Link>
      </div>
    </UIModal>
  )
}

export default RegionModal
