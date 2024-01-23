import { Button } from 'ariakit'

export const Coupon = () => {
  const showButton = true

  return (
    <>
      {showButton ? (
        <Button className="text-brand-primary bg-transparent font-semibold">
          Aplicar cupom de desconto
        </Button>
      ) : (
        // TODO: Abrir Form com input de desconto. Como ainda não temos, vou deixar uma div como placeholder
        <div />
      )}
    </>
  )
}
