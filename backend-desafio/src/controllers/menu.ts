import { Request, Response } from 'express'
import { MenuTreeItem } from '../models/menu-tree-item'
import Menu, { MenuModel } from '../models/menu'

async function populateChildrenMenus(menu: MenuModel): Promise<MenuTreeItem> {
  const menuItem = MenuTreeItem.fromModel(menu)
  const childrenMenus = await Menu.find({ relatedId: menu._id })

  if (childrenMenus.length) {
    menuItem.submenus = await Promise.all(
      childrenMenus.map(childrenMenu => populateChildrenMenus(childrenMenu)),
    )
  }

  return menuItem
}

async function getMenuTree(): Promise<MenuTreeItem[]> {
  const rootMenus = await Menu.find({ relatedId: { $exists: false } })

  return await Promise.all(rootMenus.map(rootMenu => populateChildrenMenus(rootMenu)))
}

export default {
  create: async (req: Request, res: Response): Promise<Response> => {
    const { id } = await Menu.create(req.body)

    return res.status(202).json({
      id,
    })
  },
  getAll: async (_: Request, res: Response): Promise<Response> => {
    const menu = await Menu.find()

    return res.json(menu)
  },
  getMenus: async (_: Request, res: Response): Promise<Response> => {
    const menu = await getMenuTree()

    return res.json(menu)
  },
  update: async (req: Request, res: Response): Promise<Response> => {
    const menu = await Menu.findOne({ _id: req.params.id })
    if (!menu || !menu?.id) return res.status(400).json({ message: 'Menu not found' })

    await Menu.updateOne({ id: menu.id }, req.body)
    return res.json({
      id: menu.id,
    })
  },
  delete: async (req: Request, res: Response): Promise<Response> => {
    const menu = await Menu.findOne({ _id: req.params.id })
    if (!menu || !menu?.id) return res.status(400).json({ message: 'Menu not found' })

    await Menu.deleteOne({ id: menu.id })
    return res.json({
      id: menu.id,
    })
  },
}
