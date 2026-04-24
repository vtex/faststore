import { Button, Icon } from '@faststore/ui'

type ExpandButtonProps = {
  isExpanded: boolean
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void
  count: number
  label?: string
  ariaControls?: string
}

export function ExpandButton({
  isExpanded,
  onToggle,
  label,
  ariaControls,
}: ExpandButtonProps) {
  return (
    <Button
      aria-expanded={isExpanded}
      aria-controls={ariaControls}
      data-fs-list-orders-table-expand-button
      size="small"
      variant="primary"
      inverse
      iconPosition="right"
      icon={
        isExpanded ? (
          <Icon width={16} height={16} name="CaretUp" aria-label="Collapse" />
        ) : (
          <Icon width={16} height={16} name="CaretDown" aria-label="Expand" />
        )
      }
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle(e)
      }}
    >
      {isExpanded ? 'View less' : (label ?? 'View all')}
    </Button>
  )
}
