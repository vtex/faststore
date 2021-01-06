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



## SFJ building blocks
