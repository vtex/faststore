import { Modal as UIModal } from '@faststore/ui'
import RegionalizationModalContent from './RegionalizationModalContent'
import styles from './section.module.scss'

function RegionalizationModal() {
  return (
    <UIModal
      overlayProps={{
        className: `section ${styles.section} section-region-modal`,
      }}
    >
      {({ fadeOut }) => <RegionalizationModalContent onClose={fadeOut} />}
    </UIModal>
  )
}

export default RegionalizationModal
