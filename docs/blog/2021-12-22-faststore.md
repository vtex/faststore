---
title: December, 2021
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

# December 2021

## General 

- 🎉 **New FastStore Documentation Portal**. - [#1061](https://github.com/vtex/faststore/pull/1061)
  
  The first iteration of the FastStore Documentation Portal is now available at [https://faststore.dev](https://faststore.dev). Send feedback and open documentation requests via [GitHub issues](https://github.com/vtex/faststore/issues/new/choose). *Bear in mind that this is still a work in progress.*

<!--truncate-->

## FastStore UI

### Label
	
- 🎉 **New [Label](/reference/ui/atoms/label) component.** - [#1001](https://github.com/vtex/faststore/pull/1001)
  Use the `Label` component to identify text fields, checkboxes, radio buttons, and drop-down menus.

  ```tsx live
  <Label>-20%</Label>
  ```

### Alert

- 🎉 **New [Alert](/reference/ui/molecules/alert) component.** - [#1020](https://github.com/vtex/faststore/pull/1020) 
  Use the `Alert` component to display short messages related to the behavior of a system, feature or page.

  ```tsx live
  function Component() {
    const styles = {
      warning: {
        backgroundColor: '#fff2d4',
        color: "#eea236",
        borderRadius: "0.5rem",
        padding: "1rem"
      },
    }

    return (
    <Alert style={styles.warning}>
      <React.Fragment key=".0">
        <Icon component={<Warning />} />
        <span>
          This is an example of how you can use the Alert component along with icons!
        </span>
      </React.Fragment>
    </Alert>
    )
  }
  ```

### PaymentMethods

- 🎉 **New [`PaymentMethods`](/reference/ui/molecules/PaymentMethods) component.** - [#1020](https://github.com/vtex/faststore/pull/1020) 
  Use the `PaymentMethods` component to display the logos of the available payment options in a store.

  ```tsx live
  function Component() {
    const VisaCard = () => (
      <img
        alt= "Visa logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
      />
    )

    const MasterCard = () => (
      <img
        alt= "Mastercard logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1544px-Mastercard-logo.svg.png"
      />
    )

    const AmericanExpressCard = () => (
      <img
        alt= "American express logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
      />
    )

    const MaestroCard = () => (
      <img
        alt= "Maestro logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/4/4d/Maestro_logo.png"
      />
    )

    const EloCard = () => (
      <img
        alt= "Elo logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Elo_card_association_logo_-_black_text.svg/1024px-Elo_card_association_logo_-_black_text.svg.png"
      />
    )

    const HiperCard = () => (
      <img
        alt= "Hipercard logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hipercard_logo.svg/2000px-Hipercard_logo.svg.png"
      />
    )

    const PayPal = () => (
      <img
        alt= "PayPal brand"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/2560px-PayPal_logo.svg.png"
      />
    )

    const DinersClub = () => (
      <img
        alt= "Diners club logo"
        width = { 50}
        height = { 50}
        src = "https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg"
      />
    )

    return (
      <PaymentMethods title= "Payment Methods" >
        <VisaCard />
        <MasterCard />
        <MaestroCard />
        <AmericanExpressCard />
        <HiperCard />
        <EloCard />
        <DinersClub />
        <PayPal />
      </PaymentMethods>
    )
  }
  ```

### RadioGroup

- 🎉  **New [`RadioGroup`](/reference/ui/molecules/RadioGroup) component.** - [#1033](https://github.com/vtex/faststore/pull/1033)
  Use the `RadioGroup` component to allow users to select a single option from a list of two or more mutually exclusive options.

  ```tsx live
  function Component () {
    const [option, setOption] = useState('radio-1')

    return (
      <RadioGroup
        name="radio-group"
        selectedValue={option}
        onChange={(v) => setOption(v.currentTarget.value)}
      >
        <RadioOption value="radio-1" label="Radio 1">
            <span>Radio 1</span>
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
            <span>Radio 2</span>
        </RadioOption>
      </RadioGroup>
    )
  }
  ```
  

### Contributing

- ✨ **Improved [FastStore UI Storybook](https://faststoreui.netlify.app/) with web accessibility checks for components.** - [#1036](https://github.com/vtex/faststore/pull/1036)
  
    [FastStore UI Storybook](https://faststoreui.netlify.app/) now has a new tab called `Accessibility` that helps developers test components' compliance with web accessibility standards.

- ✨ **Enhanced process to create components in the FastStore UI.** - [#1039](https://github.com/vtex/faststore/pull/1039)

    If you are developing new components for the FastStore UI, just run `yarn generate-ui-component` in the [FastStore project](https://github.com/vtex/faststore), give a name to your component and answer which component type you are developing to automatically create all the basic files your component will need.

    ![Contributing](/img/releases/yarn-generate.gif)
    
    *For more information, please refer to our [Contribution guide](https://github.com/vtex/faststore/blob/master/CONTRIBUTING.MD#creating-components-on-the-faststoreui).*

## FastStore API

### VTEX Platform

- 🐛 **Fix SKU unavailability issue.** - [#1014](https://github.com/vtex/faststore/pull/1014) 
  
  The checkout process is no longer interrupted when an SKU has sellers that are not available on the current sales channel.

- 🐛 **Fix facets selection.** - [#1026](https://github.com/vtex/faststore/pull/1026)
  
  Faceted search now accepts multiple selection.