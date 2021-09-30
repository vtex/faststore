# Conditions of satisfaction for a store-ui component

## Data Attributes for styling

We decided to use data attributes for styling with this pattern: `data-store-component-kebab-case-name`.

So, for example, if you want to create a new molecule component called CheckboxGroup:
```tsx
interface CheckboxGroupProps {}
const CheckboxGroup = ({ onChange, testId, ...props }: CheckboxGroupProps) => {
  return (
    <div data-store-checkbox-group data-testid={testId}> {/* Pay attention on data-attribute */}
      <Checkbox data-store-checkbox-group onChange={onChange} {...props} /> {/* Pay attention on data-attribute */}
      <List data-list>
        <li data-list-item><Checkbox data-checkbox onChange={onChange} /></li>
      </List>
    </div>
  )
}
```

As you can see, internal element has data-attributes for styling too.

### Data attributes for pseudo selectors

For styling pseudo selectors we use this pattern: `data-pseudo-selector-name`

Continue the previous example, we can add the disable property for the CheckboxGroup. So how can we add this data-attribute for this case?

```tsx
const CheckboxGroup = ({ onChange, testId, disabled, ...props }: CheckboxGroupProps) => {
  const dataAttributes = {
    'data-disabled': disabled || undefined
  }
  return (
    ...
      {/* Pay attention on data-attribute below */}
      <Checkbox data-checkbox onChange={onChange} {...dataAttributes} {...props}  />
      <List data-list>
        <li data-list-item><Checkbox data-checkbox onChange={onChange} {...dataAttributes} /></li>
      </List>
    ...
  )
}
```

So, if you want to style the disable state, you can do by doing this:

```css
[data-checkbox][data-disabled] { 
  /* your style here */
}
```

For more information look at the [styling discussion](https://github.com/vtex/faststore/discussions/919).

## Control the UI

A store-ui component structures how the its inner elements are arranged. This means that our atoms, molecules and organisms can (and often will) control how the UI is displayed and arranged. Understand UI control as the opinions on how different elements should be displayed together. As an example, take `LoadingButton` molecule. It is deliberately designed for the `Spinner` atom to appear inside the `Button` atom, not on its side. That's a way of enforcing UI control over a molecule. 

On atoms, however, this control doesn't apply the same way. We're following Atomic Design, which means that our atoms should represent core elements of a store, that are the mounting blocks for molecules and organisms. Enforcing tight UI control over an atom may decrease its reusability and increase the cost of maintenance, which are they main reason they exist in the first place. Because of that, it's not recommended to make UI controlled biased atoms, and that's why most of them have the `as` prop to allow users to control even which HTML element should be used by them.

The opinions that guide UI control should be based on research. The goal is to have a a11y and SEO ready component that's also highly reusable and fits most use cases. It's better not to have a component that isn't well researched than having an overly-sized library that will fit most use cases but have poorly engineered atoms, molecules and organisms.

## Build pure components
// TODO

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
