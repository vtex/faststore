declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoIncompletes(): R
    }
  }
}
