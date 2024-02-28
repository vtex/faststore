import { BuyNowWithPathSection } from '../components/BuyNowWithPathSection'
import { getOverriddenSection } from '../../sdk/overrides/getOverriddenSection'

const CustomBuyNowWithPathSection = getOverriddenSection({
  Section: BuyNowWithPathSection,
  components: {
    'root#before': {
      Component: () => <h1>Before Buy Now With Path!</h1>,
    },
    'description.highlight': {
      Component: () => <span>!!!!</span>,
    },
  },
})

export { CustomBuyNowWithPathSection }
