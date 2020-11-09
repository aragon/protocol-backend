import * as Knex from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Sessions', function (table) {
    table.increments('id')
    table.string('sid').unique().notNullable()
    table.jsonb('data').notNullable()
    table.integer('adminId').index()
    table.foreign('adminId').references('Admins.id').onDelete('CASCADE')
    table.integer('userId').index()
    table.foreign('userId').references('Users.id').onDelete('CASCADE')
    table.dateTime('expiresAt').index().notNullable()
    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  }).raw('ALTER TABLE "Sessions" ADD CONSTRAINT "admin_or_user" CHECK (("adminId" IS NOT NULL AND "userId" IS NULL) OR ("userId" IS NOT NULL AND "adminId" IS NULL));')
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Sessions')
}
