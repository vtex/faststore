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


## Ecommerce no SFJ


