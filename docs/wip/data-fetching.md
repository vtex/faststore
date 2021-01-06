## How to fetch data for your pages
 
Um dos grandes benefícios do Gatsby é a sua natureza híbrida capaz de recuperar de dados de maneira estática ou dinâmica, ou seja, é possível recuperar dados no *tempo de build* como também dinâmicamente no lado do cliente. A escolha de qual abordagem usar, depende da natureza do dado e seu contexto, na seção abaixo explicaremos a diferença com exemplos. 

> Caso queira ler aprofundamente sobre esse assunto, recomendados a documentação do Gatsby de [Data Fetching](https://www.gatsbyjs.com/docs/data-fetching/).

### Static data

Dados estáticos são os conteúdos que não mudam frequentemente e também não dependem da interação por usuário. Como por exemplo a página de um produto, a descrição e atributos do produto não mudam constantemente, então faz sentido ser considerado como um dado estático que seja recuperado no tempo de build, assim quando o usuário acessa o produto o dado já está carregado.

Existem duas maneiras de recuperar dados de maneira estática no Gatsby: [Page Query](https://www.gatsbyjs.com/docs/recipes/querying-data#querying-data-with-a-page-query) e [Static Query](https://www.gatsbyjs.com/docs/how-to/querying-data/static-query/#reach-skip-nav).

### Dynamic data

Se o dado muda constantemente ou depende da interação do usuário, é uma forte indicação que ele deve ser dinâmico. Como por exemplo, o cálculo de frete que pode mudar dependendo da localidade do usuário que está interagindo ou a implementação de um carrinho de compras que seus dados mudam toda vez que um produto é adicionado, sendo necessário se comunicar com o backend da aplicação toda vez que o usuário interage com o carrinho.

Para recuperar um dado dinâmico durante tempo de execução, use qualquer método para recuperar dados que você geralmente usaria numa app React normal. Como por exemplo, usar a `fetch` API ou o `apollo-client`.

## What we provided out of the box with `gatsby-source-vtex`

O plugin `gatsby-source-vtex` conecta a [Gatsby data layer](https://www.gatsbyjs.com/docs/porting-from-create-react-app-to-gatsby/#unified-graphql-data-layer) ao [GraphQL da VTEX](https://github.com/vtex-apps/store-graphql), permitindo acessar dados da sua loja através do Graphql.

Para o plugin funcionar corretamente é necessário no arquivo `gatsby-config.js` mudar a varíavel `STORE_ID` para a conta VTEX desejada. Também é possível editar as varíaveis `enviroment` e `workspace`, exemplo:

```js
plugins: [
    {
      resolve: `@vtex/gatsby-source-vtex`,
      options: {
        tenant: STORE_ID, // conta da VTEX
        environment: 'vtexcommercestable' , // pode ser vtexcommercestable ou vtexcommercebeta
        workspace: 'master', // https://vtex.io/docs/concepts/workspace/ 
      },
    },
```

Se tudo ocorrer bem, ao rodar o site com o comando `yarn develop` a saída no final irá conter a URL para acessar o playground do Graphql do Gatsby:

```
View GraphiQL, an in-browser IDE, to explore your site data and schema
⠀
http://localhost:8000/___graphql
```

Acesse essa URL e verá no Schema todas as queries e mutations da API da VTEX, sinta-se à vontade para testar as queries e ver o que elas retornam. Para usar esses dados no seu site, basta seguir o que é indicado no tópico anterior de [How to fetch data for your pages](#How-to-fetch-data-for-your-pages).
