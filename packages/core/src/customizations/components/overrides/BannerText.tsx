import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'BannerText' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    UIBannerText: { props: {} },
  },
}

export default overrides
