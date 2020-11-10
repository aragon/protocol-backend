import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('UserEmailVerificationTokens', function (table) {
    table.increments('id')
    table.string('email').notNullable()
    table.string('token').notNullable()
    table.integer('userId').index().notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.dateTime('expiresAt').index().notNullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('UserEmailVerificationTokens')
}
