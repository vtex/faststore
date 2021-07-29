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
        workspace,
      },
    }
  ],
}
```

where `tenant` is your store's account name and `workspace` is the VTEX IO workspace being used. Usually you will want to set this option to `master`.

An example config, using storecomponents account, would be:

```
module.exports = {
  siteMetadata: {
    siteUrl: `https://storecomponents.vtex.app`,
  },
  plugins: [
    {
      resolve: '@vtex/gatsby-plugin-cms',
      options: {
        tenant: 'storecomponents',
        workspace: 'master',
      },
    }
  ],
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

export const contentTypes: ContentTypes = {
  'my-lading-page': {
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
}
```

> Note that blocks must be a subset of schemas

You can read more about each property in the [CMS developer docs](https://vtex.io/)

### Querying data.
After creating contents in the CMS, you will be able to query them into the Gatsby GraphQL layer.
Each content type will have a corresponding type on the Gatsby GraphQL layer.

For instace, let's supose you are defining the content type for your home page. In your home page you have a banner, 
and you have some information about the SEO of this page, like title and description tags.
The following contentType definition is a valid solution:

```
{
  homePage: {
    blocks: {
      banner: {
        type: 'object',
        properties: {
          imageUrl: {
            type: "string",
          }
        }
      }
    },
    extraBlocks: {
      seo: {
        tags: {
          type: 'object'
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          }

        }
      }
    },
  }
}
```

This, in turn, would generate types in your Gatsby GraphQL layer. To query these data you can do the follwing query:

```
query HomePageQuery {
  cmsHomePage {
    sections: {
      name
      props
    }
    seo {
      tags {
        title
        description
      }
    }
  }
}
```

which would return the follwing json:
```
{
  data: {
    sections: {
      name: 'banner'
      props: {
        imageUrl: 'https://path/to/image/url'
      }
    },
    seo: {
      tags: {
        title: 'Page Title',
        description: 'Page Description'
      }
    }
  }
}
```

## Native Types
CMS plugin has pre-built blocks that speeds up your content types creation. Think of this like a component library that you can import and stitch together to create the content type you desire. 
These types include Carousel, Seo, and much more. To use it on your project, justs:
```js
import { Carousel } from '@vtex/gatsby-plugin-cms/native-types'

...

export default {
  ...
  blocks: {
    myBlock: {
      Carousel,
      ...
    }
  }
  ...
}
```

Check all available blocks, and their definition, at `@vtex/gatsby-plugin-cms/native-types`

### VTEX modules and Native Types
Some VTEX modules have first-class support in our CMS. To enable this support, you need to create your contentTypes with our native types for that specific module. 
Below you can find the doc and how these integrations work for each module.

#### Catalog
Sourcing Brands/Categories can be achieved by using `@vtex/gatsby-source-vtex` plugin. This plugin sources a `StoreColletion` node into the Gatsby's data layer containing basic info about a category and brand. Although being handy for creating pages using the [File System Route API](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/), `StoreCollection` does not have enought data to create a rich PLP, with banners and much more. For this, you need to extend `StoreCollection` with more data. 
To help you extend `StoreCollection` for your business users, we created a native type called `PLP`.

Whenever the CMS finds a node with the `PLP` signature, it will create a customization on the corresponding `StoreCollection` node adding this `PLP` as a foring key on the `StoreCollection` node. This way, you can easily fetch all sections of the `PLP` when rendering the `StoreCollection` page, thus allowing you to add any information you want to the `PLP`.

To use it, just add this to your cms config:
```js
import { PLP } from '@vtex/gatsby-plugin-cms/native-types'

export default {
  ...
  contentTypes: {
    ...PLP()
  },
  ...
}
```
