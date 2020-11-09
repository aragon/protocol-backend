import Knex from 'knex'
import sleep from '../helpers/sleep'
import { SECONDS } from '../helpers/times'

import config from '../database/config'
const knex = Knex(config)

async function waitConnection() {
  for (;;) {
    try {
      return await knex.migrate.currentVersion()
    }
    catch (error) {
      if (error.code == 'ECONNREFUSED') {
        console.log('Database connection timed out, retrying in 5 seconds...')
        await sleep(5 * SECONDS)
      }
      else {
        throw error
      }
    }
  }
}

async function main() {
  console.log('Running knex database migrations...')
  await waitConnection()
  await knex.migrate.latest()
  knex.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
