---
id: 5
sidebar_position: 7
sidebar_label: "5. Defining translation keys"
pagination_next: tutorials/cms-storecomponents/6
---

# Part 5: Defining translation keys

:::caution
This tutorial is intended for those who started their FastStore project with the Store Components starter. If you started your project with the Base Store starter, please refer to [this](/tutorials/cms-overview) tutorial.
:::

## Introduction

Now that we have created our Section schemas and Content Types, we will declare the `messages` that will serve as translation keys for our components.

---

## Defining and exporting translation keys

Declare the translation keys directly inside `messages` in the `builderConfig` object as in the following example.

```ts {1,20-41} title=src/@vtex/gatsby-plugin-cms/index.ts 
import type { Schema, ContentTypes, BuilderConfig } from '@vtex/gatsby-plugin-cms'
import { PLP } from '@vtex/gatsby-plugin-cms'

const AwesomeComponent: Schema = {
  ...
},

const siteMetadata: Schema = {
  ...
},

const facebook: Schema = {
  ...
}

export const contentTypes: ContentTypes = {
  ...
}

export const builderConfig: BuilderConfig = {
  blocks: {
    ...
  },
  contentTypes,
  messages: {
    'admin/socialmediaTitle': 'Social Media',
    'admin/meta/socialmediaTitleFieldTitle': 'Title',
    'admin/meta/socialmediaTitleFieldDescription':
      'Appears when a link to this page is shared on social media',
    'admin/meta/socialmediaDescriptionFieldTitle': 'Description',
    'admin/meta/socialmediaDescriptionFieldDescription':
      'Appears when a link to this page is shared on social media',
    'admin/meta/socialmediaImageFieldTitle': 'Thumbnail',
    'admin/meta/socialmediaImageFieldDescription':
      'Appears when the page is shared on social media',
  },
}
```