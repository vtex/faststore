import {
  ModalBody as UIModalBody,
  ModalHeader as UIModalHeader,
} from '@faststore/ui'

import RegionalizationInput from 'src/components/regionalization/RegionalizationInput'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'

import styles from './regionalization-modal-body.module.scss'

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
        closeButtonProps={{
          'aria-label': 'Close Regionalization Modal',
        }}
      />
      <UIModalBody className={styles.fsRegionalizationModalBody}>
        <div data-fs-regionalization-modal-input>
          <RegionalizationInput closeModal={() => onClose()} />
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
