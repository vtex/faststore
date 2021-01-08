# Page rendering

SFJ store interfaces are composed of [React](https://reactjs.org/) components. In this sense, it's necessary to understand how React handles rendering.

When developing a website or web-application with React, rendering can be processed either on the *client-side*, *server-side*, or both.

In the following sections, you'll have an overview of how these rendering modes work, and their pros and cons.

## Client-side rendering (CSR)

Client-side rendering (CSR) handles data fetching, templating, and routing directly in the browser via JavaScript. So, rather than getting all the content from a pre-processed HTML document, a bare-bone HTML file is sent to the browser. 

The browser, in its turn, initializes React and generates the HTML content using Javascript.

Notice that before the browser can parse the generated HTML file, React must render its components on the screen. 

Therefore, if you have many React components loading on the client-side, you may experience issues regarding a low [Time To Interactive (TTI)](https://web.dev/tti/). This scenario is where Server-Side Rendering often comes into play.

## Server-side rendering (SSR)

Server-side rendering delivers a fully populated HTML file to the client just as at the beginning of the internet. Nowadays, however, it's also possible to render Javascript code on the server.

In this sense, React can be initialized on the server-side. In this case, the initial React rendering takes place on the server.

In practice, that means that, for each request a user sends to the server, a React instance is activated. The user, in turn, receives back ready HTML and CSS files.

Notice that, when talking about SSR, data-fetching and templating take fewer unnecessary round-trips, meaning that the page is fatly loaded and that you can achieve a faster [Time To Interactive (TTI)](https://web.dev/tti/).

Relying on the server rendering functionality implies that you'll need to set up a custom server configuration. There is no simple Content delivery network (CDN) hosting here. Therefore, your server must initialize and render on-demand, as each user requests each file.

### SSG (static site generator)

Agora a renderização acontece em tempo de compilação, isso ocorre porque trazemos o servidor para nossa máquina e toda vez que compilamos nossa aplicação, a saída são arquivos estáticos que podemos servidor em CDN.

# Pros and cons


O SFJ foi construído para performar com escalabilidade personalizada, isso significa que podemos ter páginas estáticas e dinamicas a depender de uma personalização. 

Você pode configurar quais páginas devem ser construídas em tempo de compilação e quais páginas deverá ser montada apenas no navegador.
