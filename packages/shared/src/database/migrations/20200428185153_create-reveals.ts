import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Reveals', function (table) {
    table.increments('id')
    table.string('voteId').notNullable()
    table.string('guardian').notNullable()
    table.unique(['guardian', 'voteId'])
    table.string('disputeId').notNullable()
    table.integer('roundNumber').notNullable()
    table.integer('outcome').notNullable()
    table.string('salt').notNullable()
    table.boolean('revealed').defaultTo(false).notNullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Reveals')
}
