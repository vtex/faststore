interface ClearOrderFormMessagesParams {
  orderFormId: string
}

const clearOrderFormMessages = ({
  orderFormId,
}: ClearOrderFormMessagesParams): Promise<any> => {
  return new Promise((resolve) => resolve(orderFormId))
}

export const useClearOrderFormMessages = () => clearOrderFormMessages
