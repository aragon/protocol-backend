import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('UserEmails', function (table) {
    table.increments('id')
    table.string('email').unique().notNullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('UserEmails')
}
