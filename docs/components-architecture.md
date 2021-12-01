# Conditions of satisfaction for the components on the UI package

## Data Attributes for styling

We decided to use data attributes for styling with this pattern: `data-store-component-kebab-case-name`.

Creating a new molecule component called CheckboxGroup:

```tsx
interface CheckboxGroupProps {}

const CheckboxGroup = ({ onChange, testId, ...props }: CheckboxGroupProps) => {
  return (
    <div data-store-checkbox-group data-testid={testId}> {/* Pay attention to the data-attribute */}
      <Checkbox data-checkbox-group onChange={onChange} {...props} /> {/* Pay attention to the data-attribute */}
      <List data-list>
        <li data-list-item>
          <Checkbox data-checkbox onChange={onChange} />
        </li>
      </List>
    </div>
  )
}
```

> Internal element has data-attributes for styling too.

### Data attributes for pseudo selectors

For styling pseudo selectors, use this pattern: `data-pseudo-selector-name`

Continue the previous example, we can add the disabled property for the CheckboxGroup. So how can we add this data-attribute for this case?

```tsx
const CheckboxGroup = ({ onChange, testId, disabled, ...props }: CheckboxGroupProps) => {
  const dataAttributes = {
    'data-disabled': disabled || undefined
  }
  return (
    ...
      {/* Pay attention to the data-attributes below */}
      <Checkbox data-checkbox-group onChange={onChange} {...dataAttributes} {...props}  />
      <List data-list>
        <li data-list-item>
          <Checkbox data-checkbox onChange={onChange} {...dataAttributes} />
        </li>
      </List>
    ...
  )
}
```

Styling the disabled state:

```css
[data-checkbox][data-disabled] { 
  /* your style here */
}
```

Another example for a carousel component:

```css
[data-store-carousel] {}
[data-store-carousel-arrows="left"] {}
[data-store-carousel-arrows="right"] {}
```

For more information look at the [styling discussion](https://github.com/vtex/faststore/discussions/919).

## Control the UI

A FastStore UI component structures how its inner elements are arranged. This means that our atoms, molecules, and organisms can (and often will) control how the UI is displayed and arranged. Understand UI control as the opinions on how different elements should be displayed together. As an example, take the `LoadingButton` molecule. It is deliberately designed for the `Spinner` atom to appear inside the `Button` atom, not on its side. That's a way of enforcing UI control over a molecule.

On atoms, however, this control doesn't apply the same way. We're following Atomic Design, which means that our atoms should represent core elements of a store, that are the mounting blocks for molecules and organisms. Enforcing tight UI control over an atom may decrease its reusability and increase the cost of maintenance, which are the main reasons they exist in the first place. Because of that, it's not recommended to make UI-controlled biased atoms, and that's why most of them have the `as` prop to allow users to control even which HTML element should be used by them.

The opinions that guide UI control should be based on research. The goal is to have an a11y and SEO-ready component that's also highly reusable and fits most use cases. It's better not to have a component that isn't well researched than having an overly-sized library that will fit most use cases but has poorly engineered atoms, molecules, and organisms.

// TODO: more examples and trade-off about controlled or uncontrolled component

### Build Pure versions of complex molecules and organisms

Dan Abramov, one of React's maintainers, wrote a great [article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in 2015 about what he then called Smart and Dumb components. He later renamed them to Presentational and Container Components, but the idea is the same: to increase UI reusability, people should build two components: one that deals with UI and one that deals with logic.

When building more complex molecules or organisms, we should follow that pattern. In the UI package, a component that's concerned about UI is called a Pure component. As Dan Abramov wrote in his article, Pure components often don't depend on other parts of the code and rarely have any state inside themselves. It's a way to guide users on how a certain element of the screen should look (UI control), but not how it should behave.

By following this pattern, we're building a library that focuses on the UI elements, not on the behavior. Users shouldn't need to fork UI package's code because it limits them behavior-wise. Components can - and should - enforce UI control when needed, but they shouldn't do the same when it comes to their functionality.

That doesn't mean UI components can't contain any behavior, state, or logic: they can, but these qualities should be separate from Pure components. Take the Modal molecule as an example: there's a ModalPure component, that contains only jsx tags with simple definitions on how the component should look, and a Modal component, that uses the ModalPure component and its callback props to control how it should behave.

> :information: Although Pure components are being built, they shouldn't be exported. The UI package wants to have a cohesive API, which is hard to have if its size increases rapidly without any real user data to base these decisions. Research is being done on when Pure components should be released and available to the public and how users will leverage them. Until then, only the regular versions of the components should be exported (containing behavior and logic).

## Tests for each component

Each component should have your test for each property, behavior, and data-attributes for styles.

### Accessibility tests

Each component should have tests for accessibility using jest-axe. Also, implement tests to check the specifications for described components on [W3 best practices](https://www.w3.org/TR/wai-aria-practices-1.1).

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

### References

- [w3 wai aria roles 1.1](https://www.w3.org/TR/wai-aria-1.1/#roles)
- [MDN ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [w3 wai aria best practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [MDN HTML Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

## Use slots or not?

Don't use slots on organisms. It is desired that the organisms should be more like documentation about using atoms and molecules components.

### When use slots?
TODO:

## Export hook vs export UI

Should export the controlled component. When having the necessity of uncontrolled components, the uncontrolled component can be exported, but not the hooks if it exists.

## Storybook

Each component should have a story and doc.

The component example should be written on the `ComponentName.stories.tsx` file. For example:

```tsx
// Button.stories.tsx
const ButtonTemplate: Story<ButtonProps> = ({ children, onClick, testId }) => (
  <Component onClick={onClick} testId={testId}>
    {children}
  </Component>
)

export const Button = ButtonTemplate.bind({})

const argTypes: ComponentArgTypes<ButtonProps> = {
  children: {
    control: { type: 'text' },
    defaultValue: 'Button',
  },
  onClick: {
    action: 'Button clicked',
    table: { disabled: true },
  },
}

export default {
  title: 'Atoms/Button',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
```
> Don't spread the props on the component template.

A default template for the story `.mdx` file:

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

Write everything that's important for your component inside the `.mdx`.
