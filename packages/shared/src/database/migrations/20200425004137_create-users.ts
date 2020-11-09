import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Users', function (table) {
    table.increments('id')
    table.string('address').unique().notNullable()
    table.boolean('addressVerified').defaultTo(false).notNullable()
    table.integer('userEmailId').index()
    table.foreign('userEmailId').references('UserEmails.id').onDelete('SET NULL')
    table.boolean('emailVerified').defaultTo(false).notNullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Users')
}
