const getOrderFormController = () => import('./controller')

interface ClearOrderFormMessagesParams {
  orderFormId: string
}

const clearOrderFormMessages = async (
  mutationInput: ClearOrderFormMessagesParams
) => {
  const orderFormController = await getOrderFormController()

  return orderFormController
    .clearMessages(mutationInput)
    .then((orderForm) => ({ data: orderForm }))
}

export const useClearOrderFormMessages = () => clearOrderFormMessages
