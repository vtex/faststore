import { BuyNowSection } from '../components/BuyNowSection'
import { getOverriddenSection } from '../../sdk/overrides/getOverriddenSection'

const CustomBuyNowSection = getOverriddenSection({
  Section: BuyNowSection,
  components: {
    Title: { Component: ({ children }) => <select>{children}</select> },
  },
})

export { CustomBuyNowSection }
