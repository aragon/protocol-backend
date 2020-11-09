import path from 'path'
import dotenv from 'dotenv'
import { Config } from 'knex'

dotenv.config()

const config: Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, './seeds'),
  },
}

export default config
export const { client, connection, migrations, seeds } = config // knex cli format
