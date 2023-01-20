export interface MenuTreeItem {
  id: string
  nome: string
  submenus: MenuTreeItem[] | undefined
}
