import { IUserFactory } from './IUserFactory'
import { Service } from 'typedi'

export class UserFactory implements IUserFactory {
  make(name: string, email: string, password: string, id?: number) {}
}
