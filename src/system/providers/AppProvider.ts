import { AbstractProvider } from './AbstractProvider'
import { Container, Service } from 'typedi'
import { UserFactory } from '../../domain/entities/factories/UserFactory'

export class AppProvider extends AbstractProvider {
  boot(): void {
    Container.set<UserFactory>('IUserFactory', UserFactory)
  }

  register(): void {
    console.log('AppProvider::register')
  }
}
