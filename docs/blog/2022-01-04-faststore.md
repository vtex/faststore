---
title: January, 2022
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---
# January 2022

## FastStore UI
### Incentive 
- 🎉 **New [Incentive](https://faststore.dev/reference/ui/atoms/Incentive) atom** - [#1064](https://github.com/vtex/faststore/pull/1064) Use the `Incentive` component to display a trust badge for your store’s website.

![Incentive](https://user-images.githubusercontent.com/67270558/152564764-c5fc9793-1b5c-4777-8749-8497da862303.svg)


### Link 
- 🎉 **New [Link](https://faststore.dev/reference/ui/atoms/Link) atom** - [#1067](https://github.com/vtex/faststore/pull/1067) Use the `Link` component to display a hyperlink as any HTML tag.

![link](https://user-images.githubusercontent.com/67270558/152562969-ed41b7a9-babb-482b-9007-a34832533439.gif)
### Card
- 🎉 **New [Card](https://faststore.dev/reference/ui/organisms/Card) organism** - [#1079](https://github.com/vtex/faststore/pull/1079) Use the `Card` component to display summarized information about a product.

![Card](https://user-images.githubusercontent.com/67270558/152563513-5dff3501-a385-4fd5-a09b-4336499b424a.svg)

### QuantitySelector

- 🎉 **New [QuantitySelector](https://faststore.dev/reference/ui/molecules/QuantitySelector) molecule** - [#1083](https://github.com/vtex/faststore/pull/1083) Use the `QuantitySelector` component to allow shoppers to select the quantity of a given product to purchase.

![QuantitySelector](https://user-images.githubusercontent.com/67270558/152564074-5a9b366d-8901-4cfc-b310-d73e897979d5.gif)


- 🎉 **Add missing components.** - [#1063](https://github.com/vtex/faststore/pull/1063)
`Breadcrumb`, `LoadingButton`, `PriceRange`, `RadioGroup` components are now exported by @faststore/ui.

### Badge

- ✨ **Add `...otherProps` to the [`Badge` component](https://faststore.dev/reference/ui/atoms/Badge)** - [#1085](https://github.com/vtex/faststore/pull/1085) Other props can now be passed on the Badge component.

### Radio	

- 🐛 **Fix FastStore UI imports** - [#1069](https://github.com/vtex/faststore/pull/1069) 
The `RadioGroup` and `RadioOption` components are now correctly imported in the UI.


### Payment Methods

- 🐛 **Removing aria-labelledby from payment methods component** - [#1092](https://github.com/vtex/faststore/pull/1092) 
The `PaymentMethods` component is no longer returning an accessibility error on [FastStore UI](https://faststoreui.netlify.app/?path=/story/molecules-paymentmethods--payment-methods).


### Accessibility

- 🐛 **Fix accessibility issues on FastStore UI components** - [#1096](https://github.com/vtex/faststore/pull/1096) The following components are no longer with accessibility issues: `Badge`, `Form`, `Price`, `Radio`, `Select`, `Textarea`, `Carousel`, `IconButton`, `PriceRange` and `Table`.

### AccordionItem

- ✨ **Add `prefixId` attribute to [AccordionItem](https://faststore.dev/reference/ui/molecules/Accordion#accordionitem)** - [#1118](https://github.com/vtex/faststore/pull/1118) The `prefixId` attribute, avoids the problem of having two Accordio IDs in the same page. 


### Starters

- ✨ **Update Starter Library** - [#1133](https://github.com/vtex/faststore/pull/1133) The Starter Library has new [Base Store](https://faststore.dev/starters/base) images.


### Contributing


- 🎉 **New [issue templates](https://github.com/vtex/faststore/issues/new/choose)** - [#1086](https://github.com/vtex/faststore/pull/1086)
Now you can use the templates to open issues or describe the proposed changes in your pull requests. For more info, refer to our *[Contribution guide](https://github.com/vtex/faststore/blob/master/CONTRIBUTING.MD#creating-pull-requests).*

## FastStore SDK
### Analytics
- ✨ **Add `item` generics to analytics events** - [#1101](https://github.com/vtex/faststore/pull/1101)  With the `item` property, users can control over a variety of types rather than a single one. This allows users to add extra properties inside an item.

## FastStore API
### VTEX Platform

- 🎉 **Add Sales channel to product query** - [#1108](https://github.com/vtex/faststore/pull/1108)
The `salesChannel` is now available in the product query. 

- 🐛 **Fix JS files exposure** - [#1081](https://github.com/vtex/faststore/pull/1081) 
This fix makes the `graphql-utils` package compatible with other frameworks.

- 🐛 **Fix ordering of breadcrumbList** - [#1094](https://github.com/vtex/faststore/pull/1094) 
The `categoryTrees` of the Breadcrumb component is now reversed and displaying the right category and subcategories in the store.

- 🐛 **Fix SKU loader** - [#1100](https://github.com/vtex/faststore/pull/1100) 
The SKU `dataLoader` algorithm is now fixed and can avoid potential errors, such as the *Could not find SKU for product* message.

- 🐛 **Fix Breadcrumb data on collection pages** - [#1104](https://github.com/vtex/faststore/pull/1104) 
Breadcrumb lists no longer return empty, now the catalog data fills the Breadcrumb information.

- 🐛 **Fix redirect to external pages** - [#1114](https://github.com/vtex/faststore/pull/1114) 
The `redirect.csv` file now allows redirecting to an external page.

- 🐛 **Fix unfiltered allCollections query** - [#1131](https://github.com/vtex/faststore/pull/1131) 
The collection query no longer opens to many requests to fetch categories, brands, and landing pages, since the collection field resolver respects the first and after parameters to not open to many requests.

## VTEX Headless CMS

- ✨ **fetch content by ID using REST API from CMS for preview** - [#1120](https://github.com/vtex/faststore/pull/1120) Now the `gatsby-plugin-cms` receives `webhookBody` params, fetch the values on the CMS API and return it to preview on webOps.

## Documentation 

- 📑 **New SDK Search reference** - [#1065](https://github.com/vtex/faststore/pull/1065)
Check out the new [`Search` SDK](https://faststore.dev/reference/sdk/search) module documentation and learn how to increase product discoverability by implementing a faceted search in your store.

- 📑 **Updated the [Quickstart documentation](https://faststore.dev/quickstart#step-3-configuring-your-project-settings)** - [#1066](https://github.com/vtex/faststore/pull/1066) Now you configure your FastStore project settings in the `store.config.js` file, an easy way to set up the repo without creating environment variables.

- 📑 **New FasStore FAQ** - [#1068](https://github.com/vtex/faststore/pull/1068)
Check out the [Frequently Asked Questions on FastStore Portal](https://faststore.dev/faq).

- 📑 **New Starters Library** - [#1065](https://github.com/vtex/faststore/pull/1066)
Check out the new [Starter Library](https://faststore.dev/starters) and quickly start your FastStore website with the templates.

- 📑 **New SDK Cart documentation** - [#1095](https://github.com/vtex/faststore/pull/1095)
Check out the new [SDK Card documentation](https://faststore.dev/reference/sdk/cart) and start managing your store’s shopping cart.


- 📑 **New VTEX IO WebOps Secrets guides** - [#1105](https://github.com/vtex/faststore/pull/1105)
Check out the new [Security documentation](https://faststore.dev/how-to-guides/webops/security) and learn how to use the Secrets API. Use it to hold confidential data and avoid exposing sensitive data in your FastStore code..

- 📑 **New VTEX Headless CMS documentation** - [#1111](https://github.com/vtex/faststore/pull/1111) Check out the new track for [VTEX Headless CMS](https://faststore.dev/tutorials/cms-overview) and learn how to integrate your FastStore project with VTEX Headless CMS, our preferred solution for content management.

- 📑 **New Migrating from gatsby-plugin-cms to gatsby-source-cms guide** - [#1126](https://github.com/vtex/faststore/pull/1126)
Check out the new **[Migrating from gatsby-plugin-cms to gatsby-source-cms guide](https://faststore.dev/how-to-guides/cms/vtex-headless-cms/Migrating%20from%20gatsby-plugin-cms%20to%20gatsby-source-cms)** and learn how to migrate to the newer `gatsby-source-cms` plugin that uses a dedicated API to fetch the content from the VTEX Headless CMS. Also it lets you use the Gatsby Preview Server to build and preview your pages before publishing them.


- 📑 **New on VTEX Platform integration - Hosting a FastStore + VTEX website** - [#1129](https://github.com/vtex/faststore/pull/1129)
Check out the new **[Hosting a FastStore + VTEX website](https://faststore.dev/how-to-guides/cms/vtex-headless-cms/Migrating%20from%20gatsby-plugin-cms%20to%20gatsby-source-cms)** guide and learn how to integrate your FastStore storefront project with VTEX, how to make it publicly available to end-users and have the VTEX Checkout functioning in your store.

- 📑 **New on VTEX Platform integration - Integrating VTEX login** - [#1132](https://github.com/vtex/faststore/pull/1132)
Check out the new **[Integrating VTEX login](https://faststore.dev/how-to-guides/platform-integration/vtex/integrating-the-vtex-login)** guide and learn how to integrate the **VTEX Login** with your **FastStore** project.


## Internal

- ✨ **Auto generate reference documentation for FastStore UI comoponents with `react-docgen-typescript` plugin** - [#1070](https://github.com/vtex/faststore/pull/1070)

- 🎉 **Send feedback for any documentation available on [FastStore Portal](https://faststore.dev/).** - [#1097](https://github.com/vtex/faststore/pull/1097)
To submit the feedback, look for *Was this page helpful?* at the end of any documentation on the Portal.

