import { Button as UIButton } from '@faststore/ui'

export function CustomBuyButton() {
  return (
    <UIButton
      variant="primary"
      onClick={() => {
        alert('Hello User!')
      }}
    >
      New Buy Button
    </UIButton>
  )
}
