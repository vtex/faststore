// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'ProductDetails' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    ProductTitle: { props: {} },
    DiscountBadge: { props: {} },
    BuyButton: { props: {} },
    Icon: { props: {} },
    Price: { props: {} },
    QuantitySelector: { props: {} },
    SkuSelector: { props: {} },
    ShippingSimulation: { props: {} },
    ImageGallery: { props: {} },
    ImageZoom: { props: {} },
    __experimentalImageGalleryImage: { props: {} },
    __experimentalImageGallery: { props: {} },
    __experimentalShippingSimulation: { props: {} },
  },
}

export default overrides
