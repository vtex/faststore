export declare global {
  namespace globalThis {
    function requestIdleCallback(args: () => void): number
    function cancelIdleCallback(id: number): void
  }
}
