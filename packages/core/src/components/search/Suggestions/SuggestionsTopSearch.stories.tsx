import { SessionProvider } from '@faststore/sdk'

import { SearchInputProvider } from 'src/sdk/search/useSearchInput'

import { SuggestionsTopSearch } from '.'
import type { SuggestionsTopSearchProps } from '.'

const meta = {
  component: SuggestionsTopSearch,
  title: 'Organisms/Search/TopSearch',
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
}

export default meta
