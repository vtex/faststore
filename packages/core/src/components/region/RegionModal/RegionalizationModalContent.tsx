import {
  Icon,
  ModalBody as UIModalBody,
  ModalHeader as UIModalHeader,
} from '@faststore/ui'

import RegionInput from 'src/components/region/RegionInput'
import Link from 'src/components/ui/Link'

export interface RegionalizationModalContentProps {
  onClose?: () => void
}

function RegionalizationModalContent({
  onClose,
}: RegionalizationModalContentProps) {
  return (
    <>
      <UIModalHeader
        onClose={() => onClose()}
        title="Set your location"
        description="Prices, offers and availability may vary according to your location."
        closeBtnProps={{
          'aria-label': 'Close Regionalization Modal',
        }}
      />
      <UIModalBody data-fs-regionalization-modal-body>
        <div data-fs-regionalization-modal-input>
          <RegionInput closeModal={() => onClose()} />
        </div>
        <Link href="/" data-fs-regionalization-modal-link>
          {"I don't know my Postal Code"}
          <Icon name="ArrowSquareOut" width={18} height={18} />
        </Link>
      </UIModalBody>
    </>
  )
}

export default RegionalizationModalContent
