import { Fragment, type ReactNode } from 'react'

/**
 * Renders a label template replacing `{token}` placeholders. Tokens listed in
 * `strong` are wrapped in `<strong>` so names stand out inside a sentence.
 */
export function renderLabel(
  template: string,
  values: Record<string, string>,
  strong: string[] = []
): ReactNode {
  const parts = template.split(/(\{\w+\})/g)

  return parts.map((part, index) => {
    const token = /^\{(\w+)\}$/.exec(part)?.[1]

    if (!token || !(token in values)) {
      return <Fragment key={index}>{part}</Fragment>
    }

    return strong.includes(token) ? (
      <strong key={index}>{values[token]}</strong>
    ) : (
      <Fragment key={index}>{values[token]}</Fragment>
    )
  })
}
