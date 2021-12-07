---
id: 4
sidebar_label: "4. Adding Content Types to the VTEX Headless CMS"
---

# Part 4: Adding Content Types to the VTEX Headless CMS

## Introduction

Now that we have defined schemas for our components, we have to specify which pages will be available for editing in the CMS interface and which special components will be available for each page.

In this part of this tutorial, you'll learn how to make different Content Types available for customization at the CMS.

---

## Declaring Content Types


To define different Content Types, we'll declare the `contentTypes` object in the `src/@vtex/gatsby-plugin-cms/index.ts` file. First, you must import the `ContentTypes` object from `@vtex/gatsby-plugin-cms` and then declare your content types as in the following example:

```ts {1,21-36} title=src/@vtex/gatsby-plugin-cms/index.ts 
import { Schema, ContentTypes, BuilderConfig } from '@vtex/gatsby-plugin-cms'
import { PLP } from '@vtex/gatsby-plugin-cms'

const AwesomeComponent: Schema = {
  title: 'My Awesome Component',
  ...
},

const siteMetadata: Schema = {
  title: 'Site Metadata',
  description: 'Configure global metadata of your site',
  ...
},

const facebook: Schema = {
  title: 'Facebook',
  description: 'Set up how Facebook displays your store',
  ...
}

export const contentTypes: ContentTypes = {
  home: {
    name: 'Home Page',
    extraBlocks: {},
  },
  ...PLP({}),
  seo: {
    name: 'Global SEO',
    extraBlocks: {
      SEO: {
        siteMetadata,
        facebook,
      },
    },
  },
}
```

Notice that, to define a content type, we must specify the following parameters:

|Key         |Description|
|:-----------|:-----------------------------------------------------|
|`name`      |The name that identifies your page in the CMS UI.|
|(optional) `extraBlocks`|Special sections available for use in that specific content type. If you declare these sections inside another object, such as `seo`, they will be presented in a distinct tab called **SEO**.|

Back to the previous example, notice that we defined three different `contentTypes`: the Home Page, Product Listing Page (PLP), and Global SEO. Notice that the "Global SEO" content type has a custom section named SEO, which allows editors to change the `siteMetadata` and `facebook` sections. Take the following example of creating a Global SEO page.

![Extra blocks](/img/tutorials/cms/cms-global-seo.png)

## Exporting Content Types

To export our content types, we must declare them inside the `builderConfig` object.

```ts title="/src/@vtex/gatsby-plugin-cms/index.ts"
import { Schema, BuilderConfig } from '@vtex/gatsby-plugin-cms'

export const builderConfig: BuilderConfig = {
  blocks: {
    // your sections
    AwesomeComponent
  },
  // your content types
  contentTypes,
  messages: {
    // your translation keys
  },
}
```

---

## Related resources

- [JSON Schema Reference](https://json-schema.org/understanding-json-schema/index.html)
- [`react-jsonschema-form` Playground](https://rjsf-team.github.io/react-jsonschema-form/)
