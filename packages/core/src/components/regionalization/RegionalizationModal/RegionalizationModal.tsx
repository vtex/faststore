import { Modal as UIModal } from '@faststore/ui'
import { useEffect } from 'react'

import RegionalizationInput from 'src/components/regionalization/RegionalizationInput'
import { ButtonIcon } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import { useModal } from 'src/sdk/ui/modal/Provider'

interface RegionalizationModalProps {
  isOpen: boolean
  /**
   * This function is called whenever the user clicks outside
   * the modal content
   */
  onDismiss: () => void
}

function RegionalizationModal({
  isOpen,
  onDismiss,
}: RegionalizationModalProps) {
  const { fade, onModalOpen, onModalClose } = useModal()

  useEffect(() => {
    isOpen && onModalOpen()
  }, [isOpen, onModalOpen])

  return (
    <UIModal
      data-regionalization-modal
      data-regionalization-modal-state={fade}
      isOpen={isOpen}
      onDismiss={(e) => {
        e.preventDefault()
        onModalClose()
      }}
      onTransitionEnd={() => fade === 'out' && onDismiss()}
    >
      <header className="regionalization-modal__header">
        <ButtonIcon
          onClick={onModalClose}
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
          <RegionalizationInput />
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

export default RegionalizationModal
