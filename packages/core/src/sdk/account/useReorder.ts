export const useReorder = () => {
  const reorder = async (orderId: string) => {
    // TODO: Implement reorder functionality
    console.log('Reorder order:', orderId)
  }

  return {
    reorder,
    loading: false,
    error: null as Error | null,
  }
}
