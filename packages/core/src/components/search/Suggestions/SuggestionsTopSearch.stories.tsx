import { SessionProvider } from '@faststore/sdk'
import { rest } from 'msw'

import { SearchInputProvider } from 'src/sdk/search/useSearchInput'

import { SuggestionsTopSearch } from '.'
import type { SuggestionsTopSearchProps } from '.'

const meta = {
  component: SuggestionsTopSearch,
  title: 'Features/Search/TopSearch',
}

const Template = (props: SuggestionsTopSearchProps) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SessionProvider initialState={{}}>
      <SearchInputProvider>
        <SuggestionsTopSearch {...props} />
      </SearchInputProvider>
    </SessionProvider>
  </div>
)

export const Default = Template.bind({})

Default.args = {
  topTerms: [
    { value: 'Office Supplies', count: 5 },
    { value: 'Headphones', count: 4 },
    { value: 'Notebooks', count: 3 },
    { value: 'Laser Printer', count: 2 },
    { value: 'Bluetooth Keyboard', count: 1 },
  ],
}

Default.parameters = {
  backgrounds: { default: 'dark' },
  msw: {
    handlers: [
      rest.get('/api/graphql', (_, res, ctx) => {
        return res(
          ctx.json({
            data: {
              search: {
                suggestions: {
                  terms: [
                    {
                      value: 'Option 1',
                    },
                    {
                      value: 'Option 2',
                    },
                  ],
                },
              },
            },
          })
        )
      }),
    ],
  },
}

export default meta
