import { Fragment } from 'react'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

// Original buy now section
function BuyNowSection_original() {
  return (
    <div>
      <h2>Buy Now</h2>
      <p>Get your copy today!</p>
      <button>Buy Now</button>
    </div>
  )
}

// Overridable buy now section with before and after components
function BuyNowBeforeAfterSection() {
  const { BuyNowBefore, BuyNow, BuyNowAfter, Title, Description, Button } =
    useOverrideComponents<'BuyNowBeforeAfter'>()

  return (
    <>
      <BuyNowBefore.Component />
      <BuyNow.Component>
        <Title.Component>Buy Now</Title.Component>
        <Description.Component>Get your copy today!</Description.Component>
        <Button.Component>Buy Now</Button.Component>
      </BuyNow.Component>
      <BuyNowAfter.Component />
    </>
  )
}

const OverridableBuyNowBeforeAfterSection = getOverridableSection(
  'BuyNowBeforeAfter',
  BuyNowBeforeAfterSection,
  {
    BuyNowBefore: Fragment,
    BuyNow: 'div',
    BuyNowAfter: Fragment,
    Title: 'h2',
    Description: 'p',
    Button: 'button',
  }
)

export { OverridableBuyNowBeforeAfterSection as BuyNowBeforeAfterSection }
