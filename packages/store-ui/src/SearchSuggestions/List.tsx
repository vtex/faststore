/** @jsx jsx */
import { FC } from 'react'
import { jsx, ButtonProps } from 'theme-ui'

export const SearchSuggestionsListContainer: FC<{ variant: string }> = ({
  variant,
  children,
}) => <div sx={{ variant: `suggestions.${variant}` }}>{children}</div>

export const SearchSuggestionsListTitle: FC<{
  title: string
  variant: string
}> = ({ title, variant }) => (
  <span sx={{ variant: `suggestions.${variant}.title` }}>{title}</span>
)

export const SearchSuggestionsListTotal: FC<ButtonProps> = ({
  children,
  variant,
  ...props
}) => (
  <div sx={{ variant: `suggestions.${variant}.total` }} {...(props as any)}>
    {children}
  </div>
)

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
