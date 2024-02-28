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

// Overridable buy now section
function BuyNowSection() {
  const { BuyNow, Title, Description, Button } =
    useOverrideComponents<'BuyNow'>()

  return (
    <BuyNow.Component>
      <Title.Component>Buy Now</Title.Component>
      <Description.Component>Get your copy today!</Description.Component>
      <Button.Component>Buy Now</Button.Component>
    </BuyNow.Component>
  )
}

const OverridableBuyNowSection = getOverridableSection(
  'BuyNow',
  BuyNowSection,
  {
    BuyNow: 'div',
    Title: 'h2',
    Description: 'p',
    Button: 'button',
  }
)

export { OverridableBuyNowSection as BuyNowSection }
