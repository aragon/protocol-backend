import { BaseModel, User } from './'

export default class UserEmail extends BaseModel {
  static get tableName() {
    return 'UserEmails'
  }

  email?: string
  users?: User[]

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'User',
        join: {
          from: 'UserEmails.id',
          to: 'Users.userEmailId'
        }
      }
    }
  }
}
