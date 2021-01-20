# Porque SEO na FastStore ?
O SEO é uma das principais metas do projeto. Ter paginas com tags e urls SEO friendly sao o que fazem a diferenca entre um trafego organico forte ou campanhas de marketing caras

Como explicado na parte de rendering, utilizamos da tecnica de hybrid rendering para renderizar as milhares de paginas de produtos. Isso significa que se o search engine nao executar JavaScript, tags nao serao geradas e a faststore vai performar mal no search engine. Felizmente, o Google executa JavaScript e é SPA-friendly (Single Page Application)

# Aonde encontro o codigo de SEO da pagina ?
Alem de dividirmos a renderizacao em `AboveTheFold.tsx`/`BelowTheFold.tsx`, tambem temos um componente especifico chamado `SEO.tsx` que lida com a renderizacao das tags e dados estruturados necessarios para a pagina. Para entender melhor o codigo e o que fazemos por padrao em cada pagina, leia o codigo de cada componente. Contudo, abaixo tenteamos sumarizar as tags geradas nos casos mais comuns.

## Home
A pagina de home tem tags padrao para geracao de titulo etc. Voce provavelmente vai querer fazer o shadowing e sobreescrever as tags geradas para melhor encaixar no seu negocio

## PDP
Todas as paginas de produto recebem a tag `<link rel="canonical">` com a url sendo o path da pagina. Ou seja, mesmo que tenhamos links apontando para `/:slug/p?skuId=123`, as tags canonicas geradas sao `/:slug/p`.

Todas PDP tambem recebem dados estruturados. Para integrar um sistema de reviews nos dados estruturados, voce devera fazer o shadowing

## Search
Aqui que mora todo problema e discussao em relacao ao SEO da pagina

Paginas de search sao tanto paginas de categoria/marca quando fullText searches. Ha tambem lading pages que contem contexto de search, como por exemplo a pagina do dia dos namorados etc. 

Gostariamos de um sistema que desse a maior relevancia possivel para paginas na arvore de categoria/marca/landing page e nao desse relevancia para searchs abertas ou paginas de busca com filtros. Isso é importante para nao ultrapassar o budget do GoogleBot

Atualmente pre-geramos todas as paginas de categoria/marca/landing page e geramos dinamicamente paginas de busca full text ou paginas com filtros. Nos alavancamos dessa propriedade do problema para saber quando indexar uma pagina ou nao.

Paginas full text ou com filtro sao removidas do indice do google utilizando a tag `<meta name="robots" content="noindex" />`
Paginas pre-geradas sao deduplicadas do indice do google utilizando as tags `<link rel="canonical" href="/path/to/category">`

Paginas de search devem ter, ou a tag `meta`, ou a tag `rel="canonical"`

Esses PRs explicam com exemplos como essas duas tags sao geradas:
1. [#9] (https://github.com/vtex-sites/btglobal.store/pull/9)
2. [#5](https://github.com/vtex-sites/btglobal.store/pull/5)

## Login / My account
Paginas do login e myaccount nao deveriam entrar no indice do search engine, entao recebem a tag `<meta name="robots" content="noindex" />`
