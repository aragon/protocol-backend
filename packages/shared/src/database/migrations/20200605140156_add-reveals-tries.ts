import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Reveals', function (table) {
    table.integer('failedAttempts').notNullable().defaultTo(0)
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Reveals', function (table) {
    table.dropColumn('failedAttempts')
  })
}
