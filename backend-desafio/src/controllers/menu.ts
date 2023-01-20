import { Request, Response } from 'express'
import { MenuTreeItem } from '../models/menu-tree-item'
import Menu, { MenuModel } from '../models/menu'

function populateChildrenMenus(menus: MenuModel[], relatedId?: string): MenuTreeItem[] {
  return menus
    .filter(menu => menu.relatedId?.toString() === relatedId)
    .map(menu => ({
      id: menu._id!.toString(),
      nome: menu.name,
      submenus: populateChildrenMenus(menus, menu._id!.toString()),
    }))
}

async function getMenuTree(): Promise<MenuTreeItem[]> {
  const allMenus = await Menu.find()
  return populateChildrenMenus(allMenus)
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
