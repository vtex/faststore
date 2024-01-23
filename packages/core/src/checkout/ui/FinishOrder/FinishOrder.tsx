import classNames from 'classnames'
import { Button } from '../Button'

export function FinishOrder() {
  return (
    <div className="bg-brand-secondary fixed bottom-0 left-0 right-0 mx-6 mb-6 md:mx-16 lg:static lg:m-0">
      <Button
        onClick={console.log}
        className={classNames(
          'bg-brand-primary will-change-opacity flex h-12 w-[stretch] items-center justify-center transition-opacity duration-200 md:h-14 lg:w-full'
        )}
        data-testid="continue-button"
      >
        Continuar
      </Button>
    </div>
  )
}
