import Knex from 'knex'
import { Model, MaybeCompositeId, QueryBuilder } from 'objection'

import config from '../../database/config'
Model.knex(Knex(config))

// "this" is not polymorphic for static methods, need to cast return values
// Ongoing issue as of Nov 7, 2020: https://github.com/microsoft/TypeScript/issues/5863
type SingleResult<T extends typeof BaseModel> = QueryBuilder<InstanceType<T>, InstanceType<T>>
export { SingleResult }

export default class BaseModel extends Model {
  // modelPaths is used to allow modelClass relations be defined as a string to avoid require loops
  // https://vincit.github.io/objection.js/guide/relations.html#require-loops
  static get modelPaths(): [string] {
    return [__dirname];
  }

  id!: MaybeCompositeId
  updatedAt?: Date
  createdAt?: Date

  $beforeUpdate: Model['$beforeUpdate'] = async (opt, queryContext) => {
    await super.$beforeUpdate(opt, queryContext)
    this.updatedAt = new Date()
  }


  // static query methods (table level)

  static async exists(args: any): Promise<boolean> {
    return !!(await this.findOne(args))
  }

  static count(args: any): Promise<number> {
    return this.query().where(args).resultSize()
  }

  static findById<T extends typeof BaseModel>(
    this: T,
    id: BaseModel['id']
  ): SingleResult<T> {
    return this.query().findById(id) as SingleResult<T>
  }

  static findOne<T extends typeof BaseModel>(
    this: T,
    args: any
  ): SingleResult<T> {
    return this.query().findOne(args) as SingleResult<T>
  }
  
  static async findOrInsert<T extends typeof BaseModel>(
    this: T, 
    args: any
  ): Promise<SingleResult<T>> {
    let row = await this.findOne(args)
    if (!row) row = await this.create(args)
    return row as SingleResult<T>
  }

  static create<T extends typeof BaseModel>(
    this: T, 
    args: any = {}
  ): SingleResult<T> {
    return this.query().insert(args) as SingleResult<T>
  }
  

  // instance query methods (row level)
  
  async relatedUpdateOrInsert(relation: string, args: any): Promise<void> {
    const row = await this.$relatedQuery(relation)
    if (row) {
      await this.$relatedQuery(relation).update(args)
    } else {
      await this.$relatedQuery(relation).insert(args)
    }
  }

  get createdAtDateString(): string {
    if (!this.createdAt) {
      throw Error('createdAt field missing')
    }
    return this.createdAt.toLocaleDateString('en-US', ({dateStyle: 'full'} as Intl.DateTimeFormatOptions)) // format: Tuesday, May 19, 2020
  }
}
