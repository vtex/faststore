<!-- This will be one of the first contacts for a developer that never heard about Jamstack to learn more about it and why we use it.

Objective:

Introduce the developer to the Jamstack architecture, giving an overview of its main aspects

This explanation doesn't need to be a long one. Instead, we must redirect the user to official resources.

Explain why we chose this architecture, showing the main benefits of using Jamstack to build an e-commerce store.

Organize it into topics, followed by a brief explanation.Example: Faster Performanceblalblallbabla (one paragraph) -->

#JAMstack

**JAM**stack is a web architecture that decouples front and backend development by establishing how the following three technologies should interact to build faster applications and websites:

- **J**avaScript: Runs on the client-side, handling dynamic programming and supporting libraries, such as [React](http://reactjs.org/).
- **A**PI: Communicates with the server-side for data fetching, authentication, or any other backend functionality.
- **M**arkup: Is prebuilt at build time through a [static site generator](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Introduction#static_site_generators), such as [Gatsby](https://www.gatsbyjs.com/). It is, then, served from a [content delivery network (CDN).](https://developer.mozilla.org/en-US/docs/Glossary/CDN)

In practice, whenever a user requests a page from a JAMstack website, the browser serves the user with a prebuilt Markup file. JavaScript is, then, used to include dynamic content and call the necessary APIs. The APIs, in their turn, communicate with backend services, providing a secure serverless solution.

>ℹ️ *To make the most of your Store Framework Jamstack project, we strongly encourage you to learn more about the JAMstack architecture by checking out core concepts, such as [pre-rendering](https://jamstack.org/glossary/pre-render/) and [decoupling](https://jamstack.org/glossary/decoupling/).*

# Why JAMstack?

By adopting the JAMstack architecture, VTEX Store Framework gives you the foundation needed **to quickly build high-performance stores.**

This is closely related to two main aspects of JAMstack: improved performance and better developer experience.

#### Performance

As ecommerce specialists, we understand the impact of performance for our customers' success. Performance boosts a store's visibility with [better SEO scores](https://developers.google.com/web/updates/2018/07/search-ads-speed), [raises customer satisfaction](https://neilpatel.com/blog/loading-time/) and as far as [a 0.1-second improvement of mobile site speed increases conversion rates by 8.4% for retail sites](https://www.thinkwithgoogle.com/intl/en-ca/marketing-strategies/app-and-mobile/mobile-page-speed-data/). 

Jamstack allows us to trade build time for performance. By pre-rendering the markup of our websites we are able to make them readily available with a [Content Delivering Network ](https://jamstack.org/glossary/cdn/)(CDN) avoiding unnecessary round trips to servers. And even though the content held by CDN's is static, it does not mean that the sites are static. In fact, with a process called [hydration](https://reactjs.org/docs/react-dom.html#hydrate) all the power of client-side Javascript and APIs is still available with the advantage that all the static content is immediately ready.

### Better developer experience

Since the JAMstack architecture is not dependant on any proprietary set of tools, developers can benefit from more freedom to work with their favorite technologies. 

Consequently, finding talented developers to build your website's storefront becomes easier, your website code becomes more accessible, debugging becomes faster and local development becomes possible.

By adopting the JAMstack architecture, we continue to afford a scalable, secure, and maintainable solution out of the box, but now with more mechanisms to improve performance and transparency for storefront customization.
