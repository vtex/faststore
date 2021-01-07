# Styling in Store Framework Jamstack

Styling in Store Framework Jamstack leverages the library [theme-ui](https://theme-ui.com/). By using this library we have a pre-defined way of creating themes that can be shared across components on the store.

Theme UI already has a [gatsby plugin](https://www.gatsbyjs.com/docs/how-to/styling/theme-ui/) available. This plugin, however, was not attending our needs because we want to optimize how CSS is merged at runtime, and this plugin merges the CSS at build time.

So we've built a [custom plugin](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-theme-ui
) to attend to this need.
## How to style
Using the @vtex/gatsby-plugin-theme-ui, export an index.js file inside the folder src/@vtex/gatsby-plugin-theme-ui.


If you've started developing with our [template](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-plugin-theme-ui/index.ts) this file should be already there.

Since each store built using store framework Jamstack is created on top of a pre-existing theme-ui theme, every CSS customization should merge the new CSS with the pre-existing ones.

To do that, you use the `createTheme` function imported from `@vtex/store-ui`.

>ℹ️ `@vtex/store-ui` is our plugin that exports common ecommerce components

### Modifying or adding new styles to themes
To style a pre-existing plugin, you use the gatsby functionality of [theme shadowing](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/).

Suppose you want to alter the color of the `searchSuggestions` add to cart button component from primary to secondary.

 <img src="../images/suggestions.png">.

You would need to find the correspondent for this button and alter the styles using theme shadowing. For the case of search suggestions, the theme for this component is located at this [file](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/SearchSuggestions/theme.ts).

```ts
// before altering the color
    products: {
      width: 'inherit',

      button: {
        backgroundColor: 'primary',
      },

      title,

      list: {
        ...list,
        display: 'flex',
        flexWrap: 'nowrap',
      },

      total: {
        paddingTop: '10px',
        color: 'text',
        textDecoration: 'underline',
        textAlign: 'center',
        cursor: 'pointer',
        width: '100%',
        backgroundColor: 'white',
      },
    },
```

To alther the color of the button, you need to change the `backgroundColor` property from `primary` to `secondary`.

```
// after altering the color
    products: {
      width: 'inherit',

      button: {
        backgroundColor: 'secondary',
      },

      title,

      list: {
        ...list,
        display: 'flex',
        flexWrap: 'nowrap',
      },

      total: {
        paddingTop: '10px',
        color: 'text',
        textDecoration: 'underline',
        textAlign: 'center',
        cursor: 'pointer',
        width: '100%',
        backgroundColor: 'white',
      },
    },
```
<img src="../images/suggestions-altered-color.png">

## Remarks
It is important to understand that theme shadowing only occurs on `@vtex/gatsby-plugin-theme-ui/index`. We structure the code with multiple files to improve readability. But the plugin only considers what is exported on  `index.ts`. Every theme from the components should be an argument for the `createTheme` function.

Example:

```ts
// @vtex/gatsby-plugin-theme-ui/index.ts
export default createTheme(
  base,
  breadcrumb,
  minicart,
  infoCardTheme,
  headerTheme,
  productQuantityTheme,
  minicartTheme,
  searchControlsTheme,
  searchSuggestionsTheme,
  searchBarTheme,
  searchTheme,
  custom,
  sliderTheme,
  offerTheme,
  productSummaryTheme,
  productDetailsTheme,
  loginTheme,
  authTheme
)
```

## Adding styles to a react component
To add new styles from a theme into a react component, you have to discover what is the name of the Theme UI variant that you want to use. Today the components for `@vtex/store-ui` don't have documentation for the variant names, so you have to look at the code to see the component hierarchy. We always try to follow a convention of variant names resembling component names to simplify this process.
