B2B Faststore - Quick Order by File
Created at
 28 de nov. de 2024
Status
 Approved
Updated at
 22 de out. de 2025
Authors
 Arthur Andrade
Current Version
0.2
Contributors
 Everton Ataíde


Overview
Context
Esta RFC propõe a implementação da funcionalidade "Quick Order by File", que permitirá aos usuários realizar pedidos de forma rápida e eficiente, utilizando arquivos para adicionar produtos diretamente ao carrinho. Essa funcionalidade visa melhorar significativamente a experiência de compra para clientes que já sabem o que desejam adquirir. O Quick Order é configurável, permitindo que os comerciantes o ativam ou desativam conforme necessário diretamente pelo Headless CMS. Com isso, os clientes poderão desfrutar de uma experiência de compra mais ágil. As equipes de CMS e FastStore poderão colaborar para a sua implementação.

Proposal
A principal vantagem da funcionalidade de Quick Order é a capacidade de adicionar produtos diretamente ao carrinho a partir da busca, o que reduz significativamente o número de cliques e o tempo de navegação.
Anteriormente foi desenvolvida a RFC do Quick Order by Search, mas diferente desta no Quick Order by File um arquivo deve ser carregado para a loja e processado adicionando os produtos desejados direto no Mini cart.
Para orientar o desenvolvimento desta funcionalidade, foi criado um protótipo no Figma que detalha todo o fluxo de compra a ser seguido.

Parte do protótipo no Figma
No protótipo, abaixo da barra de pesquisa, foi adicionado um novo Dropdown que deve ser aberto  quando o botão for clicado:

Após o carregamento do arquivo e o botão Search ser clicado, o processamento dos dados é iniciado. Durante esse período, o Dropdown entra em um estado de carregamento e pode ser fechado sem interromper o processamento em andamento.

Estado de carregamento
Ao final do processamento, o Quick Order Drawer será aberto, semelhante ao mini cart, e será exibido para indicar o status de cada item processado. Ele mostrará informações como produtos em falta ou com quantidade indisponível, além de oferecer opções para ajustes necessários. Após as correções, será possível adicionar todos os itens diretamente ao mini cart.
O Quick Order Drawer é um novo componente desenvolvido para a funcionalidade de Quick Order By File. Ele possui muitas semelhanças com o componente já existente, o SkuMatrix, mas apresenta particularidades específicas relacionadas à validação dos produtos, conforme detalhado na seção de componentes. Sua implementação pode ser feita a partir da criação de um componente completamente novo ou por meio de modificações no SkuMatrix.


Quick Order Drawer com itens selecionados

O protótipo também inclui detalhes adicionais, como os estados de loading, erro e a versão mobile de cada componente, garantindo uma experiência consistente e adaptada a diferentes situações e dispositivos.
Technical Information
Formato do Arquivo
Para o formato do arquivo, será adotada a estratégia “as is”, reproduzindo os formatos já utilizados no Quick Order do Store Framework. O formato escolhido para upload é o CSV (Comma-Separated Values), devido à sua fácil interpretação, tornando-o ideal tanto para escrita quanto para processamento pelo sistema. O arquivo deve ser validado antes do processamento.
Estruturação do arquivo CSV:
O arquivo deve conter apenas duas colunas:
SKU: identificador do SKU.
Quantity: quantidade desejada para cada SKU.
A primeira linha deve ser usada como header.
Exemplo:

Exemplo de tabela com produtos
Upload
No protótipo, o Dropdown de busca oferece a funcionalidade de carregar arquivos, com duas formas disponíveis para seleção:
Selecionar arquivo do computador: nessa opção, é exibida a janela do sistema operacional ( "Explorador de Arquivos" no Windows ou "Finder" no macOS). Essa janela deve ser configurada para permitir a seleção apenas de arquivos no formato CSV.
Drag and Drop: nessa opção, o usuário pode arrastar e soltar arquivos diretamente na área de upload. Apenas arquivos no formato CSV devem ser aceitos e processados.
O arquivo carregado será tratado exclusivamente no front-end, sem a necessidade de enviá-lo para nenhuma rota, já que todo o processamento será realizado localmente.
Web Workers
Para o processamento de grandes arquivos localmente, é essencial utilizar ferramentas que evitem sobrecarregar o front-end e comprometer a experiência do usuário. Nesse contexto, os Web Workers são recomendados. Eles permitem a execução de tarefas pesadas em uma thread separada, evitando que o navegador fique lento ou que a interface pare de responder durante o processamento.
No React, uma forma prática de implementar Web Workers é utilizando bibliotecas que simplifiquem sua integração. Uma recomendação é a use-worker (uma biblioteca de hooks), que abstrai a comunicação entre o worker e o React, facilitando o envio de dados para processamento e a obtenção de resultados. Essa abordagem mantém o código organizado e melhora a experiência do usuário ao lidar com tarefas intensivas.
O processamento do arquivo carregado deve ocorrer dentro do Web Worker. É importante notar que um Web Worker não possui acesso à thread visual do front-end, o que significa que ele não pode interagir diretamente com os estados ou componentes do React. Por isso, o arquivo precisa ser processado no próprio Web Worker e, em seguida, os dados resultantes devem ser retornados para a thread principal. Este exemplo utilizando a biblioteca use-worker demonstra como esse processo funciona:

