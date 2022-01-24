import { AbstractProvider } from './AbstractProvider'
import { Database } from '../core/Database'

export class DatabaseProvider extends AbstractProvider {
  register(): void {
    new Database()
  }

  boot(): void {}
}
