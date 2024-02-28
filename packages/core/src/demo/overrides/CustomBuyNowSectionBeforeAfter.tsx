import { BuyNowBeforeAfterSection } from '../components/BuyNowBeforeAfterSection'
import { getOverriddenSection } from '../../sdk/overrides/getOverriddenSection'

const CustomBuyNowBeforeAfterSection = getOverriddenSection({
  Section: BuyNowBeforeAfterSection,
  components: {
    BuyNowBefore: {
      Component: () => <h1>Before Buy Now!</h1>,
    },
  },
})

export { CustomBuyNowBeforeAfterSection }
