/** @jsx jsx */
import { jsx } from 'theme-ui'

interface ItemProps<T> {
  item: T
  variant: string
  index: number
}

interface Props<T> {
  variant?: string
  title?: string
  items: T[] | null | undefined
  children: (props: ItemProps<T>) => JSX.Element
}

export const SearchSuggestionsList = <T extends any>({
  items,
  title = '',
  variant = 'history',
  children,
}: Props<T>) => (
  <div sx={{ variant: `suggestions.${variant}` }}>
    <span sx={{ variant: `suggestions.${variant}.title` }}>{title}</span>
    <ul sx={{ variant: `suggestions.${variant}.list` }}>
      {items?.map((item, index) =>
        children({
          item,
          index,
          variant: `suggestions.${variant}.item`,
        })
      )}
    </ul>
  </div>
)
