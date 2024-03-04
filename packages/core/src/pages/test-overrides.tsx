import { BuyNowSection } from 'src/demo/components/BuyNowSection'
import { LoadableSection } from 'src/demo/components/LoadableSection'
import { ComposedLoadableSection } from 'src/demo/overrides/ComposedLoadableSection'
import { ComposedUISection } from 'src/demo/overrides/ComposedUISection'
import { CustomBuyNowSection } from 'src/demo/overrides/CustomBuyNowSection'
import { CustomBuyNowBeforeAfterSection } from 'src/demo/overrides/CustomBuyNowSectionBeforeAfter'
import { CustomBuyNowWithPathSection } from 'src/demo/overrides/CustomBuyNowWithPathSection'
import { CustomLoadableComposableSection } from 'src/demo/overrides/CustomComposableSection'
import { CustomLoadableSection } from 'src/demo/overrides/CustomLoadableSection'

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
      <br />
      <br />
      <br />
      <strong>Regular loadable section</strong>
      <br />
      <LoadableSection />
      <br />
      <strong>Custom loadable section with counter button</strong>
      <br />
      <CustomLoadableSection />
      <br />
      <strong>
        Custom loadable section with counter button that has initial loading
        state set to true
      </strong>
      <br />
      <CustomLoadableSection initialLoadingState={true} />
      <br />
      <strong>
        Custom loadable section with custom loading action using overrides and
        composable Stateless component
      </strong>
      <br />
      <CustomLoadableComposableSection initialLoadingState={true} />
      <br />
      <strong>
        Composed loadable section that has no button to trigger loading. Uses
        only the hook isLoading
      </strong>
      <br />
      <ComposedLoadableSection />
      <br />
      <strong>
        Composed lodable section using only the stateless UI component with
        custom loading action
      </strong>
      <br />
      <ComposedUISection />
    </>
  )
}

export default Page
