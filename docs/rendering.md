# Page rendering

Since Store Framework Jamstack (SFJ) interfaces are composed of [React](https://reactjs.org/) components, it's necessary to understand how React handles rendering.

In this sense, rendering can be processed either on the *client-side*, *server-side*, or both.

In the following sections, you'll have an overview of how these three rendering modes work and their pros and cons.

## Client-side rendering

Client-side rendering (CSR) handles data fetching, templating, and routing directly in the browser via JavaScript. That means the browser receives a bare-bone HTML file rather than a fully pre-processed HTML document. The browser then initializes React and generates the HTML content with Javascript.

However, before the browser can parse the generated HTML file, React must first render all its components on the screen. Therefore, if a webpage has too many React components loading on the client-side, one may experience a low [Time To Interactive (TTI)](https://web.dev/tti/). This scenario is where server-side rendering often comes into play.

## Server-side rendering 

Server-side rendering (SSR) delivers a fully populated HTML file to the client, just like at the beginning of the internet. Nowadays, however, it's also possible to render Javascript code on the server.

This way, React can be started on the server-side, and the initial rendering can take place on the backend.

In practice, that means that a React instance is activated for each request a user sends to the server. The user, in turn, receives back ready HTML and CSS files.

Notice that, when talking about SSR, data-fetching and templating take fewer unnecessary round-trips to the server. Consequently, the page loads more quickly, and a faster [Time To Interactive (TTI)](https://web.dev/tti/) is possible.

To benefit from server rendering functionalities, it's necessary to set up a custom server configuration. In this case, there is no simple Content delivery network (CDN) solution. Therefore, your server must initialize and render the content on-demand, as each user requests each file.

## Static rendering

Static rendering generates a single HTML file for every page the user can access beforehand. Thus, differently from server-side rendering, which happens on-demand, static rendering happens once at build time.

This way, static rendering brings the server to the developer's local machine, meaning that static files are generated in advance every time the application is compiled. These files are then served on a CDN.

To handle Static rendering, a static site generator, such as [Gatsby](https://www.gatsbyjs.com/), might be necessary.

### Static site generator

A static site generator (SSG) is an application that generates full static HTML pages from source files and raw data, such as Markdown files.

In practice, an SSG can be understood as an alternative to Content Management Systems (CMS), another usual tool for creating, managing, and modifying webpages.

However, different from a CMS, an SSG not only allows you to host an entire website on a CDN but also provides greater flexibility, security, and performance.

## Pros and cons summary

The following table outlines the main pros and cons of the rendering methods previously presented:

|Rendering method|Pros|Cons|
|----------------|----|----|
|Client-side|<li>Easily scalable</li>|<li>Javascript slow initialization</li><li>SEO issues</li>|
|Server-side|<li>On-demand optmization</li><li>Better for SEO</li>|<li>Higher server consumption</li><li>Requires a specific server</li><li>Requires greater development efforts than CSR</li>|
|Static|<li>Layout-based optimization</li><li>Better for SEO</li><li>CDN hostable</li>|<li>No access to fetched data</li><li>Requires greater development efforts than CSR</li>|

## Why we chose static rendering

Store Framework Jamstack is build to perform with custom scalability. That means that, depending on the store's specific needs, the same website can have static and dynamic content.

To learn how to configure which pages should be assembled on the browser and which ones should be built at build time, check our documentation on [data fetching](data-fetching.md).
