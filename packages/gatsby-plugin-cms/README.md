# gatsby-plugin-cms
This plugin links your gatsby site with VTEX's CMS datalayer.

## Installation
To install `@vtex/gatsby-plugin-cms` in your project, just open your gatsby-config.js and add:
```
module.exports = {
  siteMetadata: {
    siteUrl: `https://www.example.com`,
  },
  plugins: [
    {
      resolve: '@vtex/gatsby-plugin-cms',
      options: {
        tenant,
        appKey,
        appToken,
      },
    }
  ],
}
```

where `tenant` is your store's account name. `appKey` and `appToken` are your CMS's key and token. 

You don't need to setup `appKey` and `appToken` for developing localy. Just login into your account using [VTEX IO toolbelt](https://www.npmjs.com/package/toolbelt).

> Note: The siteUrl property must be defined and not left empty.

## Generating appKey and appToken
To generate the access keys, please [follow this tutorial](https://developers.vtex.com/vtex-developer-docs/docs/getting-started-authentication)

After the keys are generated, you will need to give this key access to the right CMS resource. For this:

1. Log into your admin environment.
2. Go to `Account Settings > Account Management > Access profiles`.
3. Click in `New Profile`
  1. Set name as `FastStore CMS`
  2. Choose the product `Dynamic Storage`
  3. Check `Full access in all documents`
  4. Check `Read only documents`
  5. Click on `Save`
4. Go to `Account Settings > Account Management > Users`.
5. Filter by your app key
6. Leave the `FastStore CMS` as the only access profile in this key

Now open your build platform (Netlify/Vercell) and make sure to add these keys as build-time secrets

> Note: Do NEVER commit any of your appKeys or appTokens since this is a SERIOUS SECURITY THREAT

## Configuring CMS
All CMS configuration is done by shadowing this plugin's `index.ts` file. The shadowing can be done by creating the folowing structure in your gatsby project
```
src/
├── @vtex
│   ├── gatsby-plugin-cms
│   │   └── index.ts
```

The shadowed `index.ts` file must export one variable called `contentTypes`. This option is explained in detail below

### Adding Components and defining ContentTypes
To tell the CMS how to configure and render your components you need to define a component schema. The component schema is written in Json Schema v6, a versatile description language for creating forms. 

For instance, a component description is something like:

```
import { Schemas } from '@vtex/gatsby-plugin-cms'

const schemas: Schemas = {
  'my-component-name': {
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

Now that we have a component's schema, we must associate this schema to a content type. Content types define a page structure and they are those who you will be able to edit in the CMS interface.
To export a content type, just:

```
import { Schemas, ContentTypes } from '@vtex/gatsby-plugin-cms'

const schemas: Schemas = {
  'my-component-name': {
    ...
  }
}

export const contentTypes: ContentTypes = [
  {
    id: 'my-lading-page',
    name: 'My Landing Page',
    blocks: {
      'my-component-name': schemas['my-component-name'],
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
]
```

> Note that blocks must be a subset of schemas

You can read more about each property in the [CMS developer docs](https://vtex.io/)