import React from "react";
import { useWorker } from "@koale/useworker";

const numbers = [...Array(5000000)].map((e) => ~~(Math.random() * 1000000));
const sortNumbers = (nums) => nums.sort();

const Example = () => {
  const [sortWorker] = useWorker(sortNumbers);

  const runSort = async () => {
    const result = await sortWorker(numbers); // non-blocking UI
    console.log(result);
  };

  return (
    <button type="button" onClick={runSort}>
      Run Sort
    </button>
  );
};

Processamento do Arquivo
Para processar arquivos CSV, é possível utilizar bibliotecas externas como o PapaParse, que oferece suporte avançado para manipulação de arquivos CSV, inclusive em arquivos grandes. No entanto, é importante considerar o impacto no tamanho final do bundle da Faststore, garantindo que ele não cresça excessivamente.
Alternativamente, arquivos CSV podem ser processados sem o uso de bibliotecas externas, de maneira eficiente e com relativa facilidade. Abaixo, segue um exemplo de como isso pode ser feito:

function processCSV(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result; // Conteúdo do arquivo CSV
    const rows = text.split('\n'); // Divide o conteúdo em linhas

    // Converte cada linha em um array de colunas
    const result = rows.map((row) => row.split(',').map((col) => col.trim()));

    console.log("Dados processados:", result);
  };

  reader.onerror = function () {
    console.error("Erro ao ler o arquivo.");
  };

  reader.readAsText(file); // Lê o arquivo como texto
}

// Uso no input:
<input
  type="file"
  accept=".csv"
  onChange={(e) => processCSV(e.target.files[0])}
/>



Buscar produto
A Faststore API oferece a query product, que recebe o identificador de um produto e retorna os principais dados relacionados a ele. Essa query é suficiente para obter as informações necessárias para preencher a Drawer. Porém se tratando de uma grande lista de produtos, recomenda-se a criação de uma query específica que retorne os dados de uma lista de produtos de uma só vez e dividir o total de produtos em requests menores.


// packages/api/src/platforms/vtex/resolvers/query.ts

export const Query = {
  product: async (_: unknown, { locator }: QueryProductArgs, ctx: Context) => {

Quick Order Drawer
Após os produtos serem encontrados, a Quick Order Drawer será aberta, indicando os status dos produtos. Alguns desses status precisam ser destacados para uma melhor comunicação com o usuário:
Produto adicionado com sucesso:

Produto inválido ou não encontrado:
Não é exibido no Drawer
Produto fora de estoque:

Produto com quantidade não disponível:

Adicionar ao carrinho
Atualmente, a funcionalidade de adicionar produtos ao carrinho na PDP utiliza o hook useBuyButton. Esse hook recebe as principais informações do produto e retorna as propriedades necessárias para realizar a adição ao carrinho, utilizando a cart store (localizada em packages/core/src/sdk/cart/index.ts) para gerenciar as informações e ações relacionadas ao mini cart.
No entanto, na Quick Order Drawer, é necessário adicionar múltiplos produtos ao carrinho simultaneamente. Para atender a esse requisito, recomenda-se a criação de um novo hook que também utilize a cart store, mas com a capacidade de adicionar um conjunto de produtos de uma só vez.

Configuração via Headless CMS
O uso dessa funcionalidade, assim como as labels nos componentes, deve ser configurado a partir de um Headless CMS. Para isso, será necessário desenvolver novos content-types e sections, que permitirão que as informações, como textos e rótulos, sejam gerenciadas diretamente no CMS.
Compatibilidade com demais features
Por fim é  necessário garantir que a funcionalidade de Quick Order seja compatível com as demais features já desenvolvidas como Packing, Price with Taxes e Sku Matrix, como referência será deixado o link para os Pull Requests dessas features.

Components
No decorrer do desenvolvimento da funcionalidade Quick Order by File, alguns componentes deverão ser desenvolvidos diretamente na @faststore/ui para enriquecer a biblioteca oficial de componentes da Faststore. Esses componentes incluem:
Tab List:

 Text Area:

Search Input Field:


Tasks
Adicionar novos componentes na faststore/ui (Tab List, Text Area, Search Input Field)
Modificar componentes existentes
Desenvolver fluxo de upload
Desenvolver fluxo de interpretação do arquivo CSV
Desenvolver query de busca de lista de produtos
Integrar Quick Order Drawer com os produtos
Adicionar funcionalidade de AddToCart
Tornar configurável Quick Order via Headless CMS
Checar compatibilidade com demais features
References
Product Vision
B2B Faststore Implementation
Figma Reference
RFC de SkuMatrix
Pull Request allVariantProducts
Pull Request Packing
Pull Request Price With Taxes
