export interface IUserFactory {
  /**
   * @param name
   * @param email
   * @param password
   * @param id
   */
  make(name: string, email: string, password: string, id?: number)
}
