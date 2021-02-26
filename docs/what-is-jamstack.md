# JAMstack

**JAM**stack is a web architecture that decouples front and backend development by establishing how the following three technologies should interact to build faster applications and websites:

- **J**avaScript: Runs on the client-side, handling dynamic programming and supporting libraries, such as [React](http://reactjs.org/).
- **A**PI: Communicates with the server-side for data fetching, authentication, or any other backend functionality.
- **M**arkup: Is prebuilt at build time through a [static site generator](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Introduction#static_site_generators), such as [Gatsby](https://www.gatsbyjs.com/). It is, then, served from a [content delivery network (CDN).](https://developer.mozilla.org/en-US/docs/Glossary/CDN)

In practice, whenever a user requests a page from a JAMstack website, the browser serves the user with a prebuilt Markup file. JavaScript is, then, used to include dynamic content and call the necessary APIs. The APIs, in their turn, communicate with backend services, providing a secure serverless solution.

>ℹ️ *To make the most of your Store Framework Jamstack project, we strongly encourage you to learn more about the JAMstack architecture by checking out core concepts, such as [pre-rendering](https://jamstack.org/glossary/pre-render/) and [decoupling](https://jamstack.org/glossary/decoupling/).*

## Why JAMstack?

By adopting the JAMstack architecture, VTEX Store Framework gives you the foundation needed **to quickly build high-performance stores.**

This is closely related to two main aspects of JAMstack: improved performance and better developer experience.

### Improved performance

In the ecommerce business, appealing offers, high-quality products, or brand recognition might not be enough for converting leads if user-experience is left behind. For digital customers, every millisecond counts. In this sense, website performance impacts not only your store's visibility and SEO ranking but also your customers' decision process.

When it comes to reducing the loading time, nothing beats serving pre-built files over a CDN. This approach avoids unnecessary round trips to servers and backend delays. However, even though the content held by CDNs is static, that doesn't mean you can't provide a dynamic and personalized experience for your customers.

Thanks to a process called [hydration](https://reactjs.org/docs/react-dom.html#hydrate), all the power of client-side Javascript and APIs is still available with the advantage that static content can now be provided beforehand.

### Better developer experience

Since the JAMstack architecture is not dependant on any proprietary set of tools, developers can benefit from more freedom to work with their favorite technologies. 

Consequently, finding talented developers to build your website's storefront becomes easier, your website code becomes more accessible, debugging becomes faster and local development becomes possible.

By adopting the JAMstack architecture, we continue to afford a scalable, secure, and maintainable solution out of the box, but now with more mechanisms to improve performance and transparency for storefront customization.
