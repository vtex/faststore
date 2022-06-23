import Modal from 'src/components/ui/Modal'

import { RegionalizationModalContent } from '.'

function RegionalizationModal() {
  return (
    <Modal>
      {({ fadeOut }) => <RegionalizationModalContent onClose={fadeOut} />}
    </Modal>
  )
}

export default RegionalizationModal
