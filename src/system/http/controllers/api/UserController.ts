import { Controller, Get } from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { IUserFactory } from '../../../../domain/entities/factories/IUserFactory'

@Controller()
@Service()
export class UserController {
  @Inject('IUserFactory')
  userFactory?: IUserFactory

  constructor() {}

  @Get('/users')
  getAll() {
    console.log(this.userFactory)
    return 'alvaroooo'
  }
}
