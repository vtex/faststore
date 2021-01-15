# Shadowing
[Shadowing](https://www.gatsbyjs.com/docs/conceptual/how-shadowing-works/) is a Gatsby concept that allows high levels of rendering customization by letting users override components, objects, or any other element, including an entire file, in a theme’s `src` directory.

>ℹ️ We strongly encourage you to check Gatsby's documentation and explore some [Shadowing](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/) examples.
## How you'll use shadowing in the SFJ
In the [Gatsby Conceptual Guides](https://www.gatsbyjs.com/docs/conceptual/plugins-themes-and-starters/), we have the following:

*"Gatsby themes allow Gatsby site functionality to be packaged as a standalone product for others (and yourself!) to easily reuse."*

In the SFJ context, this means that when using the [VTEX theme](https://github.com/vtex/faststore), you will be able to use pre-configured functionalities, data sourcing, design, and other additional settings the VTEX theme includes.

The VTEX theme packages already include a site structure, containing:

- Home, Product, and Search pre-defined pages.
- Pre-defined React components used as templates to build those pages.

To customize your SFJ store and style it the way you want, we'll use Shadowing of the VTEX theme on your repository created using the [Store Components starter](https://github.com/vtex-sites/storecomponents.store). 

>ℹ️ *When developing specific pages and components for your store, we suggest using the VTEX theme and starter as a guide.*

As stated in the [Gatsby documentation](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/): 

*"This feature allows users to replace a file in the `src` directory that is included in the webpack bundle with their own implementation."*

That means that, with shadowing, you can adapt any file to suit your needs.

For example, you can change styles to match your visual identity, or even a component functionality to meet your business rules.

### What can I shadow?
Gatsby allows you to shadow (a.k.a., override) not just React components but also any source file.

>ℹ️ We strongly encourage you to check Gatsby's documentation and learn more about [shadowing source files](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#any-source-file-is-shadowable).

Take the [Store Components](https://github.com/vtex-sites/storecomponents.store) starter as an example: to fulfill our specific needs regarding translations, we shadowed [this typescript file](https://github.com/vtex/faststore/blob/master/packages/gatsby-plugin-i18n/src/i18n/en.ts) from the Gatsby internationalization plugin (`gatsby-plugin-i18n`).

As a result, we now have [this file](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-plugin-i18n/i18n/en.ts) on our Store Components starter, including our definitions:

```ts
export default {
  ...en,
  'shelf.title.0': 'New Offers',
  'social.share': 'Share',
  'offer.product-unavailable': 'Product Unavailable',
  'offer.units-left': '{quantity} units left!',
  'offer.installments': 'Up to {numberOfInstallments}x {value} interest-free',
  'offer.discount': ' Save {price}',
  'productDetails.reference': 'Reference',
  'product-not-found': 'Product not found',
  'error-generic': 'Error',
}
```

Notice that you can customize any file by creating a corresponding one in the same path as the theme you are using (e.g., `.../i18n/en.ts`). This way, the Shadowing API will recognize which file it should use instead of the theme's default file.

>ℹ️ *Please note that since the SFJ is built using Gatsby, you can use any of its resources/concepts/features. Therefore, all shadowing techniques explained in the Gatsby documentation works perfectly when you are using the SFJ.*

### SFJ pages and components
The SFJ Store Components starter is set up as in the following:

- In the [`faststore/packages/gatsby-theme-store`](https://github.com/vtex/faststore/tree/master/packages/gatsby-theme-store/src) folder, you'll find a basic store pages structure.

- In the [store-ui](https://github.com/vtex/faststore/tree/master/packages/store-ui/src) folder, you'll find the building blocks components.

Additionally, you will find a piece of information inside many of our theme components, which aims to quickly guide you on how to use that component/page.

Take the [`BelowTheFold.tsx`](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductPage/BelowTheFold.tsx) component as an example.

Notice that inside the `Text` component, there's a warning pointing out that everything added to this section should be lazy-fetched.

Meanwhile, the [`ProductSummary/index.tsx`](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductSummary/index.tsx) component reminds you where the base building blocks are available.

### How to shadow
In each of the following "how to shadow" sections, we will give you examples on how to:

- Completly shadow a component.
- Customize and reuse code from the original file.

#### Completely shadow a component
We want to completely shadow the [`AboveTheFold`](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/HomePage/AboveTheFold.tsx) component from our Store Components starter `HomePage`.

Firstly, we create a new file named `AboveTheFold.tsx`, just like the original file name.

This will result in the following directory tree:

```
storecomponents.store
└── src
    └── @vtex
        └──gatsby-theme-store
            └── components
                └── HomePage
                    └──AboveTheFold.tsx
```

Then, we open this file to customize it however we want.

In this example, we go from [this](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/HomePage/AboveTheFold.tsx), which is just a text explaining what should be in the `Fold` component:

```ts
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

To [this](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-theme-store/components/HomePage/AboveTheFold.tsx) implementation:

```ts
const Fold: FC<Props> = () => (
    <>
    <Carousel allItems= { CAROUSEL_ITEMS } height = "540px" width = "360px" />
        <RichTextRow />
        < />
)
```

That's all! Gatsby will now understand it should render the `AboveTheFold.tsx` component we just created instead of the theme's default file.

#### Customize and reuse code from the original file
To customize, but also reuse the code from the original file, we must create a file with the same name of the component we want to shadow, just like in the previous example, but now we must also **import** the theme's original file. 

That way, we won't have to copy and paste all the code that we will reuse, we will only be concerned with the new code that we are going to implement.

This is shown in [this example](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#importing-the-shadowed-component) from the Gatsby documentation, in which a component is imported and wrapped with another component.

In addition, there is an [example](https://github.com/vtex-sites/storecomponents.store/blob/master/src/%40vtex/gatsby-theme-store/components/ProductSummary/index.tsx) in our Store Components starter, where we import the `Props` interface from the [shadowed file](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/components/ProductSummary/index.tsx) to use it in our brand new `ProductSummary` component.

## Reference Implementation
Since Gatsby is an open-source framework, there are many examples out there, but you could always refer to our [Store Components starter (`storecomponents.store`)](https://github.com/vtex-sites/storecomponents.store).
