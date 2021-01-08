# SFJ Store Theme

The [SFJ Store Theme](https://github.com/vtex/faststore/tree/master/packages/gatsby-theme-store) is a [Gatsby theme](https://www.gatsbyjs.com/docs/themes/what-are-gatsby-themes/#gatsby-themes), a specific plugin type that contains pre-configured functionalities, data sourcing, and UI code defined in a [`/src/gatsby-config.js`](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/gatsby-config.ts) file.

Different from a plugin, in a Gatsby theme, default configurations (shared functionality, data sourcing, UI code) are abstracted into an installable package.

This way, Gatsby themes make it possible to control site styling through decoupled packages, characterized for version control and autonomous updates.

For being packaged as a standalone product, it is also possible to have more than one theme on the same site.

The SFJ Store Theme incorporates VTEX ecommerce solutions by configuring the following plugins:

- [`@vtex/gatsby-plugin-theme-ui`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-theme-ui) - Allows theme styling and optimizes the way CSS is merged. Leveraging from the [Theme UI](https://theme-ui.com/), this plugin incorporates the [Store UI library](https://github.com/vtex/faststore/tree/master/packages/store-ui) - a library that contains storefront components, such as the [Minicart](https://github.com/vtex/faststore/tree/master/packages/store-ui/src/Minicart).
- [`@vtex/gatsby-plugin-i18n`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-i18n) - Allows store internationalization.
- [`@vtex/gatsby-plugin-graphql`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-graphql) - Builds and preprocesses VTEX store's GraphQL queries.

# Styling

In the Store Framework Jamstack (SFJ), styling can be achieved by:

- [Overwriting CSS styles of the Store UI components.](#overwriting-css-styles-of-the-store-ui-components)
- [Adding styles to React components from the Store UI library.](#adding-styles-to-react-components-from-the-store-ui-library)
- [Creating your own components and styles.](#creating-your-own-components-and-styles)

In the following sections, you'll find out more about each one of these topics.

However, before proceeding any further, keep in mind that styling is possible thanks to the `@vtex/gatsby-plugin-theme-ui` plugin. 

We structure the `@vtex/gatsby-plugin-theme-ui` code within multiple files to improve readability. However, the `@vtex/gatsby-plugin-theme-ui` plugin only considers the styles exported by the `createTheme` function inside the `index.ts` file.

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
