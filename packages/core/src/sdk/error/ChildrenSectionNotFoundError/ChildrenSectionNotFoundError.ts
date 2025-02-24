export default class ChildrenSectionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChildrenSectionNotFoundError'
  }
}
