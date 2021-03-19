interface ClearOrderFormMessagesParams {
  variables: {
    orderFormId: string
  }
}

const clearOrderFormMessages = ({
  variables: { orderFormId },
}: ClearOrderFormMessagesParams): Promise<any> => {
  return new Promise((resolve) => resolve(orderFormId))
}

export const useClearOrderFormMessages = () => clearOrderFormMessages
