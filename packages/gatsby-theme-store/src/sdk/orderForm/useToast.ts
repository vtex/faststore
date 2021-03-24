// TODO remove this fake useToast

export const useToast = () => {
  return {
    showToast: (_: string) => {},
    toastState: {
      isToastVisible: false,
    },
  }
}
