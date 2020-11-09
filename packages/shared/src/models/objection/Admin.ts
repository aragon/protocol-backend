import BaseModel from './BaseModel'
import { Session } from './'
import bcrypt from 'bcryptjs'

export default class Admin extends BaseModel {
  static get tableName() {
    return 'Admins'
  }

  email?: string
  password?: string
  sessions?: Session[]

  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Session',
        join: {
          from: 'Admins.id',
          to: 'Sessions.adminId'
        }
      }
    }
  }

  static async countByEmail(email: string): Promise<number> {
    return this.query().where({ email }).resultSize()
  }

  static async findByEmail(email: string): Promise<Admin> {
    return this.findOne({ email })
  }

  static async findAllEmails(): Promise<string[]> {
    const admins = await this.query().select('email')
    return admins.map(admin => admin.email!)
  }

  hasPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password!)
  }

  hashPassword(): void {
    if (this.password) this.password = bcrypt.hashSync(this.password)
  }

  $beforeInsert: BaseModel['$beforeInsert'] = async (queryContext) => {
    await super.$beforeInsert(queryContext)
    this.hashPassword()
  }

  $beforeUpdate: BaseModel['$beforeUpdate'] = async (opt, queryContext) => {
    await super.$beforeUpdate(opt, queryContext)
    this.hashPassword()
  }
}
