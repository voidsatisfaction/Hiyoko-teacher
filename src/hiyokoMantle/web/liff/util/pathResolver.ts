import { TLambdaHttpEvent } from "../../types"

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class PathMethodResolver {
  store: {}

  constructor() {
    this.store = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {}
    }
  }

  setFunction(
    url: string,
    method: HTTPMethods,
    func: () => any
  ): void {
    this.store[method][url] = func
  }

  // FIXME: enable path parameters
  getFunction(
    url: string,
    method: HTTPMethods
  ): () => any {
    return this.store[method][url]
  }
}