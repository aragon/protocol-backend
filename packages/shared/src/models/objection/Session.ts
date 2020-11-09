import { BaseModel, User, Admin } from './'

export default class Session extends BaseModel {
  static get tableName() {
    return 'Sessions'
  }

  sid?: string
  data?: any
  adminId?: number
  userId?: number
  expiresAt?: Date
  user?: User
  admin?: Admin

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'Sessions.userId',
          to: 'Users.id'
        },
      },
      admin: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Admin',
        join: {
          from: 'Sessions.adminId',
          to: 'Admins.id'
        },
      }
    }
  }

  static async getData(sid: Session['sid']) {
    const session = await this.findOne({sid})
    return session?.data
  }

  static async setData(sid: Session['sid'], newData: Session['data']): Promise<void> {
    for (const prop of ['userId', 'adminId']) {
      if (Object.prototype.hasOwnProperty.call(newData, prop)) {
        const row = {
          sid,
          data: newData,
          [prop]: newData[prop],
          expiresAt: newData.cookie._expires
        }
        const sessionData = await this.getData(sid)
        if (sessionData) {
          await this.query().where({sid}).update(row)
        } else {
          await this.query().insert(row)
        }
      }
    }
  }
}
