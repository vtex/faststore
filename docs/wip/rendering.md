# Types of rendering: SSG, SSR, CSR

No mundo do React existem formas diferentes de renderizar páginas:

### CSR (client-side rendering)

É quando um arquivo HTML vazio é enviado para o navegador e, em seguida, o HTML é criado pelo Javascript. Isso ocorre porque o código do React precisa ser inicializado para renderizar os componentes na tela antes que ele possa cuspir HTML para o navegador analisar. Se você tiver muitos componentes carregando na tela, poderá ter problemas se quiser manter o tempo de interação (TTI) baixo. Esse cenário é onde o SSR frequentemente entra em jogo.

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
