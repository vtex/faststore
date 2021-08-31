# Why SFJ?

Nesse documento vou tentar explicar como fazer um ecommerce e todas as layers que voce vai precisar fazer. Depois disso, vou mostrar como resolvemos no VTEX IO e como/o que estamos fazendo de diferente no SFJ e o que é SFJ e faststore

## Layers de um ecommmerce
Primeiramente, voce vai precisar de PBCs. Essas PBCs sao:
1. Motor de busca (biggy/algolia/elastic search)
2. Checkout para fechar um pedido (shopify/vtex)
3. OMS para gerenciar os pedidos
4. Sistema de reviews 
5. ... mais sistemas para a especialidade do seu negocio

Geralmente, cada layer é provida por empresas diferentes. Como sao empresas diferentes e os dados vem de lugares diferentes, o arquiteto de software vai pensar em colocar essas apis atras de um api gateway. Esse API gateway transforma os dados de um modo a ficar mais simples para o frontend consumir e resolve as varias empresas que estao por tras. Um diagrama para isso poderia ser:
![image](https://user-images.githubusercontent.com/1753396/131497680-d1da29de-b981-4fbd-8a01-0e92c66f3389.png)

Depois de ter esse gateway, voce vai decidir uma tecnologia de frontend para o seu negocio. As tecnologias de front end sao bem heterogenas, contudo, sempre voce vai precisar de um servidor para ela que vai consumir, de algum jeito, o gateway. Tambem, no ecommerce, precisamos de Server Side Rendering (SSR). O SSR consome tambem o gateway. Um diagrama para isso seria:
![image](https://user-images.githubusercontent.com/1753396/131498231-1539a2c5-29b5-4a4c-8e93-9e865d24e869.png)

Com isso, voce tem o basico de um ecommerce funcionando. Contudo, voce precisa ter um jeito de evoluir o seu ecommerce. A evolucao se da atraves de um deploy. A unica parte que o desenvolvedor é autoritativo ate agora é nas partes que ele fez, ou seja, o Gateway, o Servidor de FrontEnd e o Codigo JavaScript que roda no frontend. 
Geralmente, o desenvolvedor nao vai escrever em JS puro e havera uma parte intermediaria de compilacao. Vamos chamar essa etapa de compilacao + decidir qual versao esta oline de: "control plane". Com isso, temos o seguinte diagrama:
![image](https://user-images.githubusercontent.com/1753396/131499136-6bfdffd6-dbef-4dd3-8369-8dbea4b4ea4e.png)

Pronto! agora temos um site que vende e que consegue evoluir, ou seja, um ecommerce

## Ecommerce no VTEX IO
No VTEX IO, a gente tentou mexer justamente na parte do frontend server, API Gateway e Control plane.

O API Gateway do VTEX IO é a camada graphql. Essa camada é composta pelo graphql-server + "Apps de graphql".

A camada de frontend server utiliza a tecnologia de react. Essa tecnologia nos permite executar o mesmo codigo do frontend no servidor para SSR para que nao precisamos fazer dois codigos diferentes (um que executa no server e outro no browser) como no caso de outras tecnologias. 

O Control plane é composta pelo servico chamado Apps e pelo nosso compilador na nuvem chamado builder hub. 

![image](https://user-images.githubusercontent.com/1753396/131500739-7c47483c-1e2a-4a9e-b38f-81d76a0cd254.png)


## Ecommerce no SFJ
No SJF, a gente mudou essenccialmente todas essas camadas do IO com um approach diferente. 

A camada de frontend mudou bastante. O servidor parou de ser um servidor na nossa infraestrutura e passou a ser a propria CDN. Note tambem que o front-end server nao conversa mais com o api gateway. Ou seja, voce nem precisa mais usar REACT! voce so precisa gerar HTMLs!
![image](https://user-images.githubusercontent.com/1753396/131501088-45ac3bd1-8105-4fa2-bcd7-db322ed7ecb5.png)

Contudo, escrever htmls na mao é complicado e nao escalavel. Para ajudar na contrucao do frontend, temos 2 bibliotecas que te ajudam a criar um ecommerce em React. A primeira é store-sdk, um state managment library que tem o minimo estado necessario para fazer um ecommerce. Essa bilbioteca deifne estados que voce pode extender para resolver a sua logica de negocio que voce precisa. Esses estados sao
1. Session
2. Cart
3. UI
4. Search

Ha tambem nessa biblioteca, funcoes totalmente tipadas para voce lancar eventos de analytics. Esses tipos sao totalmente ccompativeis com o GA4. 

Outra parte para te ajudar a construir a loja sao a biblioteca de componentes. Essa biblioteca é totalmente css agnostic e tem somente behaviors feito nos componentes, ou seja, voce nao fica atrelado a uma tecnologia de css quando usa essa biblioteca.

Veja que voce nao precisa usar nenhuma dessas libs para fazer um loja no SFJ. Elas estao la simplesmente para te ajudar. Essas duas bibliotecas estamos chamando de faststore.

Outra mudanca que estamos fazendo é com o API Gateway. Agora, o desenvolvedor tem controle total do API gateway. Ele agora é single tenant, ou seja, cada loja tem uma instancia do servidor rodando na infraestrutura. Se o desenvolvedor quiser, ele pode refazer toda essa layer. Como vimos anteriormente, essa é a layer que pega e trasforma dados das PBCs, ou seja, pega e transforma dados de produto, carrinho, search, whishlist, review etc.
Essa layer é feita ccom um servidor nodejs que respeita a assinatura do express-js, um servidor opensource para nodejs. Agora nao é mais necessario graphql para protocolo de comunicacao por exemplo.
![image](https://user-images.githubusercontent.com/1753396/131503091-f3c6714c-c89b-4722-af0f-a3bdc854a5c5.png)


A grande mudanca veio no control plane. Antigamente o fluxo de evolucao do ecommerce era mais ou menos assim:
<img src="https://user-images.githubusercontent.com/1753396/131503467-3a7ce0c2-783a-403a-8d72-605f40186473.png" width="50%" />

Esse fluxo era controlado por uma ferramenta chamada toolbelt (o commando `vtex` no terminal). 
O grande problema que viamos com esse fluxo de trabalho é que ele nao era automatizado, ou seja, erros poderiam escapar do time de qa. Os times de QA tambem nao tem criterios homogeneos na plataforma, ou seja, alguns times verificam performancce da feature enquanto que outros so veem se a feature esta parecida com o figma. 

O que propomos agora é o seguinte:

<img src="https://user-images.githubusercontent.com/1753396/131504145-b9ca0015-5d2c-4f3f-8b0b-2a9353d44da7.png" width="50%" />

Ou seja, propomos duas coisas:
1. Remocao da necessidade da ferramenta do toolbelt. O desenvolvimento é feito pelo git
2. Adicao de uma nova camada de QA automatizada homogenea.

A coisa que tem que ficar clara é que, assim como nao se pode publicar algo que o time de QA de humanos rejeita, nao se pode publicar algo que o time de QA robotico rejeita tambem. Contudo, assim como humanos, robos podem ser maleaveis e deixar passar algumas coisas caso o jogo seja bem combinado. Por isso, toda config dos robos ficam no proprio repositorio da loja. Um exemplo disso seria:
A marca tem uma palea de cores que nao sao acessiveis. O site, portanto, falha no robo de accessibilidade. Podemos desativar esse robo de acessibilidade indo no repositorio do proprio site e desativando esse teste no robo. A partir de la, o robo vai dar verde e tudo vai ficar ok. 

O que nao podemos deixar é que o robo dê um negativo, e o desenvolvedor lance mesmo assim. Isso é equivalente ao time de QA dizendo nao e o dev lancando mesmo assim.


Apos o merge na master, o sitema de control plane novo executa o comando `build` do `package.json` do repositirio e faz o upload dos arquivos gerados na pasta `pbulic` na raiz do repositorio para a CDN pra ser servido. 
