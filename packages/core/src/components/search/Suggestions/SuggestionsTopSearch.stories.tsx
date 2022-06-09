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
    <SuggestionsTopSearch {...props} />
  </div>
)

export const Default = Template.bind({})

Default.args = {
  searchedItems: [
    { name: 'Office Supplies', href: '/office-supplies' },
    { name: 'Headphones', href: '/headphones' },
    { name: 'Notebooks', href: '/notebooks' },
    { name: 'Laser Printer', href: '/laser-printer' },
    { name: 'Bluetooth Keyboard', href: '/bluetooth-keyboard' },
  ],
}

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
