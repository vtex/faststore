import { SearchInputProvider } from 'src/sdk/search/useSearchInput'

import { SearchHistory } from '.'
import type { SearchHistoryProps } from '.'

const meta = {
  component: SearchHistory,
  title: 'Organisms/Search/History',
}

const Template = (props: SearchHistoryProps) => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 16px',
        background: 'white',
      }}
    >
      <SearchInputProvider>
        <SearchHistory {...props} />
      </SearchInputProvider>
    </div>
  )
}

export const Default = Template.bind({})

Default.args = {
  history: [
    { term: 'headphone', path: '/' },
    { term: 'audio & video', path: '/' },
    { term: 'mh-7000', path: '/' },
    { term: 'jbl go', path: '/' },
  ],
}

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
