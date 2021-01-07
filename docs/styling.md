# Styling in Store Framework Jamstack

## Style with Gatsby themes
Gatsby themes are plugins that include a gatsby-config.js file and add pre-configured functionality, data sourcing, and/or UI code to Gatsby sites. This approach allows you to control the site styling through a decoupled package, with version control and autonomy for updates. It is also possible to have more than one theme!

## Gatsby themes on the Store Framework Jamstack

Styling in Store Framework Jamstack leverages the library [theme-ui](https://theme-ui.com/). By using this library we have a pre-defined way of creating themes that can be shared across components on the store.

In order to optimize how CSS is merged at runtime, Store Framework Jamstack uses a custom `theme-ui` [plugin](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-theme-ui)

## How to style
Using the @vtex/gatsby-plugin-theme-ui, export an index.js file inside the folder src/@vtex/gatsby-plugin-theme-ui.


If you've started developing with our [template](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-plugin-theme-ui/index.ts) this file should be already there.

Since each store built using Store Framework Jamstack is created on top of a pre-existing theme-ui theme, every CSS customization should merge the new CSS with the pre-existing ones.

To do that, you use the `createTheme` function imported from `@vtex/store-ui`.

>ℹ️ `@vtex/store-ui` is our plugin that exports common ecommerce components

### Doing your first CSS change
To style a pre-existing plugin, use the gatsby functionality [theme shadowing](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/).

Let's alter the color of the `searchSuggestions` add to cart button component from primary to secondary.

 <img src="./images/suggestions.png">.


First, find the correspondent for this button and alter the styles using theme shadowing.

In your template, the theme for this component is located at this [file](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/SearchSuggestions/theme.ts).

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

Then, alther the color of the button by changing the `backgroundColor` property from `primary` to `secondary`.


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
<img src="./images/suggestions-altered-color.png">

## Remarks
Theme shadowing only occurs on `@vtex/gatsby-plugin-theme-ui/index`. We structure the code with multiple files to improve readability, but the plugin only considers what is exported on `index.ts`. Every theme from the components should be an argument for the `createTheme` function.

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
To add new styles from a theme into a react component, discover what is the name of the Theme UI variant that you want to use and pass it as props to the component that you want to style. More about this on this theme-ui [doc](https://theme-ui.com/guides/variants/).
