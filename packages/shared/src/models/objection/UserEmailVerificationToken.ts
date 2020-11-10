import { BaseModel, User } from './'

export default class UserEmailVerificationToken extends BaseModel {
  static get tableName() {
    return 'UserEmailVerificationTokens'
  }

  email?: string
  token?: string
  userId?: number
  expiresAt?: Date
  user?: User

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserEmailVerificationTokens.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
