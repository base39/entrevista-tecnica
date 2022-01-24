import { IViewport } from '../IViewport'

export interface IAddUserInputPort {
  createUser(userData: AddUserRequestData): IViewport
}
