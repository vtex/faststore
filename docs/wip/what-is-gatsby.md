# What is Gatsby?

[GatsbyJS](https://www.gatsbyjs.com/docs/) is a [GraphQL](https://graphql.org/) and [React](https://reactjs.org/)-based static site generator that brings together the best of [Webpack](https://webpack.js.org/), React, GraphQL, and other modern tools to provide a better developer experience. 

## Por que o escolhemos?

A maneira como Gatsby usa GraphQL é feito para coletar seus dados de qualquer lugar: Markdown, JSON, seu CMS favorito, APIs de terceiros, em qualquer lugar! E no momento da construção, ele cria um servidor GraphQL interno de todos esses dados. Portanto, em seus componentes React seus dados são consultados em tempo de construção daquele mesmo lugar, da mesma forma por meio do GraphQL. Além da forma em como o GraphQL é utilizado, o gatsby é poderoso pelo seu ecossistema baseado em plugins, onde pode-se encontrar milhares deles em sua [página](https://www.gatsbyjs.com/plugins).

Além de podermos nos alavancar da arquitetura de plugins, também podemos aumentar nosso nível de personalização a partir de shadowing. Este recurso nos permite substituir um arquivo do `src` incluído no pacote webpack com seu próprio arquivo.
