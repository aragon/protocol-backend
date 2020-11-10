import { BaseModel, UserNotification } from './'

export default class UserNotificationType extends BaseModel {
  static get tableName() {
    return 'UserNotificationTypes'
  }

  model?: string
  scannedAt?: Date
  notifications?: UserNotification[]

  static get relationMappings() {
    return {
      notifications: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'UserNotification',
        join: {
          from: 'UserNotificationTypes.id',
          to: 'UserNotifications.userNotificationTypeId'
        }
      },
    }
  }
}
