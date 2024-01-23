import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import MainCheckout from './main'

const OverriddenMainCheckout = getOverriddenSection({
  Section: MainCheckout,
  components: {
    CouponButton: {
      Component: function CouponButton() {
        return <span>Hello World!!!!!!!!!</span>
      },
    },
  },
})

export default OverriddenMainCheckout
