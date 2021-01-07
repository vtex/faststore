<!-- This will be one of the first contacts for a developer that never heard about Jamstack to learn more about it and why we use it.

Objective:

Introduce the developer to the Jamstack architecture, giving an overview of its main aspects

This explanation doesn't need to be a long one. Instead, we must redirect the user to official resources.

Explain why we chose this architecture, showing the main benefits of using Jamstack to build an e-commerce store.

Organize it into topics, followed by a brief explanation.Example: Faster Performanceblalblallbabla (one paragraph) -->

## Jamstack Overview

> "A modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup" - Mathias Biilmann (CEO & Co-founder of Netlify).

Jamstack is an architecture which core principles [pre-rendering](https://jamstack.org/glossary/pre-render/) and [decoupling](https://jamstack.org/glossary/decoupling/), which enables sites to be delivered with better performance, confidence and resilience than ever before. 

![Traditional Web vs Jamstack](/docs/images/jamstack.png)
<!-- Maybe use a better image here? -->

For more information access [jamstack.org](https://jamstack.org/).

### Why Jamstack for VTEX

There are two main aspects that are impacted positively in our platform as a result of using Jamstack architecture: performance and developer experience.

#### Performance

As eCommerce specialists we understand the impact of performance for our customers' success. Performance boosts a store's visibility with [better SEO scores](https://developers.google.com/web/updates/2018/07/search-ads-speed), [raises customer satisfaction](https://neilpatel.com/blog/loading-time/) and as far as [a 0.1-second imporvement of mobile site speed increases conversion rates by 8.4% for retail sites](https://www.thinkwithgoogle.com/intl/en-ca/marketing-strategies/app-and-mobile/mobile-page-speed-data/). 

Jamstack allows us to trade build time for performance. By pre-rendering the markup of our websites we are able to make them readly available with  a [Content Delivering Network ](https://jamstack.org/glossary/cdn/)(CDN) avoiding unnecessary round trips to servers. And even though the content held by CDN's is static, it does not mean that the sites are static. In fact, with a process called [hydration](https://reactjs.org/docs/react-dom.html#hydrate) all the power of client-side Javascript and API's is still available with the advantage that all the static content is immediatly ready.

#### Developer Experience

Another change that comes with this architecture is in the way of developing. It is not dependant on proprietary technology, it is built on tools and conventions vastly available. This makes the code more accessible and more customizable, permits local development, eases debugging and facilitates finding talented developers with the skills to work with our stores.

We continue to provide security, scale, maintainability, portability, [best practices](https://jamstack.org/best-practices/) and much more out of the box. But now with more transparency, freedom to customize almost everything and showing hints about how to avoid changes that endanger your site's performance. <!-- here i thought about linking to an explanation  of how we enforce paying attention to performance also-->


