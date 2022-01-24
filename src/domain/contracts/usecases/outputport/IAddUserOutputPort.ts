import { IViewport } from '../IViewport'

export interface IAddUserOutputPort {
  added(userData: AddUserRequestData): IViewport
  failed(): IViewport
}
