import { MenuModel } from './menu'

export class MenuTreeItem {
  submenus: MenuTreeItem[] | undefined

  constructor(public nome: string) {}

  static fromModel(model: MenuModel) {
    console.log(model)
    const menuItem = new MenuTreeItem(model.name)
    return menuItem
  }
}
