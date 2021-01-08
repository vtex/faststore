# Page rendering

SFJ store interfaces are composed of [React](https://reactjs.org/) components. In this sense, it's necessary to understand how React handles rendering.

When developing a website or web-application with React, rendering can be processed either on the *client-side*, *server-side*, or both.

In the following sections, you'll have an overview of how these rendering modes work, and their pros and cons.

## Client-side rendering (CSR)

Client-side rendering (CSR) handles data fetching, templating, and routing directly in the browser via JavaScript. So, rather than getting all the content from a pre-processed HTML document, a bare-bone HTML file is sent to the browser. 

The browser, in its turn, initializes React and generates the HTML content using Javascript.

Notice that before the browser can parse the generated HTML file, React must render its components on the screen. 

Therefore, if you have many React components loading on the client-side, you may experience issues regarding a low [Time To Interactive (TTI)](https://web.dev/tti/). This scenario is where Server-Side Rendering often comes into play.

### SSR (server side render)

Como o React precisa inicializar em algum lugar, agora a renderização inicial acontece no servidor. Então, para cada solicitação que o usuário envia para o servidor, você ativa uma instância do React e manda para o navegador o HTML e CSS pronto.

Dito isso, como você está contando com a funcionalidade do servidor para fazer essa renderização, é necessário ter uma configuração de servidor personalizada. Não há hospedagem CDN simples aqui - seu servidor precisa inicializar e renderizar a página de cada usuário mediante solicitação.

### SSG (static site generator)

Agora a renderização acontece em tempo de compilação, isso ocorre porque trazemos o servidor para nossa máquina e toda vez que compilamos nossa aplicação, a saída são arquivos estáticos que podemos servidor em CDN.

# Pros and cons

| Renderização | Prós                                                              | Contras                                                                                                        |
|--------------|-------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| CSR          | - Fácil de escalar                                                | - Inicialização lenta de JS<br/>- Preocupações com SEO                                                             |
| SSR          | - Otimização baseada em requisição<br/>- Melhor uso de SEO            | - Consumo maior do servidor<br/>- Necessita de um servidor específico<br/>- Mais esforço de desenvolvimento do que CSR |
| SSG          | - Otimização baseada em layout<br/>- Melhor uso de SEO - CDN hostable | - Sem acesso aos dados de consulta<br/>- Mais esforço de desenvolvimento do que CSR                                |

## Why we choose to use SSG

O SFJ foi construído para performar com escalabilidade personalizada, isso significa que podemos ter páginas estáticas e dinamicas a depender de uma personalização. 

Você pode configurar quais páginas devem ser construídas em tempo de compilação e quais páginas deverá ser montada apenas no navegador.
