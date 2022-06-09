import { SearchHistory } from '.'
import type { SearchHistoryProps } from '.'

const meta = {
  component: SearchHistory,
  title: 'Organisms/Search/History',
}

const Template = (props: SearchHistoryProps) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SearchHistory {...props} />
  </div>
)

export const Default = Template.bind({})

Default.args = {
  history: ['headphone', 'audio & video', 'mh-7000', 'jbl go'],
}

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
