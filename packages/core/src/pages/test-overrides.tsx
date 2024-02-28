import { BuyNowSection } from 'src/demo/components/BuyNowSection'
import { CustomBuyNowSection } from 'src/demo/overrides/CustomBuyNowSection'
import { CustomBuyNowBeforeAfterSection } from 'src/demo/overrides/CustomBuyNowSectionBeforeAfter'
import { CustomBuyNowWithPathSection } from 'src/demo/overrides/CustomBuyNowWithPathSection'

function Page() {
  return (
    <>
      <strong>Original:</strong>
      <BuyNowSection />
      <br />
      <strong>Changes title to a selector:</strong>
      <CustomBuyNowSection />
      <br />
      <strong>Customizes an element before the main element:</strong>
      <CustomBuyNowBeforeAfterSection />
      <br />
      <strong>
        Customizes the description highlight and an element before the main
        element using paths:
      </strong>
      <CustomBuyNowWithPathSection />
    </>
  )
}

export default Page
