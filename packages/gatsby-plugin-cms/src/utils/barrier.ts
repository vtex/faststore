/**
 * @description
 * A simple barrier that waits for the data until it's available.
 * This is handy when you want to coordinate data processing between asynchronous functions
 */
export class Barrier<T> {
  private promise: Promise<T>
  private resolve: ((value: T) => void) | undefined

  constructor() {
    this.resolve = undefined
    this.promise = new Promise<T>((resolve) => {
      this.resolve = resolve
    })
  }

  public set(data: T) {
    this.resolve?.(data)
  }

  public get() {
    return this.promise
  }
}
