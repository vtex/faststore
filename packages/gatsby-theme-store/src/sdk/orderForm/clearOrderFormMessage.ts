interface ClearOrderFormMessagesParams {
  variables: {
    orderFormId: string
  }
}

export const clearOrderFormMessages = ({
  variables: { orderFormId },
}: ClearOrderFormMessagesParams): Promise<any> => {
  return new Promise((resolve) => resolve(orderFormId))
}
