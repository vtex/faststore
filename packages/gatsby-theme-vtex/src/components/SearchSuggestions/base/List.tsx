/** @jsx jsx */
import { jsx } from '@vtex/store-ui'

export interface BaseListItem {
  key: string
}

interface ListItemProps<T extends BaseListItem> {
  item: T
  index: number
  variant: string
}

interface Props<T extends BaseListItem> {
  variant: string
  items: T[] | null | undefined
  children: (props: ListItemProps<T>) => JSX.Element
}

export const SearchSuggestionsList = <T extends BaseListItem>({
  items,
  variant,
  children,
}: Props<T>) => (
  <ul sx={{ variant: `suggestions.${variant}.list` }}>
    {items?.map((item, index) => (
      <li key={item.key}>
        {children({
          item,
          index,
          variant: `suggestions.${variant}.item`,
        })}
      </li>
    ))}
  </ul>
)
