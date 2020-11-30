# gatsby-plugin-cms

This plugin links your gatsby site with VTEX's CMS.

## Installation
To install `@vtex/gatsby-plugin-cms` in your project, just open your gatsby-config.js and add:
```
module.exports = {
  siteMetadata: {
    siteUrl: `https://www.example.com`,
  },
  plugins: [`@vtex/gatsby-plugin-cms`],
}
```

> Note: The siteUrl property must be defined and not left empty.

## Configuring CMS
All CMS configuration is done by shadowing this plugin's `index.ts` file. The shadowing can be done by creating the folowing structure in your gatsby project
```
src/
├── @vtex
│   ├── gatsby-plugin-cms
│   │   └── index.ts
```

The shadowed `index.ts` file must export two properties, schemas and contentTypes. These two options are explained in detail below

### Adding Components
To tell the CMS how to configure and render your components you need to export component schemas. 
Schemas is a json-schema like configuration that tells the CMS interface on how to render your component's configuration.

```
import { lazy } from 'react'
import { Schemas } from '@vtex/gatsby-plugin-cms'

export const components: Components = {
  ...
}

export const schemas: Schemas = {
  'path-to-my-component': {
    component: lazy(() => import('path-to-my-component'))
    title: 'My Awesome Component',
    description: 'This is my first CMS ready component',
    type: 'object',
    properties: {
      prop1: {
        title: 'Default value for prop1',
        type: 'string',
      },
      prop2: {
        title: 'Default value for prop2',
        type: 'string',
      }
    }
  }
}
```

> Note that every entry in `schemas` must have a corresponding `components`.

### Adding content types
To add your components to the CMS interface you will need a content type. Content types define the page structure and they are those who you will be able to edit in the CMS interface.
To export a content type, just:

```
import { Schemas, ContentTypes } from '@vtex/gatsby-plugin-cms'

export const schemas: Schemas = {
  ...
}

export const contentTypes: ContentTypes = {
  'my-lading-page': {
    blocks: {
      ...
    },
    extraBlocks: {
      ...
    },
    beforeBlocks: {
      ...
    },
    afterBlocks: {
      ...
    },
    messages: {
      ...
    },
  },
}
```

> Note that blocks must be a subset of schemas

You can read more about each property in the [CMS developer docs](https://vtex.io/)
