Esse tutorial cobre o processo de setup da loja desde a criacao do repo git ate a criacao de tokens e perfils de acesso no admin. Algumas partes deste tutorial podem ser realizadas somente pelo pessoal da VTEX e outras podem somente ter acesso o usuario master da loja. 
Ao final deste tutorial voce vai ter sua loja rodando com o nosso tema basico em `http://<account>.vtex.app`

## Pre-requisites
Conhecimentos basicos de:
- Git/Github
- Admin VTEX
- Yarn

Voce tambem precisa de uma conta na VTEX, a.k.a `storecomponents` e um usuario no Github

## Tools
- Yarn
- Git
- VTEX Toolbelt
- Node.JS >14

## Set up
Apos instalar e setar as ferramentas acima, siga os pacos abaixo

### Instalacao de apps
Va ao terminal e logue na sua conta da VTEX
```sh
vtex login <account>
```

Apos logar corretamente, instale as apps com o comando:
```sh
vtex install vtex.admin-search@1.x vtex.admin-cms@0.x vtex.graphql-gateway@0.x
```

### Criacao do repo no github
Agora vamos criar o repositorio no github. Va em https://github.com/vtex-sites e clique em `new`

[![Screen-Shot-2021-01-06-at-11-37-42-AM.png](https://i.postimg.cc/Y9m6Nwy3/Screen-Shot-2021-01-06-at-11-37-42-AM.png)](https://postimg.cc/XG4B3tWG)

Crie o repositorio com o nome `<account>.store` a partir do template da storecomponents. Voce devera ter uma tela parecida com:

[![Screen-Shot-2021-01-06-at-11-39-33-AM.png](https://i.postimg.cc/bJzPkzJX/Screen-Shot-2021-01-06-at-11-39-33-AM.png)](https://postimg.cc/CZ69VpkJ)

Clique em `create repository` e pronto, o repositorio esta criado

### Criacao de chaves
Se voce nao for usar o CMS da VTEX, remove o plugin `@vtex/gatsby-plugin-cms` do `package.json` da sua loja e va para a proxima etapa.

Para que o seu site consiga pedir dados do CMS, uma appKey/appToken precisa ser criada. Crie uma appKey/appToken seguindo [esse tutorial](https://developers.vtex.com/vtex-developer-docs/docs/getting-started-authentication#creating-the-appkey-and-apptoken)

Apos a chave criada, va no ambiente administrativo em `configuracoes de conta => gerenciamento da conta => perfils de acesso` e crie um novo perfil de acesso.

De o nome de `FastStore CMS` para esse novo perfil de acesso. Nesse perfil de acesso, configure os seguintes produtos e clique em `Salvar`

[![Screen-Shot-2021-01-06-at-11-47-15-AM.png](https://i.postimg.cc/9XdxsGJB/Screen-Shot-2021-01-06-at-11-47-15-AM.png)](https://postimg.cc/G9pJys0B)

Apos ter o perfil de acesso criado, associe o perfil de acesso criado com a chave appKey/appToken criada. Esse é o unico perfil de acesso que essa chave deve ter.

Agora com a chave associada corretamente com o perfil de acesso, voce precisa colocar a chave em uma variavel de ambiente no seu ambiente de CI/CD escolhido. As chaves precisam estar setadas nas seguintes variaveis de ambiente:

```
VTEX_CMS_APP_KEY=<appKey>
VTEX_CMS_APP_TOKEN=<appToken>
```

Caso voce esteja usando a Netlify como CI/CD, voce pode setar essas variaveis de ambiente diretamente no painel da Netlify. 

Caso esteja usando o CI/CD do DevTools, voce ainda nao consegue setar variaveis de ambiente por api ou dashboard. Peca no slack para o `@vini` colocar essas variaveis de ambiente na conta correta

> Nao é necessario setar essas variaveis no ambiente de desenvolvimento local se voce esta logado na conta com `vtex login`. Preste atencao que o token do `vtex login` expira e apos 24h voce vai ter que fazer o `vtex login` novamente para o build local voltar funcionar.

### Primeiro build local
Para comecar a desenvolver, clone o repositorio do github em uma pasta com:
```sh
git clone <my-git-repo> && cd <my-git-repo>
```

Instale as dependecias com
```sh
yarn
```

Agora vamos apontar o repositorio para a conta na VTEX desejada. Abra o `gatsby-config.js` e mude a variavel `STORE_ID` de `storecomponents` para a conta na VTEX desejada.

Agora abra o arquivo `staticPaths.json` e adicione os paths que voce deseja que sejam otimizados. Lembre que mais paths colocados aqui fazem o build e desenvolvimento ficarem mais lentos e demorados.

Apos feitos esses procedimentos, vamos comecar a desenvolver com
```
yarn develop
```

Voce deveria ver uma saida parecida com:
```sh
$ gatsby develop
success open and validate gatsby-configs - 0.053s
success load plugins - 1.226s
success onPreInit - 0.038s
success initialize cache - 0.007s
success copy gatsby files - 0.045s
success onPreBootstrap - 0.017s
success createSchemaCustomization - 0.018s
success [gatsby-graphql-toolkit] fetching PageContent - 0.583s
warning The @vtex/gatsby-plugin-cms plugin has generated no Gatsby nodes. Do you need it?
success Checking for changed pages - 0.000s
success source and transform nodes - 2.991s
success building schema - 0.349s
info Total nodes: 121, SitePage nodes: 65 (use --verbose for breakdown)
success createPages - 0.787s
success Checking for changed pages - 0.000s
success createPagesStatefully - 0.091s
success update schema - 0.049s
success write out redirect data - 0.001s
success Build manifest and related icons - 0.126s
success onPostBootstrap - 1.185s
info bootstrap finished - 9.530s
success onPreExtractQueries - 0.001s
success extract queries from components - 1.343s
success write out requires - 0.027s
success run static queries - 0.039s - 5/5 127.04/s
success run page queries - 7.513s - 72/72 9.58/s
⠀
You can now view storecomponents.store in the browser.
⠀
  http://localhost:8000/
⠀
View GraphiQL, an in-browser IDE, to explore your site data and schema
⠀
  http://localhost:8000/___graphql
⠀
Note that the development build is not optimized.
To create a production build, use gatsby build
```

Para gerar uma versao de producao do site e servi-la, voce vai precisar do `docker` instalado. O comando abaixo gera o site e serve com o `docker`

```
yarn build && yarn docker:serve
```

Esse comando acima é bem importante quando queremos debugar o site em producao localmente. Isso ajuda bastante a entender melhorias de performance e bundles

> Dica: Sempre que ocorrer um problema, faca um `yarn clean` para limpar qualquer artefato corrompido de um build anterior

### Primeiro PR
Agora crie uma branch do git com:
```sh
git checkout -b feat/initial-pr
```

faca um build de producao para gerar assets otimizados com
```sh
yarn clean && yarn build
```

adicione todos os arquivos no PR com:
```
git add . && git commit -m "Initial Setup" && git push
```

Crie o PR. Apos o PR criado, voce vai ver os Bots validando e trabalhando no PR. Apos todos os checks terminarem com sucesso, mergeie o PR.



Happy Development !

