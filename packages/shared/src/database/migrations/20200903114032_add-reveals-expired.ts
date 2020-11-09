import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Reveals', function (table) {
    table.boolean('expired').notNullable().defaultTo(false)
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Reveals', function (table) {
    table.dropColumn('expired')
  })
}
