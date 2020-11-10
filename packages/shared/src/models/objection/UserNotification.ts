import { BaseModel, User, UserNotificationType } from './'
import { HOURS } from '../../helpers/times'

export default class UserNotification extends BaseModel {
  static get tableName() {
    return 'UserNotifications'
  }

  details?: any
  sentAt?: Date
  userNotificationTypeId?: number
  userId?: number
  user?: User
  type?: UserNotificationType

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserNotifications.userId',
          to: 'Users.id'
        },
      },
      type: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserNotificationType',
        join: {
          from: 'UserNotifications.userNotificationTypeId',
          to: 'UserNotificationTypes.id'
        },
      },
    }
  }

  static findUnsent() {
    return this.query()
      .whereNull('sentAt')
      .andWhere('createdAt', '>', new Date(Date.now()-HOURS))
  }
}
