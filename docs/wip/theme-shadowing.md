# Shadowing
This documentation will address Shadowing in Gatsby Themes focusing on how we use it in the Store Framework Jamstack (SFJ), you can find the Shadowing concept general explanations and examples in the [Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/).

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

Below there are some examples of how to shadow:
1. We want to completely shadow the [AboveTheFold](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/HomePage/AboveTheFold.tsx) component of the HomePage in our example-store.

    Firstly we create a new file named `AboveTheFold.tsx`, just like the original file. Which will result in the following directory tree:
    ```
    storecomponents.store
    └── src
        └── @vtex
            └──gatsby-theme-store
                └── components
                    └── HomePage
                        └──AboveTheFold.tsx
    ```
    Then, we implement it however we'd like, in this example we go from [this](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/HomePage/AboveTheFold.tsx), which is only a text explaining what should be in this _fold_:
    ```
    const Fold: FC<Props> = () => (
      <Center height="800px">
        <Text sx={{ width: '50%' }}>
          This is the Above the fold part of your home page. All sync items should
          be rendered in here. Thus, make sure all data rendered in this part is
          fetched during Server Side Rendering and revalidated on the client if
          necessary
        </Text>
      </Center>
    )
    ```
    to [this](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-theme-store/components/HomePage/AboveTheFold.tsx) implementation:
    ```
    const Fold: FC<Props> = () => (
      <>
        <Carousel allItems={CAROUSEL_ITEMS} height="540px" width="360px" />
        <RichTextRow />
      </>
    )
    ```
    
2. We want to customize, but also reuse code from the original file.

    In order to do that, we'd create a file as the previous example, but now we would import the theme's component. That way we won't need to copy&paste all code we are going to reuse, we'll only need to worry about the new code we are going to implement.

    This is shown in [this](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#importing-the-shadowed-component) example from the Gatsby documentation, in which a component is imported and wrapped with another component. 
    Also, there is an [example](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-theme-store/components/ProductSummary/index.tsx) in our example-store, where we import the `Props` interface from the [shadowed file](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductSummary/index.tsx) to use it in our completely new ProductSummary component.

## Reference Implementation
Since Gastby is an open source framework, that are a lot of examples out there, but you could always refer to our [example-store](https://github.com/vtex-sites/storecomponents.store).
