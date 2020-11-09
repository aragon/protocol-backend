import { BaseModel, Session, UserNotificationSetting, UserNotification, UserEmailVerificationToken, UserEmail } from './'
import { SingleResult } from './BaseModel'
import emailClient from '../../helpers/email-client'
import { generateToken } from '../../helpers/jwt-manager'

import { DAYS } from '../../helpers/times'
const EMAIL_TOKEN_EXPIRES = DAYS
const EMAIL_TOKEN_OLD = DAYS

export default class User extends BaseModel {

  static get tableName() {
    return 'Users'
  }

  address?: string
  addressVerified?: boolean
  userEmailId?: number
  emailVerified?: boolean
  sessions?: Session[]
  notificationSetting?: UserNotificationSetting
  notifications?: UserNotification[]
  emailVerificationToken?: UserEmailVerificationToken
  email?: UserEmail

  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Session',
        join: {
          from: 'Users.id',
          to: 'Sessions.userId'
        }
      },
      notificationSetting: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserNotificationSetting',
        join: {
          from: 'Users.id',
          to: 'UserNotificationSettings.userId'
        }
      },
      notifications: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'UserNotification',
        join: {
          from: 'Users.id',
          to: 'UserNotifications.userId'
        }
      },
      emailVerificationToken: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserEmailVerificationToken',
        join: {
          from: 'Users.id',
          to: 'UserEmailVerificationTokens.userId'
        }
      },
      email: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserEmail',
        join: {
          from: 'Users.userEmailId',
          to: 'UserEmails.id'
        },
      }
    }
  }

  static findOne<T extends typeof BaseModel>(
    this: T,
    args: any
  ): SingleResult<T> {
    if (args.address) args.address = args.address.toLowerCase()
    return super.findOne(args) as SingleResult<T>
  }

  $beforeInsert: BaseModel['$beforeInsert'] = async (queryContext) => {
    await super.$beforeInsert(queryContext)
    if (this.address) this.address = this.address.toLowerCase()
  }

  $beforeUpdate: BaseModel['$beforeUpdate'] = async (opt, queryContext) => {
    await super.$beforeUpdate(opt, queryContext)
    if (this.address) this.address = this.address.toLowerCase()
  }

  static async findWithUnverifiedEmail(): Promise<User[]> {
    const users = await this.query().where({emailVerified: false}).withGraphFetched('[email, emailVerificationToken]')
    return users.filter(user => !!user.email)
  }

  static async findWithoutDisabledNotifications(): Promise<User[]> {
    const users = await this.query().withGraphFetched('[email, notificationSetting]')
    return users.filter(user => !!user.email && !user.notificationSetting?.notificationsDisabled)
  }

  static async findWithOldVerificationToken(): Promise<User[]> {
    const users = await this.findWithUnverifiedEmail()
    return users.filter(user => user.emailVerificationToken && user.emailVerificationToken.expiresAt! <= new Date(Date.now()-EMAIL_TOKEN_OLD))
  }

  static async findUnverifiedAnjRegistrations(): Promise<User[]> {
    const users = await this.findWithUnverifiedEmail()
    return users.filter(user => !user.addressVerified)
  }

  async relateEmail(email: string): Promise<void> {
    await this.unrelateEmail()
    const emailInstance = await UserEmail.findOne({email})
    if (emailInstance) {
      await this.$relatedQuery('email').relate(emailInstance)
    } else {
      await this.$relatedQuery('email').insert({email})
    }
  }

  async unrelateEmail(): Promise<void> {
    const user = await this.$fetchGraph('email')
    let emailInstance = user.email
    await user.$relatedQuery('email').unrelate()
    // clean emails with no users
    if (emailInstance) {
      emailInstance = await emailInstance.$fetchGraph('users')
      if (emailInstance.users?.length == 0) {
        await emailInstance.$query().del()
      }
    }
  }
  
  async sendVerificationEmail(): Promise<void> {
    const user = await this.$fetchGraph('email')
    const { email: userEmail, address } = user
    if (!userEmail) throw new Error(`No associated email found for user ${user.address}`)
    const { email } = userEmail
    const tokenExpiresSeconds = EMAIL_TOKEN_EXPIRES/1000
    const token = generateToken(tokenExpiresSeconds)
    await user.relatedUpdateOrInsert('emailVerificationToken', {
      email: email!,
      token,
      expiresAt: new Date(Date.now()+EMAIL_TOKEN_EXPIRES)
    })
    await emailClient.sendMagicLink({
      email: email!, 
      address: address!, 
      token
    })
  }
}
