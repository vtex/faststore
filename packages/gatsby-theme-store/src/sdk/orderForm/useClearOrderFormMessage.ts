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
    .then((orderFormId) => ({ data: { clearOrderFormMessages: orderFormId } }))
}

export const useClearOrderFormMessages = () => clearOrderFormMessages
