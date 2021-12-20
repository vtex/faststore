---
hide_table_of_contents: true
pagination_next: null
---

import IconGrid from "@site/src/components/IconGrid/IconGrid";
import FastStorePackages from "@site/src/components/FastStorePackages/FastStorePackages";

# FastStore

FastStore is a **light yet powerful set of libraries** made for developers who want to explore their knowledge and creativity building comprehensive ecommerce solutions. FastStore supports integration with **headless ecommerce platforms** and delivers all the necessary building blocks for creating custom ecommerce experiences. 

FastStore architecture is **Jamstack-based**, meaning FastStore projects can be deployed with [VTEX IO WebOps](/tutorials/architecture/1), Netlify, Vercel, or any other Jamstack platform in the market. 

With FastStore and by following our recommended practices, you can achieve outstanding performance on your store website (**90+ on [Google PageSpeed Insights](https://pagespeed.web.dev/)**). In addition, FastStore also delivers:

- Integration with Headless CMS's.
- Intelligence via [Google Analytics](https://analytics.google.com/analytics/web/) and [Google Tag Manager](https://tagmanager.google.com/).
- SEO-ready pages with [Google Rich Results](https://search.google.com/test/rich-results) support.
- Native internationalization, enabling multi-region stores.
- Support to millions of SKUs, enabling marketplace solutions.

FastStore encapsulates the following three main packages:

<FastStorePackages>

[ ![](/img/faststore-ui.png) **FastStore UI** A React component library of basic UI primitives built on Atomic Design. FastStore UI complies with accessibility standards and is compatible with any CSS framework and preprocessor.](/reference/ui/get-started-faststore-ui)

[ ![](/img/faststore-sdk.png) **FastStore SDK** An extensible state management library, compatible with Google Analytics 4, that handles all meaningful states an ecommerce store might have, such as, cart and user session states.](/reference/sdk/faststore-sdk)

[ ![](/img/faststore-api.png) **FastStore API** A GraphQL API layer between your store and your favorite ecommerce platform.](/reference/api/faststore-api)

</FastStorePackages>

Besides these three main libraries, FastStore also counts with the following packages: 

- **`graphql-utils`** - Extracts and processes GraphQL queries. 
- **`lighthouse-config`** - An ecommerce focused [Lighthouse](https://developers.google.com/web/tools/lighthouse/) CI configuration.
- **`renovate-config`** - Configuration of [Renovate](https://github.com/renovatebot/renovate), a bot responsible for updating dependencies automatically.
  
:::caution
If you check FastStore repository on GitHub, you'll also find some Gatsby-specific plugins (`@vtex/gatsby-plugin-cms`, `@vtex/gatsby-plugin-nginx`, `@vtex/gatsby-source-store`, `@vtex/gatsby-source-vtex`. We aim to provide Gatsby-agnostic solutions for these plugins soon.
:::

## Get involved

<IconGrid>

[ ![](/img/github.png) **GitHub** Star and watch our GitHub repository for future updates.](https://github.com/vtex/faststore)

[ ![](/img/youtube.png) **Office hours** Join our Office Hours to chat directly with FastStore developers.](https://www.youtube.com/playlist?list=PLCO3mIyiWj2bkzFzS1N9XLX_iwk0BpO-V)

</IconGrid>