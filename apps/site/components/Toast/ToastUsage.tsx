import { ToastProps } from '@faststore/components'
import { Button, Toast, useUI } from '@faststore/ui'

type ToastUsageProps = ToastProps & {
  btnLabel: string
}

const ToastUsage = ({
  title,
  message,
  status,
  icon,
  btnLabel,
}: ToastUsageProps) => {
  const { toasts, pushToast } = useUI()

  return (
    <>
      <Button
        variant="primary"
        onClick={() =>
          pushToast({
            title,
            message,
            status,
            icon,
          })
        }
        style={{ width: '16rem' }}
      >
        {btnLabel}
      </Button>
      {toasts.length > 0 && <Toast />}
    </>
  )
}

export default ToastUsage
