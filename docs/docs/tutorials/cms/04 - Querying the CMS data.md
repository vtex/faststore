---
id: 4
sidebar_label: "4. Querying the CMS data"
---

# Part 4: Querying the CMS data

## Introduction

After syncing your Section and Content Type definitions with the VTEX Headless CMS, each Content Type will have a corresponding type on the Gatsby GraphQL layer. 

In this section, we'll see how to query for this data using the Graph*i*QL IDE and how to adapt our `pages` components to consume this data.

---

## Step by step

### Step 1 - Installing the `gatsby-source-cms` plugin

To fetch data from the VTEX Headless CMS data layer into your FastStore project, you'll need to install the `@vtex/gatsby-source-cms` plugin.

1. Open the terminal and change to the source directory of your FastStore project.
2. Install the VTEX Headless CMS plugin.

  ```sh
  yarn add @vtex/gatsby-source-cms
  ```

3. Open the `gatsby-config.js` file and add the following configurations for the `@vtex/gatsby-source-cms` plugin.

```diff {5-11} title=gatsby-config.js
module.exports = {
  ...,
  plugins: [
    ...,
+    {
+      resolve: '@vtex/gatsby-source-cms',
+      options: {
+        workspace: '{workspace}', //replace with the VTEX IO workspace in use - generally, use master.
+        tenant: '{account}',      //replace with the name of your VTEX account
+      },
+    },
  ],
}
```

:::caution
Remember to replace the values between curly brackets according to your scenario.
:::


### Step 2 - Querying the CMS data in GraphiQL

Before we query the CMS data in our `pages` components, let's verify how our data is structured using the GraphiQL IDE.

1. Open the terminal and change to the working directory of your project.
2. Start a development server.
   ```sh
   yarn develop
   ```
3. Open the GraphiQL IDE at [http://localhost:8000/__graphql](http://localhost:8000/__graphql). Notice that a corresponding type on the GraphQL data layer is available for each content type that you have defined (e.g., `cmsHome`, `cmsInstitutionalPage`).
4. Test some queries and check what they return. For example, for the `home` content type, try the following query:
   
   ```gql
  query MyQuery {
    cmsHome {
      sections {
        name
        data
      }
    }
  }   
  ```

  This will return a JSON object as in the following example:

  ```json
  {
    "data": {
      "cmsHome": {
        "sections": [
          {
            "name": "DynamicShelf",
            "props": {
              "searchParams": {
                "hideUnavailableItems": true,
                "from": 0,
                "to": 11,
                "collection": "143"
              },
              "title": "Special Offers"
            }
          }
        ]
      }
    },
    "extensions": {
      "enableRefresh": "true"
    }
  }
  ```

Next, we'll query this data inside our React components and use it to update their contents.

### Step 3 - Querying the CMS data in the `pages` components

Let's now query the CMS data in our `pages` so we can update our React components with the CMS content.

1. Open your project in the code editor of your preference.
2. Open the corresponding `pages` component of a Content Type you're integrating with the VTEX Headless CMS. For example, for the Home Page, open `/src/pages/index.tsx`.
3. Update the GraphQL query of your content type to fetch the desired data from the CMS. Take the following example.

  ```graphql {10-15} title=src/pages/index.tsx
  export const query = graphql`
    query HomePageQuery(
      site {
        siteMetadata {
          title
          description
          titleTemplate
        }
      }
      cmsHome {
        sections {
          name
          data
        }
      }
      ...
  `
  ```



### Step 4 - Rendering the CMS content

Finally, let's update our components to present the content submitted via the VTEX Headless CMS app. To do that, take the following steps:

1. Open your FastStore project in any code editor of your preference.
2. Go to the `src/components` folder and create a new file named `RenderCMS.tsx`.
3. Copy and paste the following code into the `RenderCMS.tsx` file.

  ```tsx title="src/components/RenderCMS.tsx"
  import React from 'react'
  import Shelf from 'src/components/sections/Shelf'
  import type { ComponentType } from 'react'

  /**
   * Sections: Components imported from '../components/sections' only.
   * Do not import or render components from any other folder in here.
   */
  const COMPONENTS: Record<string, ComponentType<any>> = {
    Shelf
  }

  interface Props {
    sections?: Array<{ name: string; data: unknown }>
  }

  function RenderCMS({ sections }: Props) {
    return (
      <>
        {sections?.map(({ name, data }, index) => {
          const Component = COMPONENTS[name]

          if (!Component) {
            throw new Error(
              `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
            )
          }

          return <Component key={`cms-section-${index}`} {...data} />
        })}
      </>
    )
  }

  export default RenderCMS
  ```

4. Import the React components corresponding to the Sections you previously created in the CMS (e.g., `RichText`, `Shelf`) and add it to `COMPONENTS`. For example:

  ```tsx {3,8} title="src/components/RenderCMS.tsx"
  import React from 'react'
  import Shelf from 'src/components/sections/Shelf'
  import RichText from 'src/components/sections/RichText'
  import type { ComponentType } from 'react'

  const COMPONENTS: Record<string, ComponentType<any>> = {
  Shelf,
  RichText,
  }
  ```

5. Save your changes. 
6. Now, go to the `pages` component corresponding to the Content Type you are integrating with the CMS. For example, for the **Home Page**, go to the `src/pages/index.tsx` file.
7. Import the `RenderCMS` component.
  ```tsx
  import RenderCMS from 'src/components/RenderCMS'
  ```
8. Add the `RenderCMS` component to your page as in the following example.
  ```tsx title="src/pages/index.tsx"
  <RenderCMS sections={cmsHome?.sections} />
  ```
9. Save your changes.
    
---

## Related resources

- [Gatsby documentation - Plugins](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/)
- [Gatsby documentation - Querying data in pages with GraphQL](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)