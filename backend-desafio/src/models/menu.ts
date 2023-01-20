import { model, Schema, ObjectId } from 'mongoose'
import { parseMenu } from '../utils/menu-aggregation'

export interface MenuModel {
  _id?: ObjectId
  name: string
  relatedId: ObjectId
}

const schema = new Schema<MenuModel>({
  name: {
    type: String,
    required: [true, 'Name can not be empty'],
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    ref: 'Menu',
  },
})

schema.post('aggregate', parseMenu)

export default model<MenuModel>('menu', schema, 'menus')
