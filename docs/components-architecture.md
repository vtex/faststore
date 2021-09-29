# Conditions of satisfaction for a Component PR

## Data Attributes for variants and specific elements(interna elements)
TODO
Discussion related https://github.com/vtex/faststore/discussions/919

## Opinionated or not molecules, organisms, template, and pages. In which level?
TODO 

## Tests for each component

Each component should have your test for each property, behavior, and data-attributes for styles.

### Add accessibility tests

Each component should have tests for accessibility using jest-axe. Also, you should implement tests to check the specifications for described components on [w3 best practices](https://www.w3.org/TR/wai-aria-practices-1.1).

For example, tests for Modal Dialog component: 
```tsx
import { axe } from 'jest-axe'

describe('Modal', () => {
  it('Accessibility test with AXE', async () => {
    render(<Modal isOpen aria-label="Modal example">Modal example</Modal>)
    
    expect(await axe(document.body)).toHaveNoViolations()
  })

  // Test w3 specifications: focus on first tababble element inside the modal.
  it('Focus first element', () => {
    const { getByTestId } = render(
      <Modal isOpen aria-label="Modal example">
        <input data-testid="first-element" />
        <input />
      </Modal>
    )

    expect(getByTestId('first-element')).toHaveFocus()
  })
})
```

## Use slots or not. When use?
TODO

## Export hook vs export UI
TODO

## Storybook

Each component should have a story and doc. We have a default template for the story `.mdx` file:

```mdx
# Component name Here

<!--- if the component has more than one example add a h2 section with the name of your variation. The names of the variations can be anyone. -->
## Default
<Canvas>
  <Story />
</Canvas>

## Secondary
<Canvas>
  <Story />
</Canvas>

## Props
<ArgsTable of={} />

## CSS Selectors
<!--- Put all data-attributes related to styling here. Remember tu put into ```css ``` block-->

[data-attribute] {}

```