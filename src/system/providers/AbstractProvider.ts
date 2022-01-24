import { Application } from '../core/Application'

export abstract class AbstractProvider {
  constructor(protected readonly app: Application) {}
  abstract register(): void
  abstract boot(): void
}
