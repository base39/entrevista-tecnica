import express from 'express'
import controller from '../controllers/menu'
import validator from '../validation/menu'

const routes = express.Router()

routes.post('/', validator.upsert, controller.create)
routes.get('/', controller.getAll)
routes.put('/:id', validator.objectId, validator.upsert, controller.update)
routes.delete('/:id', validator.objectId, controller.delete)
routes.get('/menus', controller.getMenus)

export default routes
