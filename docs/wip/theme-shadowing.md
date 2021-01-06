This documentation will address Shadowing in Gatsby Themes focusing on how we use in Store Framework Jamstack, you can find the Shadowing concept general explanations and examples in the [Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/).

## Importance of Shadowing
In [Gatsby documentation](https://www.gatsbyjs.com/docs/conceptual/plugins-themes-and-starters/) we see that _"Gatsby themes allow Gatsby site functionality to be packaged as a standalone product for others (and yourself!) to easily reuse."_, this means that when you use the theme we developed you will be able to use pre-configured functionality, data sourcing, design and everything else we add to our Store Framework Theme.

Our theme package already includes a site structure with a handful of pages and React components that are used to build this pages. You can use this structure to guide your site specifics pages and components. In order to be able to change what we made available, you can make use of the concept of Shadowing.

As stated in the [Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/): _"This feature allows users to replace a file in the src directory that is included in the webpack bundle with their own implementation."_. Therefore, you have the ability to adapt any file to suit your needs, for example: styles, to match your visual identity, and even change the functionality of the component, to meet your business rules.

## Shadowing on SFJ

### What can I shadow?
In [Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#any-source-file-is-shadowable) you'll learn that you can override(_shadow_) any source file, not only React components. In our example-store implementation we shadowed this typescript [file](https://github.com/vtex/faststore/blob/master/packages/gatsby-plugin-i18n/src/i18n/en.ts) of the gatsby-plugin-i18n to add the expressions of our example-store, turning it into this [file](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-plugin-i18n/i18n/en.ts). You can customize any file by creating a file in the same path as the theme you are using, example: `.../i18n/en.ts`, that way the Shadowing API will know that it should use your file, instead of the theme's file.

:warning: Please note that, since the Store Framework Jamstack is built using Gatsby, you are able to use any resource/concept/feature present on Gatsby. Therefore, all types of shadowing explained in the Gatsby documentation works perfectly when you are using the SFJ.

### Examples
The structure of pages are in [gatsby-theme-store](https://github.com/vtex/faststore/tree/master/packages/gatsby-theme-store), the building blocks components are in [store-ui](https://github.com/vtex/faststore/tree/master/packages/store-ui/src) and you'll find a chunk of documentation inside a lot of components of our theme that has the goal of guide you through what needs to be done in that component/page. For example, [BelowTheFold.tsx](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductPage/BelowTheFold.tsx) warns of the fact that everything added to this section must be fetched lazy, while [ProductSummary/index.tsx](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductSummary/index.tsx) reminds you where the base building blocks are available.

## Reference Implementation
Since Gastby is an open source framework, that are a lot of examples out there, but you could always refer to our [example-store](https://github.com/vtex-sites/storecomponents.store).

