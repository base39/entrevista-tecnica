import { PipelineStage } from 'mongoose'
import { MenuModel } from '../models/menu'

const whitelistProperties = ['id', 'name', 'submenus']

type MenuTreeItem = MenuModel & {
  submenus?: MenuTreeItem[]
}

export const parseMenu = (menus: MenuTreeItem[]) =>
  menus.forEach(item => {
    if (item.submenus) parseMenu(item.submenus)

    Reflect.defineProperty(item, 'id', {
      value: item._id!.toString(),
    })
    Object.keys(item).forEach(
      key => !whitelistProperties.includes(key) && Reflect.deleteProperty(item, key),
    )
  })

export const buildTreeQuery: PipelineStage[] = [
  {
    $match: {
      relatedId: null,
    },
  },
  {
    $graphLookup: {
      from: 'menus',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'relatedId',
      depthField: 'level',
      as: 'submenus',
    },
  },
  {
    $unwind: {
      path: '$submenus',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $sort: {
      'submenus.level': -1,
    },
  },
  {
    $group: {
      _id: '$_id',
      relatedId: {
        $first: '$relatedId',
      },
      name: {
        $first: '$name',
      },
      submenus: {
        $push: '$submenus',
      },
    },
  },
  {
    $addFields: {
      submenus: {
        $reduce: {
          input: '$submenus',
          initialValue: {
            level: -1,
            presentChild: [],
            prevChild: [],
          },
          in: {
            $let: {
              vars: {
                prev: {
                  $cond: [
                    {
                      $eq: ['$$value.level', '$$this.level'],
                    },
                    '$$value.prevChild',
                    '$$value.presentChild',
                  ],
                },
                current: {
                  $cond: [
                    {
                      $eq: ['$$value.level', '$$this.level'],
                    },
                    '$$value.presentChild',
                    [],
                  ],
                },
              },
              in: {
                level: '$$this.level',
                prevChild: '$$prev',
                presentChild: {
                  $concatArrays: [
                    '$$current',
                    [
                      {
                        $mergeObjects: [
                          '$$this',
                          {
                            submenus: {
                              $filter: {
                                input: '$$prev',
                                as: 'e',
                                cond: {
                                  $eq: ['$$e.relatedId', '$$this._id'],
                                },
                              },
                            },
                          },
                        ],
                      },
                    ],
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      submenus: '$submenus.presentChild',
    },
  },
]
