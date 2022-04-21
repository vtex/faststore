---
hide_table_of_contents: true
pagination_next: null
---

import IconGrid from "@site/src/components/IconGrid/IconGrid";
import FastStorePackages from "@site/src/components/FastStorePackages/FastStorePackages";

# FastStore

FastStore is a **light yet powerful set of libraries** made for developers who want to explore their knowledge and creativity building comprehensive ecommerce solutions. FastStore supports integration with **headless ecommerce platforms** and delivers all the necessary building blocks for creating custom ecommerce experiences. 

FastStore architecture is **Jamstack-based**, meaning FastStore projects can be deployed with VTEX IO WebOps, Netlify, Vercel, or any other Jamstack platform in the market. 

With FastStore and by following our recommended practices, you can achieve outstanding performance on your store website (**90+ on [Google PageSpeed Insights](https://pagespeed.web.dev/)**). In addition, FastStore also delivers:

- Integration with Headless CMS's.
- Intelligence via [Google Analytics](https://analytics.google.com/analytics/web/) and [Google Tag Manager](https://tagmanager.google.com/).
- SEO-ready pages with [Google Rich Results](https://search.google.com/test/rich-results) support.
- Native internationalization, enabling multi-region stores.
- Support to millions of SKUs, enabling marketplace solutions.

FastStore encapsulates the following three main packages:

<FastStorePackages>

[ <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><g stroke-linecap="square" stroke-width="2" fill="none" stroke="currentColor" stroke-linejoin="miter" stroke-miterlimit="10"><polyline points="44 21 44 4 4 4 4 44 21 44"></polyline> <line data-cap="butt" x1="45" y1="45" x2="29" y2="29" stroke-linecap="butt" stroke="#f71963"></line> <polyline points="29 44 29 29 44 29" stroke="#f71963"></polyline></g></svg> **FastStore UI** A React component library of basic UI primitives built on Atomic Design. FastStore UI complies with accessibility standards and is compatible with any CSS framework and preprocessor.](/reference/ui/get-started-faststore-ui)

[ <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 32 32"><g stroke-linecap="square" stroke-width="1" stroke-miterlimit="10" fill="none" stroke="currentColor" stroke-linejoin="miter" class="nc-icon-wrapper" transform="translate(0.5 0.5)"><polyline points="2 6.5 9 10 16 6.5" data-cap="butt" stroke-linecap="butt"></polyline><line x1="9" y1="10" x2="9" y2="18.5" data-cap="butt" stroke-linecap="butt"></line><polygon points="16 6.5 9 2.999 2 6.5 2 15 9 18.5 16 15 16 6.5"></polygon><polyline points="16 6.5 23 10 30 6.5" data-cap="butt" stroke-linecap="butt"></polyline><line x1="23" y1="10" x2="23" y2="18.5" data-cap="butt" stroke-linecap="butt"></line><polygon points="30 6.5 23 2.999 16 6.5 16 15 23 18.5 30 15 30 6.5"></polygon><polyline points="9 18.5 16 22 23 18.5" data-cap="butt" stroke-linecap="butt" stroke="#f71963"></polyline><line x1="16" y1="22" x2="16" y2="30.5" data-cap="butt" stroke-linecap="butt" stroke="#f71963"></line><polygon points="23 18.5 16 14.999 9 18.5 9 27 16 30.5 23 27 23 18.5" stroke="#f71963"></polygon></g></svg> **FastStore SDK** An extensible state management library, compatible with Google Analytics 4, that handles all meaningful states an ecommerce store might have, such as, cart and user session states.](/reference/sdk/faststore-sdk)

[ <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><g stroke-linecap="square" stroke-width="2" fill="none" stroke="currentColor" stroke-linejoin="miter" class="nc-icon-wrapper" stroke-miterlimit="10"><path d="M14.2,26a14,14,0,1,1,19.6,0"></path><circle cx="24" cy="16" r="6"></circle><circle cx="24" cy="29" r="3" stroke="#f71963"></circle><circle cx="24" cy="43" r="3" stroke="#f71963"></circle><circle cx="13" cy="40" r="3" stroke="#f71963"></circle><line x1="24" y1="32" x2="24" y2="40" data-cap="butt" stroke-linecap="butt" stroke="#f71963"></line><polyline points="13 37 13 33 21 29" data-cap="butt" stroke-linecap="butt" stroke="#f71963"></polyline><circle cx="35" cy="40" r="3" stroke="#f71963"></circle><polyline points="35 37 35 33 27 29" data-cap="butt" stroke-linecap="butt" stroke="#f71963"></polyline></g></svg> **FastStore API** A GraphQL API layer between your store and your favorite ecommerce platform.](/reference/api/faststore-api)

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

[ <svg xmlns="http://www.w3.org/2000/svg" width="510" height="510" viewBox="0 0 30 30" fill="var(--ifm-color-black)"> <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg> **GitHub** Star and watch our GitHub repository for future updates.](https://github.com/vtex/faststore)

[ ![](/img/youtube.png) **Office hours** Join our Office Hours to chat directly with FastStore developers.](https://www.youtube.com/playlist?list=PLCO3mIyiWj2bkzFzS1N9XLX_iwk0BpO-V)

</IconGrid>
