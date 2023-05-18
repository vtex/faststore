// This is an example of how it can be used on the starter.

import CustomProductTitle from '../CustomComponent'

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Breadcrumb' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: { UIBreadcrumb: CustomProductTitle },
}

export default overrides
