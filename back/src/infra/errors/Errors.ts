export abstract class Errors<T = unknown> {
  nextHandler: T | null = null
  setNext(handler: T): T {
    this.nextHandler = handler
    return handler
  }
}