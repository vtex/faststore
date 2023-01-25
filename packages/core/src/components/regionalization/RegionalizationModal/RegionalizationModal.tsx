import { Modal as UIModal } from '@faststore/ui'
import RegionalizationModalContent from './RegionalizationModalContent'

function RegionalizationModal() {
  return (
    <UIModal>
      {({ fadeOut }) => <RegionalizationModalContent onClose={fadeOut} />}
    </UIModal>
  )
}

export default RegionalizationModal
