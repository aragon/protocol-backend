import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('KeeperSuspiciousTransactions', function (table) {
    table.increments('id')
    table.string('blockNumber').unique().notNullable()
    table.string('txHash').unique().nullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('KeeperSuspiciousTransactions')
}
