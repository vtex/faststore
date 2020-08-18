import React from 'react'
import { WrapPageElementBrowserArgs } from 'gatsby'
import { IntlProvider } from 'react-intl'

const messages = {
  "buy-button.add-to-cart": [
    {
      "type": 0,
      "value": "ADICIONAR AO CARRINHO"
    }
  ],
  "carousel.next": [
    {
      "type": 0,
      "value": "Próximo"
    }
  ],
  "carousel.previous": [
    {
      "type": 0,
      "value": "Anterior"
    }
  ],
  "error-generic": [
    {
      "type": 0,
      "value": "Erro"
    }
  ],
  "facets.brand-selector.title": [
    {
      "type": 0,
      "value": "Marcas"
    }
  ],
  "facets.filters": [
    {
      "type": 0,
      "value": "Filtros"
    }
  ],
  "facets.tree-selector.title": [
    {
      "type": 0,
      "value": "Departamentos"
    }
  ],
  "loading": [
    {
      "type": 0,
      "value": "Carregando..."
    }
  ],
  "minicart.drawer.close": [
    {
      "type": 0,
      "value": "Fechar"
    }
  ],
  "minicart.drawer.count": [
    {
      "type": 0,
      "value": "Contagem ("
    },
    {
      "type": 1,
      "value": "count"
    },
    {
      "type": 0,
      "value": ")"
    }
  ],
  "minicart.drawer.go-checkout": [
    {
      "type": 0,
      "value": "IR AO CHECKOUT"
    }
  ],
  "minicart.drawer.shipping-disclaimer": [
    {
      "type": 0,
      "value": "Frete e impostos são calculados no checkout."
    }
  ],
  "minicart.drawer.subtotal": [
    {
      "type": 0,
      "value": "Subtotal"
    }
  ],
  "minicart.drawer.total": [
    {
      "type": 0,
      "value": "Total"
    }
  ],
  "offer.product-unavailable": [
    {
      "type": 0,
      "value": "Produto Indisponível"
    }
  ],
  "offer.units-left": [
    {
      "type": 1,
      "value": "quantity"
    },
    {
      "type": 0,
      "value": " items sobrando!"
    }
  ],
  "preview.not-found": [
    {
      "type": 0,
      "value": "Nenhuma previa encontrada. Esperando conteudo"
    }
  ],
  "product-not-found": [
    {
      "type": 0,
      "value": "Produto não encontrado"
    }
  ],
  "search.page-list.more": [
    {
      "type": 0,
      "value": "Mais"
    }
  ]
}

export const wrapPageElement = ({ element }: WrapPageElementBrowserArgs<object, { locale: string }>) => {
  console.log('teste oieee')
  return (
    <IntlProvider locale="pt" defaultLocale="pt" messages={messages}>
      {element}
    </IntlProvider>
  )
}
