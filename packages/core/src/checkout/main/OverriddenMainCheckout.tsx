import {
  extend,
  setExtensionPoint,
} from 'src/sdk/overrides/getOverriddenSection'

setExtensionPoint('CouponButton', function CouponButton() {
  return <span>Hello World!!!!!!!!!</span>
})

const OverridenMainCheckout = extend()

export default OverridenMainCheckout
