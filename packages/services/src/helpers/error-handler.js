const logger = require('@aragon/protocol-backend-shared/build/helpers/logger').default('Error Handler')

export default error => {
  logger.error(`Process finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
