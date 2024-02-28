import { Fragment } from 'react'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

// Original buy now section
function BuyNowSection_original() {
  return (
    <div>
      <h2>Buy Now</h2>
      <p>
        Get your copy today! <span>Highlight</span>
      </p>
      <button>Buy Now</button>
    </div>
  )
}

// Overridable buy now section with before and after components
function BuyNowWithPathSection() {
  const {
    'root#before': RootBefore,
    root: Root,
    'root#after': RootAfter,
    title: Title,
    description: Description,
    button: Button,
    'description.highlight': DescriptionHighlight,
  } = useOverrideComponents<'BuyNowWithPath'>()

  return (
    <>
      <RootBefore.Component />
      <Root.Component>
        <Title.Component>Buy Now</Title.Component>
        <Description.Component>
          Get your copy today!
          <DescriptionHighlight.Component>
            Highlight
          </DescriptionHighlight.Component>
        </Description.Component>
        <Button.Component>Buy Now</Button.Component>
      </Root.Component>
      <RootAfter.Component />
    </>
  )
}

const OverridableBuyNowWithPathSection = getOverridableSection(
  'BuyNowWithPath',
  BuyNowWithPathSection,
  {
    'root#before': Fragment,
    root: 'div',
    'root#after': Fragment,
    title: 'h2',
    description: 'p',
    'description.highlight': 'span',
    button: 'button',
  }
)

export { OverridableBuyNowWithPathSection as BuyNowWithPathSection }
