import { BaseModel, User } from './'

export default class UserNotificationSetting extends BaseModel {
  static get tableName() {
    return 'UserNotificationSettings'
  }

  notificationsDisabled?: boolean
  userId?: number
  user?: User

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserNotificationSettings.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
