import { ToastProps } from '@faststore/components'
import { Button, Toast, useUI } from '@faststore/ui'

const ToastUsage = ({ title, message, status, icon }: ToastProps) => {
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
        Click to trigger
      </Button>
      {toasts.length > 0 && <Toast />}
    </>
  )
}

export default ToastUsage
