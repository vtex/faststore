---
id: 4
description: Adapt your storefront components to consume data from the VTEX Headless CMS.
sidebar_label: '4. Querying the CMS data'
pagination_label: Part 4
---

# Part 4: Querying the CMS data

## Introduction

After syncing your Section and Content Type definitions with the VTEX Headless CMS, each Content Type will have a corresponding type on the Gatsby GraphQL layer.

In this section, we'll see how to query for this data using the REST API and how to adapt our `pages` components to consume this data.

---

## Step by step

### Step 1 - The Headless CMS API

To fetch data from the VTEX Headless CMS data layer into your FastStore project, you'll need to fetch the data from the Headless CMS API.

:::info
For more information about the CMS API, check the [`CMS API Reference`](https://developers.vtex.com/docs/api-reference/headless-cms-api#get-/_v/cms/api/-builderId-/-content-type-).
:::

### Step 2 - Rendering the CMS content

Let's update our components to present the content submitted via the VTEX Headless CMS app. To do that, take the following steps:

1. Open your FastStore project in any code editor of your preference.
2. Go to the `src/pages/index.tsx` file.
3. Import the React components corresponding to the Sections you previously created in the CMS (e.g., `RichText`, `Shelf`) and add it to `COMPONENTS`. For example:

    ```tsx {3,8} title="src/components/RenderCMS.tsx"
    import Shelf from 'src/components/sections/Shelf'
    import RichText from 'src/components/sections/RichText'

    const COMPONENTS: Record<string, ComponentType<any>> = {
      Shelf,
      RichText,
    }
    ```

4. Save your changes.

---

## Related resources

- [Gatsby documentation - Plugins](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/)
- [Gatsby documentation - Querying data in pages with GraphQL](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)
