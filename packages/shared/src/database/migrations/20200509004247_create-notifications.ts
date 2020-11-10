import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('UserNotifications', function (table) {
    table.increments('id')
    table.jsonb('details').index()
    table.dateTime('sentAt').index()
    table.integer('userNotificationTypeId').index().notNullable()
    table.foreign('userNotificationTypeId').references('UserNotificationTypes.id').onDelete('CASCADE')
    table.integer('userId').index().notNullable()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('UserNotifications')
}
