import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('UserNotificationSettings', function (table) {
    table.increments('id')
    table.boolean('notificationsDisabled').defaultTo(false).notNullable()
    table.integer('userId').index().notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('UserNotificationSettings')
}
