import { model, Schema, ObjectId } from 'mongoose'

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

export default model<MenuModel>('menu', schema, 'menus')
