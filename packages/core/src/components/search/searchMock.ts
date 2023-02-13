import { rest } from 'msw'

import { productGridItems, searchTerms } from 'src/../.storybook/mocks'

export const products = productGridItems.map((item) => item.node)

export const msw = {
  handlers: [
    rest.get('/api/graphql', (req, res, ctx) => {
      const {
        url: { searchParams },
      } = req

      const operationName = searchParams.get('operationName')

      if (operationName === 'TopSearchSuggestionsQuery') {
        return res(
          ctx.json({
            data: {
              search: {
                suggestions: {
                  terms: searchTerms,
                },
              },
            },
          })
        )
      }

      if (operationName === 'SearchSuggestionsQuery') {
        return res(
          ctx.json({
            data: {
              search: {
                suggestions: {
                  terms: searchTerms,
                  products,
                },
              },
            },
          })
        )
      }

      return res(ctx.status(400))
    }),
  ],
}
